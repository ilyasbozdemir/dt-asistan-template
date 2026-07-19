import { z } from 'zod';

export const IhtiyacListesiSchema = z.object({
  antetSatirlari: z.any().optional(),
  evrakSayisi: z.any().optional(),
  dosyaKonusu: z.any().optional(),
  maddeNo: z.any().optional(),
  tarih: z.any().optional(),
  sunulacakMakamAdi: z.any().optional(),
  talepEdenPersonelAdi: z.any().optional(),
  talepEdenPersonelUnvan: z.any().optional(),
  kurumIci: z.any().optional(),
  kurumAdres: z.any().optional(),
  kurumTelefon: z.any().optional(),
  kurumFaks: z.any().optional(),
  kurumWeb: z.any().optional(),
  kurumEposta: z.any().optional(),
  kurumKep: z.any().optional(),
  solLogo: z.any().optional(),
  sagLogo: z.any().optional(),
  ihtiyacYeri: z.any().optional(),
  ihtiyacKalemleri: z.any().optional(),
  olurYazisi: z.any().optional(),
  dosyaTarihi: z.any().optional(),
  onaylayanPersonelAdi: z.any().optional(),
  onaylayanPersonelUnvan: z.any().optional(),
  olurBaslik: z.any().optional(),
  hazirlayanPersonelAdi: z.any().optional(),
  hazırlayanPersonelUnvan: z.any().optional(),
  hazirlayanTelefon: z.any().optional(),
  hazirlayanEposta: z.any().optional(),
}).catchall(z.any());

export type IhtiyacListesiType = z.infer<typeof IhtiyacListesiSchema>;

export const defaultIhtiyacListesiData: Partial<IhtiyacListesiType> = {
  "antetSatirlari": [
    "T.C.",
    "SAĞLIK BAKANLIĞI",
    "Ankara İl Sağlık Müdürlüğü",
    "Destek Hizmetleri Başkanlığı"
  ],
  "evrakSayisi": "95240212-2026/123",
  "dosyaKonusu": "İhtiyaç Listesi",
  "maddeNo": "22/d",
  "tarih": "14.06.2026",
  "sunulacakMakamAdi": "İl Sağlık Müdürlüğüne",
  "talepEdenPersonelAdi": "Ayşe Demir",
  "talepEdenPersonelUnvan": "Poliklinik Hemşiresi",
  "kurumIci": true,
  "kurumAdres": "Mustafa Kemal Mah. Dumlupınar Blv. No:1 Çankaya/Ankara",
  "kurumTelefon": "0312 555 44 33",
  "kurumFaks": "0312 555 44 34",
  "kurumWeb": "www.saglik.gov.tr",
  "kurumEposta": "ankara.destek@saglik.gov.tr",
  "kurumKep": "saglikbakanligi@hs01.kep.tr",
  "solLogo": "https://raw.githubusercontent.com/ilyasbozdemir/dt-asistan-desktop-app/refs/heads/main/desktop/resources/icon.png",
  "sagLogo": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Logo_of_100th_years_of_the_Republic_of_T%C3%BCrkiye.svg",
  "ihtiyacYeri": "İhtiyacın yapılacağı yer",
  "ihtiyacKalemleri": [
    {
      "kodu": "LAB-001",
      "malzemeAdi": "Eldiven",
      "ozelligi": "Nitril",
      "birimi": "Kutu",
      "kdvOrani": "20",
      "miktar": 50,
      "siraNo": 1
    },
    {
      "kodu": "LAB-002",
      "malzemeAdi": "Maske",
      "ozelligi": "N95",
      "birimi": "Adet",
      "kdvOrani": "10",
      "miktar": 200,
      "siraNo": 2
    },
    {
      "kodu": "LAB-003",
      "malzemeAdi": "Laboratuvar Önlüğü",
      "ozelligi": "Tek Kullanımlık",
      "birimi": "Adet",
      "kdvOrani": "20",
      "miktar": 100,
      "siraNo": 3
    },
    {
      "kodu": "LAB-004",
      "malzemeAdi": "Koruyucu Gözlük",
      "ozelligi": "Şeffaf",
      "birimi": "Adet",
      "kdvOrani": "20",
      "miktar": 30,
      "siraNo": 4
    },
    {
      "kodu": "LAB-005",
      "malzemeAdi": "Enjektör",
      "ozelligi": "5 ml",
      "birimi": "Adet",
      "kdvOrani": "10",
      "miktar": 500,
      "siraNo": 5
    },
    {
      "kodu": "LAB-006",
      "malzemeAdi": "Numune Kabı",
      "ozelligi": "Steril",
      "birimi": "Adet",
      "kdvOrani": "20",
      "miktar": 300,
      "siraNo": 6
    },
    {
      "kodu": "LAB-007",
      "malzemeAdi": "Pipet Ucu",
      "ozelligi": "1000 µl",
      "birimi": "Kutu",
      "kdvOrani": "20",
      "miktar": 40,
      "siraNo": 7
    },
    {
      "kodu": "LAB-008",
      "malzemeAdi": "Santrifüj Tüpü",
      "ozelligi": "15 ml",
      "birimi": "Paket",
      "kdvOrani": "20",
      "miktar": 60,
      "siraNo": 8
    },
    {
      "kodu": "LAB-009",
      "malzemeAdi": "Lam",
      "ozelligi": "Mikroskop Camı",
      "birimi": "Kutu",
      "kdvOrani": "20",
      "miktar": 25,
      "siraNo": 9
    },
    {
      "kodu": "LAB-010",
      "malzemeAdi": "Lamel",
      "ozelligi": "22x22 mm",
      "birimi": "Kutu",
      "kdvOrani": "20",
      "miktar": 20,
      "siraNo": 10
    }
  ],
  "olurYazisi": true,
  "dosyaTarihi": "14.06.2026",
  "onaylayanPersonelAdi": "Dr. Mehmet Demir",
  "onaylayanPersonelUnvan": "İl Sağlık Müdürü",
  "olurBaslik": "OLUR",
  "hazirlayanPersonelAdi": "Ayşe Demir",
  "hazırlayanPersonelUnvan": "V.H.K.İ.",
  "hazirlayanTelefon": "0312 555 44 33",
  "hazirlayanEposta": "hazirlayan@kurum.gov.tr",
  "firstPageLimit": 12,
  "middlePageLimit": 18,
  "lastPageLimit": 8
};
