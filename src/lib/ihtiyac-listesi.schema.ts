import { z } from 'zod'
import { BaseTemplateSchema } from './base.schema'

/**
 * İhtiyaç Listesi Şablonu Schema
 * 
 * Temel olarak kullanılan yerler:
 * - /dosya/hazirlik-ve-ihtiyac
 * - /dosya/malzemeler/liste
 * 
 * Database tablolarında:
 * - DATA_TeminKalem (kalemler)
 * - DATA_TeminDosyasi (dosya bilgisi)
 */

export const IhtiyacKalemiSchema = z.object({
  siraNo: z.number().int().positive().describe('Sıra numarası (1, 2, 3...)'),
  kodu: z
    .string()
    .optional()
    .describe('Taşınır Kodu veya OKAS Kodu (LAB-001 gibi)'),
  malzemeAdi: z.string().describe('Kalem adı (Eldiven, Maske vb.)'),
  ozelligi: z.string().optional().describe('Kalem özelliği / tanımlaması'),
  birimi: z.string().optional().describe('Birim (Adet, Kutu, Paket vb.)'),
  kdvOrani: z
    .union([z.number(), z.string()])
    .optional()
    .describe('KDV Oranı (% olarak)'),
  miktar: z.union([z.number(), z.string()]).optional().describe('Miktar')
})

export type IhtiyacKalemi = z.infer<typeof IhtiyacKalemiSchema>

export const IhtiyacListesiSchema = BaseTemplateSchema.extend({
  // ──────────────────────────────────
  // SPESIFIK ALANLAR
  // ──────────────────────────────────

  /**
   * İhtiyacın yapılacağı yer
   * Örn: "İhtiyacın yapılacağı yer" (static)
   */
  ihtiyacYeri: z.string().optional().default('İhtiyacın yapılacağı yer'),

  /**
   * KALEMLERİ (Zorunlu)
   * Her kalemin sıra numarası, adı, miktar vb. bilgisini içerir
   */
  ihtiyacKalemleri: z
    .array(IhtiyacKalemiSchema)
    .optional()
    .describe('Talep edilen malzeme/hizmet kalemleri'),

  // ──────────────────────────────────
  // SAYILARA GÖRE TÜRKÇE ÇEVRİM
  // ──────────────────────────────────
  kalemSayisi: z.union([z.number(), z.string()]).optional(),
  kalemSayisiYazi: z.string().optional().describe('Kalem sayısı yazıyla (örn: "On Dört")'),

  // ──────────────────────────────────
  // AÇIKLAMA MADDELERİ (varsa)
  // ──────────────────────────────────
  aciklamaMaddeleri: z
    .array(
      z.object({
        siraNo: z.number().int().positive(),
        maddeMetni: z.string()
      })
    )
    .optional()
    .describe('İşin açıklama maddeleri'),
  hasAciklamaMaddeleri: z.boolean().optional(),

  // ──────────────────────────────────
  // KAPAK DETAYLARI (Kapak şablonu için)
  // ──────────────────────────────────
  kapakDetaylari: z
    .array(
      z.object({
        label: z.string(),
        lines: z.array(z.string()),
        isBold: z.boolean().optional()
      })
    )
    .optional(),

  // ──────────────────────────────────
  // YASAL ÇERÇEVE
  // ──────────────────────────────────
  /**
   * Madde No: Kamu İhale Kanunu'nun ilgili maddesi
   * Örn: "22/d" (Doğrudan Temin), "37" (Rekabetçi Diyalog) vb.
   */
  maddeNo: z.string().optional().default('22/d'),

  // ──────────────────────────────────
  // ONAY BİLGİSİ
  // ──────────────────────────────────
  /**
   * Olur Yazısı: Belgenin sonunda harcama yetkilisinin onayı
   */
  olurYazisi: z.boolean().optional(),

  // ──────────────────────────────────
  // TÜR (Mal / Hizmet / Yapım)
  // ──────────────────────────────────
  alimTuru: z.string().optional(),
  tur: z.enum(['mal', 'hizmet', 'yapim_isi', 'danismanlik']).optional()
})

export type IhtiyacListesi = z.infer<typeof IhtiyacListesiSchema>

/**
 * Validation helper
 */
export function validateIhtiyacListesi(data: unknown): {
  valid: boolean
  errors: string[]
  data?: IhtiyacListesi
} {
  const result = IhtiyacListesiSchema.safeParse(data)

  if (result.success) {
    return {
      valid: true,
      errors: [],
      data: result.data
    }
  }

  const errors = result.error.issues.map((issue) => {
    const path = issue.path.join('.')
    return `${path}: ${issue.message}`
  })

  return {
    valid: false,
    errors
  }
}

/**
 * Örnek veri (Development için)
 */
export const exampleIhtiyacListesi: IhtiyacListesi = {
  evrakSayisi: '95240212-2026/123',
  dosyaKonusu: 'İhtiyaç Listesi',
  maddeNo: '22/d',
  tarih: '14.06.2026',
  sunulacakMakamAdi: 'İl Sağlık Müdürlüğüne',
  talepEdenPersonelAdi: 'Ayşe Demir',
  talepEdenPersonelUnvan: 'Poliklinik Hemşiresi',
  kurumIci: true,
  kurumAdres: 'Mustafa Kemal Mah. Dumlupınar Blv. No:1 Çankaya/Ankara',
  kurumTelefon: '0312 555 44 33',
  kurumWeb: 'www.saglik.gov.tr',
  kurumEposta: 'ankara.destek@saglik.gov.tr',
  kurumKep: 'saglikbakanligi@hs01.kep.tr',
  ihtiyacYeri: 'İhtiyacın yapılacağı yer',
  ihtiyacKalemleri: [
    {
      siraNo: 1,
      kodu: 'LAB-001',
      malzemeAdi: 'Eldiven',
      ozelligi: 'Nitril',
      birimi: 'Kutu',
      kdvOrani: '20',
      miktar: 50
    },
    {
      siraNo: 2,
      kodu: 'LAB-002',
      malzemeAdi: 'Maske',
      ozelligi: 'N95',
      birimi: 'Adet',
      kdvOrani: '10',
      miktar: 200
    }
  ],
  kalemSayisi: 2,
  kalemSayisiYazi: 'İki',
  olurYazisi: true,
  dosyaTarihi: '14.06.2026',
  onaylayanPersonelAdi: 'Dr. Mehmet Demir',
  onaylayanPersonelUnvan: 'İl Sağlık Müdürü',
  hazirlayanPersonelAdi: 'Ayşe Demir',
  hazirlayanPersonelUnvan: 'V.H.K.İ.',
  hazirlayanTelefon: '0312 555 44 33'
}
