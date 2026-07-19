import { z } from 'zod'
import Mustache from 'mustache'

/**
 * ProcessMapping: Eski sistem uyumluluğu için
 * Dinamik placeholder → database column eşleştirmesi
 */
export interface ProcessMapping {
  [key: string]: any
}

/**
 * TemplateConfig: Yeni sistem - Tüm şablon metadata
 */
export interface TemplateConfig {
  id: string
  name: string
  category: string
  version: string
  schema: z.ZodSchema
  htmlPath: string
  legacyMapping?: ProcessMapping // Backward compat
  metadata: {
    pageSize: 'A4' | 'A3'
    margins: {
      top: number
      right: number
      bottom: number
      left: number
    }
    locale: 'tr-TR'
  }
}

/**
 * TemplateManager: Merkezi şablon yönetim motoru
 * - ID-based lookup (yeni sistem)
 * - Path-based lookup (eski sistem compat)
 * - Validation + Rendering
 */
export class TemplateManager {
  private templates: Map<string, TemplateConfig> = new Map()
  private pathToIdMap: Map<string, string> = new Map() // Eski path → yeni ID
  private htmlCache: Map<string, string> = new Map() // HTML cache

  /**
   * Şablon kayıt et
   */
  registerTemplate(config: TemplateConfig): void {
    if (this.templates.has(config.id)) {
      console.warn(`⚠️  Template '${config.id}' zaten kayıtlı, üzerine yazılıyor.`)
    }
    this.templates.set(config.id, config)
  }

  /**
   * Eski path-based lookupı support et
   * Örn: '/dosya/hazirlik-ve-ihtiyac' → 'ihtiyac-listesi'
   */
  registerLegacyPath(path: string, templateId: string): void {
    this.pathToIdMap.set(path, templateId)
  }

  /**
   * Yeni ID-based lookup
   */
  getTemplate(id: string): TemplateConfig | undefined {
    return this.templates.get(id)
  }

  /**
   * Eski path-based lookup (backward compat)
   */
  getTemplateByPath(path: string): TemplateConfig | undefined {
    const id = this.pathToIdMap.get(path)
    return id ? this.templates.get(id) : undefined
  }

  /**
   * Tüm template ID'lerini döndür
   */
  getAllTemplateIds(): string[] {
    return Array.from(this.templates.keys())
  }

  /**
   * Tüm şablonları döndür
   */
  getAllTemplates(): TemplateConfig[] {
    return Array.from(this.templates.values())
  }

  /**
   * Kategori bazında şablonları döndür
   */
  getTemplatesByCategory(category: string): TemplateConfig[] {
    return Array.from(this.templates.values()).filter((t) => t.category === category)
  }

  /**
   * Veri doğrula (Zod)
   */
  validate(templateId: string, data: unknown): { valid: boolean; error?: string } {
    const template = this.templates.get(templateId)
    if (!template) {
      return { valid: false, error: `Template '${templateId}' bulunamadı` }
    }

    const result = template.schema.safeParse(data)
    return {
      valid: result.success,
      error: result.success ? undefined : result.error.message
    }
  }

  /**
   * HTML'i yükle (cache ile)
   * Electron IPC veya fetch kullanabilir
   */
  private async loadHtml(htmlPath: string): Promise<string> {
    // Cache check
    if (this.htmlCache.has(htmlPath)) {
      return this.htmlCache.get(htmlPath)!
    }

    try {
      // Electron ortamında IPC kullan
      if (typeof window !== 'undefined' && (window as any).electron) {
        const html = await (window as any).electron.ipcRenderer.invoke(
          'template:read-file',
          htmlPath
        )
        if (typeof html === 'string') {
          this.htmlCache.set(htmlPath, html)
          return html
        }
      }
    } catch (error) {
      console.error(`HTML yüklenirken hata (${htmlPath}):`, error)
    }

    return ''
  }

  /**
   * Şablonu render et (Mustache)
   */
  async render(templateId: string, data: unknown): Promise<string> {
    const validation = this.validate(templateId, data)
    if (!validation.valid) {
      throw new Error(`Doğrulama başarısız: ${validation.error}`)
    }

    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template '${templateId}' bulunamadı`)
    }

    // HTML'i yükle
    const html = await this.loadHtml(template.htmlPath)
    if (!html) {
      throw new Error(`HTML dosyası yüklenemedid: ${template.htmlPath}`)
    }

    // Mustache render
    try {
      return Mustache.render(html, data)
    } catch (error) {
      throw new Error(`Render hatası: ${(error as Error).message}`)
    }
  }

  /**
   * HTML render et (doğrulama olmaksızın - preview için)
   */
  async renderWithoutValidation(templateId: string, data: any): Promise<string> {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template '${templateId}' bulunamadı`)
    }

    const html = await this.loadHtml(template.htmlPath)
    if (!html) {
      throw new Error(`HTML dosyası yüklenemedid: ${template.htmlPath}`)
    }

    return Mustache.render(html, data)
  }

  /**
   * Cache temizle
   */
  clearCache(): void {
    this.htmlCache.clear()
  }

  /**
   * Özet bilgi
   */
  info(): {
    totalTemplates: number
    categories: string[]
    legacyPaths: number
  } {
    const categories = Array.from(new Set(Array.from(this.templates.values()).map((t) => t.category)))
    return {
      totalTemplates: this.templates.size,
      categories,
      legacyPaths: this.pathToIdMap.size
    }
  }
}

/**
 * Global singleton instance
 */
export const templateManager = new TemplateManager()
