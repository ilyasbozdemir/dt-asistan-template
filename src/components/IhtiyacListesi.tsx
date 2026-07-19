/**
 * IHTIYAC LİSTESİ DOKUMENT
 * 
 * Resmi belge: İhtiyaç Listesi
 * Tüm shared components'ı bir araya getirir
 */

import React from 'react'
import { IhtiyacListesi as IhtiyacListesiType } from '../lib/ihtiyac-listesi.schema'
import { DocumentLayout } from './DocumentLayout'
import { DocumentTable } from './DocumentTable'
import { PersonelCard, ApprovalSignature, MetadataBlock } from './PersonelCard'

interface IhtiyacListesiProps {
  data: IhtiyacListesiType
}

export const IhtiyacListesiDocument: React.FC<IhtiyacListesiProps> = ({ data }) => {
  // Tablo sütunları
  const columns: any[] = [
    { key: 'siraNo', label: 'Sıra No', width: '8%', align: 'center' },
    { key: 'kodu', label: 'Kodu', width: '12%', align: 'left' },
    { key: 'malzemeAdi', label: 'Malzeme Adı', width: '25%', align: 'left' },
    { key: 'ozelligi', label: 'Özelliği', width: '20%', align: 'left' },
    { key: 'birimi', label: 'Birimi', width: '10%', align: 'center' },
    { key: 'kdvOrani', label: 'KDV %', width: '8%', align: 'center' },
    { key: 'miktar', label: 'Miktar', width: '12%', align: 'right' }
  ]

  return (
    <DocumentLayout
      ref={React.useRef<HTMLDivElement>(null)}
      data={data}
      hideFooter={false}
    >
      {/* METADATA (Sayı, Tarih, Konu) */}
      <MetadataBlock
        evrakSayisi={data.evrakSayisi}
        tarih={data.tarih}
        dosyaKonusu={data.dosyaKonusu}
        showBorder={true}
      />

      {/* BAŞLIK - Sunulacak Makam */}
      <div
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '12pt',
          textTransform: 'uppercase',
          marginBottom: '20px',
          pageBreakInside: 'avoid'
        }}
      >
        {data.sunulacakMakamAdi}
      </div>

      {/* İHTİYAÇ AÇIKLAMASI - PARAGRAPH 1 */}
      <div
        style={{
          textAlign: 'justify',
          textIndent: '40px',
          marginBottom: '15px',
          fontSize: '12pt',
          lineHeight: 1.5
        }}
      >
        {data.ihtiyacYeri} ihtiyacı olan aşağıda yazılı mal/hizmet kalemlerinin temin
        edilmesi gerekmektedir.
      </div>

      {/* İHTİYAÇ AÇIKLAMASI - PARAGRAPH 2 */}
      <div
        style={{
          textAlign: 'justify',
          textIndent: '40px',
          marginBottom: '20px',
          fontSize: '12pt',
          lineHeight: 1.5
        }}
      >
        Söz konusu ihtiyacın 4734 sayılı Kamu İhale Kanunun {data.maddeNo} maddesine göre
        temini için gereğini olurlarınıza arz ederim.
      </div>

      {/* TALEP EDEN - Sağ hizalanmış */}
      <PersonelCard
        adSoyad={data.talepEdenPersonelAdi}
        unvan={data.talepEdenPersonelUnvan}
        align="right"
        marginTop={20}
        marginBottom={30}
      />

      {/* KALEMLER TABLOSU */}
      <DocumentTable
        columns={columns}
        data={data.ihtiyacKalemleri || []}
        emptyMessage="Kalem bulunamadı"
        striped={false}
      />

      {/* ONAY BLOĞU */}
      {data.olurYazisi && (
        <ApprovalSignature
          title="OLUR"
          date={data.dosyaTarihi}
          adSoyad={data.onaylayanPersonelAdi}
          unvan={data.onaylayanPersonelUnvan}
          showSpace={true}
          marginTop={40}
        />
      )}
    </DocumentLayout>
  )
}

/**
 * Export default
 */
export default IhtiyacListesiDocument

/**
 * STORYBOOK / PREVIEW İçin örnek veri
 */
export const exampleProps: IhtiyacListesiProps = {
  data: {
    antetSatirlari: ['T.C.', 'SAĞLIK BAKANLIĞI', 'Ankara İl Sağlık Müdürlüğü'],
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
      },
      {
        siraNo: 3,
        kodu: 'LAB-003',
        malzemeAdi: 'Laboratuvar Önlüğü',
        ozelligi: 'Tek Kullanımlık',
        birimi: 'Adet',
        kdvOrani: '20',
        miktar: 100
      }
    ],
    olurYazisi: true,
    dosyaTarihi: '14.06.2026',
    onaylayanPersonelAdi: 'Dr. Mehmet Demir',
    onaylayanPersonelUnvan: 'İl Sağlık Müdürü',
    hazirlayanPersonelAdi: 'Ayşe Demir',
    hazirlayanPersonelUnvan: 'V.H.K.İ.',
    hazirlayanTelefon: '0312 555 44 33'
  }
}
