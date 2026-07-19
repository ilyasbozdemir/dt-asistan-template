/**
 * HOOK: useDocumentData
 * 
 * - Database'den belge verisini çek
 * - Şema doğrulaması yap
 * - Render için hazırla
 */

import { useCallback, useEffect, useState } from 'react'
import { templateManager } from './templates-config-index'
import { z } from 'zod'

interface UseDocumentDataResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  validation: {
    valid: boolean
    errors: string[]
  }
  refresh: () => Promise<void>
}

/**
 * Generic document data hook
 */
export function useDocumentData<T>(
  templateId: string,
  dosyaId: number,
  schema?: z.ZodSchema
): UseDocumentDataResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [validation, setValidation] = useState({ valid: false, errors: [] as string[] })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Electron IPC ile database'den çek
      if (typeof window !== 'undefined' && (window as any).electron) {
        const result = await (window as any).electron.ipcRenderer.invoke(
          'db:query',
          'SELECT * FROM DATA_TeminDosyasi WHERE id = ?',
          [dosyaId]
        )

        if (!result.success) {
          throw new Error('Database sorgusu başarısız')
        }

        if (!result.data || result.data.length === 0) {
          throw new Error('Dosya bulunamadı')
        }

        const rawData = result.data[0] as any

        // Şema doğrulaması (varsa)
        let validationResult = { valid: true, errors: [] as string[] }
        if (schema) {
          const parsed = schema.safeParse(rawData)
          validationResult = {
            valid: parsed.success,
            errors: parsed.success ? [] : parsed.error.issues.map((i) => i.message)
          }
        }

        setValidation(validationResult)
        setData(rawData as T)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bilinmeyen hata'
      setError(message)
      setValidation({ valid: false, errors: [message] })
    } finally {
      setLoading(false)
    }
  }, [dosyaId, schema])

  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    data,
    loading,
    error,
    validation,
    refresh: loadData
  }
}

/**
 * İhtiyaç Listesi özel hook
 */
import { IhtiyacListesiSchema, exampleIhtiyacListesi, IhtiyacListesi } from './ihtiyac-listesi.schema'

export function useIhtiyacListesiData(
  dosyaId: number
): UseDocumentDataResult<IhtiyacListesi> {
  const template = templateManager.getTemplate('ihtiyac-listesi')
  const schema = template?.schema

  return useDocumentData<IhtiyacListesi>(
    'ihtiyac-listesi',
    dosyaId,
    schema
  )
}

/**
 * Context builder helper
 * buildDocumentContext'ten veri çıkarır
 */
export function useDocumentContext(dosyaId: number) {
  const [context, setContext] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!dosyaId) return

    const loadContext = async () => {
      try {
        setLoading(true)

        if (typeof window !== 'undefined' && (window as any).electron) {
          // Tüm ilgili verileri paralel çek
          const dosyaRes = await (window as any).electron.ipcRenderer.invoke(
            'db:query',
            'SELECT * FROM DATA_TeminDosyasi WHERE id = ?',
            [dosyaId]
          )

          const kalemlerRes = await (window as any).electron.ipcRenderer.invoke(
            'db:query',
            'SELECT * FROM DATA_TeminKalem WHERE temin_dosya_id = ? ORDER BY id ASC',
            [dosyaId]
          )

          const kurumRes = await (window as any).electron.ipcRenderer.invoke(
            'db:query',
            'SELECT * FROM TANIM_Kurum WHERE id = 1'
          )

          if (dosyaRes.success && kalemlerRes.success && kurumRes.success) {
            const builtContext = {
              ...dosyaRes.data[0],
              ihtiyacKalemleri: kalemlerRes.data,
              kurum: kurumRes.data[0]
            }
            setContext(builtContext)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
      } finally {
        setLoading(false)
      }
    }

    loadContext()
  }, [dosyaId])

  return { context, loading, error }
}
