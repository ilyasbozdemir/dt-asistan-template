import { z } from 'zod'

/**
 * BASE_TEMPLATE_SCHEMA: Tüm şablonların ortak alanları
 * 
 * Her spesifik şablon bu schema'yı extend etmeli:
 * 
 * const IhtiyacListesiSchema = BaseTemplateSchema.extend({
 *   ihtiyacKalemleri: z.array(...),
 *   ...
 * })
 */

export const BaseTemplateSchema = z.object({
  // ──────────────────────────────────
  // METADATA
  // ──────────────────────────────────
  _meta: z
    .object({
      templateId: z.string(),
      templateVersion: z.string(),
      documentNumber: z.string().optional(),
      createdAt: z.string().datetime().optional(),
      updatedAt: z.string().datetime().optional()
    })
    .optional(),

  // ──────────────────────────────────
  // KURUM BİLGİLERİ (TANIM_Kurum)
  // ──────────────────────────────────
  kurumAdi: z.string().optional(),
  kurumUst: z.string().optional().describe('Üst kurum adı'),
  mudurluk: z.string().optional().describe('Müdürlük/Birim adı'),
  idareAdi: z.string().optional(),
  kurumAdres: z.string().optional(),
  kurumTelefon: z.string().optional(),
  kurumFaks: z.string().optional(),
  kurumWeb: z.string().url().optional(),
  kurumEposta: z.string().email().optional(),
  kurumKep: z.string().optional().describe('Kurumun KEP adresi'),

  // Antet (header) satırları
  antetSatirlari: z.array(z.string()).optional().describe('Kurum başlığı satırları'),

  // Logolar
  solLogo: z.string().url().optional(),
  sagLogo: z.string().url().optional(),

  // ──────────────────────────────────
  // EVRAK BİLGİLERİ
  // ──────────────────────────────────
  evrakSayisi: z.string().optional().describe('Doğrudan Temin Numarası'),
  dosyaKonusu: z.string().optional(),
  isAdi: z.string().optional(),
  isinAdi: z.string().optional(),
  isinAciklamasi: z.string().optional(),
  tarih: z.string().optional().describe('DD.MM.YYYY formatında'),
  dosyaTarihi: z.string().optional(),

  // ──────────────────────────────────
  // DOSYA / PROJESİ
  // ──────────────────────────────────
  teminNo: z.string().optional(),
  teminSekli: z.string().optional(),
  maddeNo: z.string().optional().describe('İhale Kanunu madde numarası (22/d vb.)'),
  butceYili: z.string().optional(),
  butceTertibi: z.array(z.string()).optional(),
  butceKodu: z.string().optional(),
  yaklasikMaliyet: z.string().optional(),
  odenekTutari: z.string().optional(),
  projeNo: z.string().optional(),

  // ──────────────────────────────────
  // ŞARTLAR VE AÇIKLAMALAR
  // ──────────────────────────────────
  avansSartlari: z.string().optional(),
  fiyatFarkiSartlari: z.string().optional(),
  yillaraYaygin: z.string().optional(),
  sozlesmeYapilacak: z.string().optional(),
  hesaplamaEsasi: z.string().optional(),
  komisyonTakdiri: z.string().optional(),

  // ──────────────────────────────────
  // PERSONEL BİLGİLERİ
  // ──────────────────────────────────
  // Hazırlayan
  hazirlayanPersonelAdi: z.string().optional(),
  hazirlayanPersonelUnvan: z.string().optional(),
  hazirlayanTelefon: z.string().optional(),
  hazirlayanEposta: z.string().email().optional(),

  // Onaylayan / Harcama Yetkilisi
  onaylayanPersonelAdi: z.string().optional(),
  onaylayanPersonelUnvan: z.string().optional(),
  baskanAdi: z.string().optional(),
  baskanUnvan: z.string().optional(),

  // Talep Eden
  talepEdenPersonelAdi: z.string().optional(),
  talepEdenPersonelUnvan: z.string().optional(),
  talepEdenTelefon: z.string().optional(),

  // Sunan
  sunanPersonelAdi: z.string().optional(),
  sunanPersonelUnvan: z.string().optional(),
  sunanTelefon: z.string().optional(),

  // İlgili Personel / İrtibat Yetkilisi
  ilgiliPersonelAdi: z.string().optional(),
  ilgiliPersonelUnvan: z.string().optional(),
  ilgiliTelefon: z.string().optional(),
  irtibatTelefon: z.string().optional(),

  // ──────────────────────────────────
  // YÜKLENİCİ FİRMA BİLGİLERİ
  // ──────────────────────────────────
  yukleniciFirma: z.string().optional(),
  yukleniciAdresi: z.string().optional(),
  yukleniciIlce: z.string().optional(),
  yukleniciIl: z.string().optional(),
  yukleniciTelefon: z.string().optional(),
  yukleniciFaks: z.string().optional(),
  yukleniciEposta: z.string().email().optional(),
  yukleniciVergiDairesi: z.string().optional(),
  yukleniciVergiNo: z.string().optional(),

  // ──────────────────────────────────
  // İDARE / KOMİSYON
  // ──────────────────────────────────
  idareAdresi: z.string().optional(),
  idareTelefon: z.string().optional(),
  idareEposta: z.string().email().optional(),

  komisyon: z
    .array(
      z.object({
        adSoyad: z.string(),
        unvan: z.string(),
        gorevi: z.string().optional()
      })
    )
    .optional(),

  fiyatKomisyonu: z.array(z.any()).optional(),
  muayeneKomisyonu: z.array(z.any()).optional(),
  ihaleKomisyonu: z.array(z.any()).optional(),

  // ──────────────────────────────────
  // TÜRKÇELEŞTİRME / HESAPLAMALAR
  // ──────────────────────────────────
  kurumumuz: z.string().optional(),
  kurumunuz: z.string().optional(),
  kurumu: z.string().optional(),
  kurumlari: z.string().optional(),

  // ──────────────────────────────────
  // BOOLEAN FLAGS
  // ──────────────────────────────────
  kurumIci: z.boolean().optional().describe('Kurum içi belge mi?'),
  olurYazisi: z.boolean().optional(),
  isAverageBasis: z.boolean().optional(),
  isEnDusuk: z.boolean().optional(),
  isMal: z.boolean().optional(),
  isHizmet: z.boolean().optional(),
  isYapim: z.boolean().optional(),

  // ──────────────────────────────────
  // FOOTER AREA
  // ──────────────────────────────────
  sunulacakMakamAdi: z.string().optional()
})

/**
 * TypeScript tip tanımı
 */
export type BaseTemplate = z.infer<typeof BaseTemplateSchema>

/**
 * Partial schema (validation olmaksızın render için)
 */
export const PartialBaseTemplateSchema = BaseTemplateSchema.partial()

/**
 * Helper: Schema'yı yazdır
 */
export function printSchemaFields(): string[] {
  const shape = BaseTemplateSchema.shape
  return Object.keys(shape)
}
