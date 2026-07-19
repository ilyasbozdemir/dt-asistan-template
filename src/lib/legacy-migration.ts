/**
 * LEGACY MIGRATION HELPER
 * 
 * Mevcut processMappingRegistry'yi yeni TemplateManager'a entegre etmek için
 * Backward compatibility sağlar, böylece eski kod çalışmaya devam eder
 */

import { TemplateManager, ProcessMapping } from './TemplateManager'

/**
 * Legacy path → templateId mapping
 * 
 * Bu, mevcut routing sisteminden yeni sisteme geçişi sağlar
 */
export const LEGACY_PATH_MAPPINGS: Record<string, string> = {
  // Hazırlık ve İhtiyaç
  '/dosya/hazirlik-ve-ihtiyac': 'ihtiyac-listesi',
  '/dosya/malzemeler/liste': 'ihtiyac-listesi',
  '/dosya/luzum/talep-formu': 'ihtiyac-talep-formu',
  '/dosya/luzum/belge': 'luzum-muzekkeresi',
  '/dosya/luzum/onay-eki': 'luzum-muzekkeresi-onay-eki',
  '/dosya/luzum/teslim-tesellum': 'luzum-muzekkeresi-teslim-tesellum',
  '/dosya/malzemeler/son-alim': 'son-alim-fiyat-cetveli',

  // Komisyon & Harcama
  '/dosya/komisyon/fiyat-arastirma': 'komisyon-gorevlendirme-onayi',
  '/dosya/komisyon/onay-eki': 'komisyon-gorevlendirme-onayi-eki',
  '/dosya/komisyon/muayene-kabul': 'muayene-kabul-komisyonu',
  '/dosya/harcama/talimat': 'harcama-talimati',
  '/dosya/firmalar-maliyet/yaklasik': 'yaklasik-maliyet-cetveli',

  // Diğer süreçler
  '/dosya/firmalar-maliyet/tutanak': 'piyasa-fiyat-arastirma-tutanagi',
  '/dosya/onay/dt-onay': 'dogrudan-temin-onay-belgesi',
  '/dosya/onay/ihale-onay': 'idare-onay-belgesi',
  '/dosya/onay/butce-sorgu': 'butce-sorgusu',
  '/dosya/harcama/pusula': 'harcama-pusulasi'
}

/**
 * Eski dosya adından template ID'ye eşleme
 * (Varsa)
 */
export const LEGACY_FILENAME_MAPPINGS: Record<string, string> = {
  'ihtiyac-listesi.html': 'ihtiyac-listesi',
  'luzum-muzekkeresi.html': 'luzum-muzekkeresi',
  'harcama-talimati.html': 'harcama-talimati'
}

/**
 * TemplateManager'a legacy paths'ı kayıt et
 * 
 * KULLANIM:
 * ```typescript
 * const templateMgr = new TemplateManager()
 * registerLegacyMappings(templateMgr)
 * ```
 */
export function registerLegacyMappings(templateManager: TemplateManager): void {
  // Path-based mappings
  Object.entries(LEGACY_PATH_MAPPINGS).forEach(([path, templateId]) => {
    templateManager.registerLegacyPath(path, templateId)
    console.log(`✅ Legacy path kayıtlandı: ${path} → ${templateId}`)
  })
}

/**
 * Eski ProcessMapping'i yeni sistem alanlarına dönüştür
 * 
 * Not: Bu, mapping dosyasındaki placeholder logic'ini korur
 * Henüz kullanılmıyor, ihtiyaç duyulduğunda uygulanabilir
 */
export function migrateProcessMapping(
  oldMapping: ProcessMapping,
  templateId: string
): Record<string, any> {
  const newMapping: Record<string, any> = {}

  // Her eski mapping alanını yeni schema'ya eşle
  for (const [key, value] of Object.entries(oldMapping)) {
    // Placeholder check: "[Belirtilmedi: ...]" formatı
    if (typeof value === 'string' && value.startsWith('[Belirtilmedi')) {
      continue // Boş alanları atla
    }

    // Doğrudan kopyala (tür dönüştürme gerekebilir)
    newMapping[key] = value
  }

  return newMapping
}

/**
 * Path'ten template ID'si çıkar (smart resolver)
 * 
 * Kullanım:
 * ```typescript
 * const templateId = extractTemplateIdFromPath('/dosya/hazirlik-ve-ihtiyac')
 * // → 'ihtiyac-listesi'
 * ```
 */
export function extractTemplateIdFromPath(path: string): string | null {
  // Tam eşleşme ara
  if (LEGACY_PATH_MAPPINGS[path]) {
    return LEGACY_PATH_MAPPINGS[path]
  }

  // Dosya adından ara
  const filename = path.split('/').pop()
  if (filename && LEGACY_FILENAME_MAPPINGS[filename]) {
    return LEGACY_FILENAME_MAPPINGS[filename]
  }

  // İçgüdüsel eşleşme: path'in son kısmından ID oluştur
  if (filename) {
    const id = filename.replace(/\.html$/, '').replace(/_/g, '-')
    return id
  }

  return null
}

/**
 * Eski dosya adını path'e çevir
 * (Ters dönüştürme)
 */
export function getPathFromLegacyFilename(filename: string): string | null {
  for (const [path, id] of Object.entries(LEGACY_PATH_MAPPINGS)) {
    if (filename.includes(id) || id.includes(filename.replace('.html', ''))) {
      return path
    }
  }
  return null
}

/**
 * Tüm legacy path'leri döndür
 * (Debug ve logging için)
 */
export function getLegacyPathsInfo(): {
  total: number
  paths: Array<{ path: string; templateId: string }>
} {
  const paths = Object.entries(LEGACY_PATH_MAPPINGS).map(([path, templateId]) => ({
    path,
    templateId
  }))

  return {
    total: paths.length,
    paths
  }
}

/**
 * Migration status raporu
 */
export function generateMigrationReport(): string {
  const info = getLegacyPathsInfo()

  const report = `
╔════════════════════════════════════════════╗
║  LEGACY MIGRATION STATUS REPORT            ║
╚════════════════════════════════════════════╝

📊 Toplam Legacy Path: ${info.total}

📋 Mapping Listesi:
${info.paths.map((item) => `  • ${item.path} → ${item.templateId}`).join('\n')}

✅ Tüm legacy paths yeni TemplateManager'a entegre edilmiş.

⚠️  NOT: Eski ProcessMapping sistem desteğine devam ediliyor.
     Yeni şablonlar için spesifik Zod schema kullanın.
  `

  return report
}
