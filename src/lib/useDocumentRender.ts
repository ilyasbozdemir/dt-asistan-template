/**
 * HOOK: useDocumentRender
 * 
 * - React component'i HTML'e dönüştür
 * - HTML'i PDF'e dönüştür (Electron)
 * - HTML'i DOCX'e dönüştür
 */

import { useCallback, useState } from 'react'

interface RenderOptions {
  filename?: string
  format?: 'pdf' | 'docx' | 'html'
}

interface UseDocumentRenderResult {
  rendering: boolean
  error: string | null
  render: (element: HTMLElement, options: RenderOptions) => Promise<void>
}

/**
 * Belge render hook - PDF/DOCX export
 */
export function useDocumentRender(): UseDocumentRenderResult {
  const [rendering, setRendering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const render = useCallback(async (element: HTMLElement, options: RenderOptions) => {
    try {
      setRendering(true)
      setError(null)

      const { filename = 'document', format = 'pdf' } = options

      // HTML'i string'e dönüştür
      const html = element.outerHTML

      // Electron IPC ile export et
      if (typeof window !== 'undefined' && (window as any).electron) {
        if (format === 'pdf') {
          await (window as any).electron.ipcRenderer.invoke(
            'export-pdf',
            html,
            null,
            filename
          )
        } else if (format === 'docx') {
          await (window as any).electron.ipcRenderer.invoke(
            'export-docx',
            html,
            filename
          )
        } else if (format === 'html') {
          // HTML dosyasını kaydet
          const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${filename}.html`
          a.click()
          URL.revokeObjectURL(url)
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Render hatası'
      setError(message)
      throw err
    } finally {
      setRendering(false)
    }
  }, [])

  return { rendering, error, render }
}

/**
 * Print hook - Yazıcıya gönder
 */
export function useDocumentPrint() {
  const [printing, setPrinting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const print = useCallback(async (element: HTMLElement, docName?: string) => {
    try {
      setPrinting(true)
      setError(null)

      if (typeof window !== 'undefined' && (window as any).electron) {
        const html = element.outerHTML
        await (window as any).electron.ipcRenderer.invoke('print-html', html, {
          silent: false,
          deviceName: undefined
        })
      } else {
        // Browser ortamında print
        window.print()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Yazdırma hatası'
      setError(message)
      throw err
    } finally {
      setPrinting(false)
    }
  }, [])

  return { printing, error, print }
}

/**
 * Belge validasyon ve hazırlama
 */
export interface DocumentValidationResult {
  valid: boolean
  missingFields: string[]
  warnings: string[]
}

export function useDocumentValidation() {
  const [validating, setValidating] = useState(false)

  const validate = useCallback(
    (data: any, requiredFields: string[]): DocumentValidationResult => {
      setValidating(true)

      const missingFields = requiredFields.filter((field) => {
        const value = data[field]
        return !value || (typeof value === 'string' && value.trim() === '')
      })

      const warnings: string[] = []

      // Ek kontroller
      if (data.ihtiyacKalemleri && data.ihtiyacKalemleri.length === 0) {
        warnings.push('Hiç kalem eklenmemiş')
      }

      if (!data.onaylayanPersonelAdi) {
        warnings.push('Onaylayan personel belirtilmemiş')
      }

      setValidating(false)

      return {
        valid: missingFields.length === 0,
        missingFields,
        warnings
      }
    },
    []
  )

  return { validate, validating }
}

/**
 * HTML string'i elementin outerHTML'ini kopyala
 */
export function extractDocumentHTML(element: HTMLElement | null): string {
  if (!element) return ''
  return element.outerHTML
}

/**
 * PDF preview'ı aç (Electron'da external)
 */
export async function openPDFPreview(element: HTMLElement, filename: string) {
  try {
    if (typeof window !== 'undefined' && (window as any).electron) {
      const html = element.outerHTML
      await (window as any).electron.ipcRenderer.invoke(
        'open-pdf-external',
        html,
        filename
      )
    } else {
      // Browser'da fallback
      const blob = new Blob([element.outerHTML], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url)
    }
  } catch (error) {
    console.error('PDF preview açılırken hata:', error)
  }
}
