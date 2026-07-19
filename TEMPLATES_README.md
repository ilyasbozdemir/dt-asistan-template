# 📄 TSX Template System - Kullanım Rehberi

Modern React + TypeScript ile **type-safe** ve **reusable** resmi belge şablonları.

---

## 🚀 Başlangıç

### 1. **Başlatma (App.tsx veya main.tsx'te)**

```typescript
import { initTemplatesNow } from 'src/templates'

function App() {
  useEffect(() => {
    initTemplatesNow() // Tüm şablonları hazırla
  }, [])

  return <YourApp />
}
```

### 2. **Basit Kullanım - İhtiyaç Listesi**

```typescript
import { 
  IhtiyacListesiDocument,
  useDocumentData,
  useDocumentRender
} from 'src/templates'

function IhtiyacListesiScreen() {
  const dosyaId = 123
  
  // 1. Veri çek
  const { data, loading } = useIhtiyacListesiData(dosyaId)
  
  // 2. Render hook'u
  const { render } = useDocumentRender()
  const docRef = useRef<HTMLDivElement>(null)

  // 3. PDF olarak indir
  const handleExportPDF = async () => {
    if (docRef.current) {
      await render(docRef.current, {
        filename: 'ihtiyac-listesi',
        format: 'pdf'
      })
    }
  }

  if (loading) return <Loader />

  return (
    <>
      {/* Belgeyi göster */}
      <div ref={docRef}>
        <IhtiyacListesiDocument data={data!} />
      </div>

      {/* Action buttons */}
      <button onClick={handleExportPDF}>📥 PDF İndir</button>
      <button onClick={() => window.print()}>🖨️ Yazdır</button>
    </>
  )
}
```

---

## 📦 Component Mimarisi

### Layout Hierarchy

```
DocumentLayout (Base wrapper)
├── DocumentHeader (Antet: Logo + Kurum adları)
├── Content Area
│   ├── DocumentTable (Kalemler tablosu)
│   ├── PersonelCard (Personel bilgisi)
│   └── ApprovalSignature (İmza bloğu)
└── DocumentFooter (Kurum iletişim bilgisi)
```

### Reusable Components

#### **DocumentTable** - Esnek tablo

```typescript
<DocumentTable
  columns={[
    { key: 'siraNo', label: 'Sıra No', width: '8%', align: 'center' },
    { key: 'malzemeAdi', label: 'Malzeme Adı', width: '50%' },
    { key: 'miktar', label: 'Miktar', width: '15%', align: 'right' }
  ]}
  data={kalemler}
  striped={false}
/>
```

#### **PersonelCard** - Personel bilgisi

```typescript
<PersonelCard
  adSoyad="Ayşe Demir"
  unvan="Poliklinik Hemşiresi"
  telefon="0312 555 44 33"
  align="right"
  marginTop={20}
/>
```

#### **ApprovalSignature** - İmza bloğu

```typescript
<ApprovalSignature
  title="OLUR"
  date="14.06.2026"
  adSoyad="Dr. Mehmet Demir"
  unvan="İl Sağlık Müdürü"
  showSpace={true}  // İmza için boş alan
/>
```

---

## 🔍 Veri Doğrulama (Zod Schemas)

Tüm şablonlar **strongly typed** ve **validated**:

```typescript
import { IhtiyacListesiSchema, validateIhtiyacListesi } from 'src/templates'

// ✅ Type-safe
const data: IhtiyacListesi = {
  ihtiyacKalemleri: [
    {
      siraNo: 1,
      malzemeAdi: 'Eldiven',
      miktar: 50
    }
  ]
}

// 🔍 Validate
const result = validateIhtiyacListesi(data)
if (!result.valid) {
  console.error(result.errors)
}
```

---

## 🎨 Stil ve Tema

Tüm şablonlar **GLOBAL_THEME** ile tutarlı:

```typescript
import { GLOBAL_THEME, generateCSSVariables } from 'src/templates'

// ✅ Tutarlı yazı tipi: Times New Roman
GLOBAL_THEME.typography.fontFamily
// ✅ Tutarlı margin: 1.5cm
GLOBAL_THEME.page.margins.top

// CSS değişkenlerini enjekte et
const cssVars = generateCSSVariables()
```

---

## 🖨️ PDF & Print

### PDF Export (Electron)

```typescript
import { useDocumentRender } from 'src/templates'

const { render, rendering } = useDocumentRender()

const handleExportPDF = async () => {
  await render(docRef.current!, {
    filename: 'ihtiyac-listesi',
    format: 'pdf'
  })
}
```

### Yazdırma

```typescript
import { useDocumentPrint } from 'src/templates'

const { print } = useDocumentPrint()

const handlePrint = async () => {
  await print(docRef.current!)
}
```

---

## 🆕 Yeni Şablon Ekleme

### Adım 1: Schema Oluştur

```typescript
// src/templates/schemas/yeni-sablon.schema.ts
import { BaseTemplateSchema } from './base.schema'
import { z } from 'zod'

export const YeniSablonSchema = BaseTemplateSchema.extend({
  ozelAlan1: z.string(),
  ozelAlan2: z.array(z.object({
    id: z.number(),
    ad: z.string()
  }))
})

export type YeniSablon = z.infer<typeof YeniSablonSchema>
```

### Adım 2: Component Oluştur

```typescript
// src/templates/components/documents/YeniSablon.tsx
import React from 'react'
import { YeniSablon } from '../schemas/yeni-sablon.schema'
import { DocumentLayout } from '../layouts/DocumentLayout'

interface YeniSablonProps {
  data: YeniSablon
}

export const YeniSablonDocument: React.FC<YeniSablonProps> = ({ data }) => {
  return (
    <DocumentLayout data={data}>
      {/* İçerik buraya */}
    </DocumentLayout>
  )
}
```

### Adım 3: TemplateManager'a Kayıt Et

```typescript
// src/templates/config/index.ts
import { YeniSablonSchema } from '../schemas/yeni-sablon.schema'

templateManager.registerTemplate({
  id: 'yeni-sablon',
  name: 'Yeni Şablon',
  category: 'Kategori',
  version: '1.0',
  schema: YeniSablonSchema,
  htmlPath: 'N/A', // TSX olduğu için N/A
  metadata: {
    pageSize: 'A4',
    margins: GLOBAL_THEME.page.margins,
    locale: 'tr-TR'
  }
})
```

### Adım 4: Export Et

```typescript
// src/templates/index.ts
export { YeniSablonDocument } from './components/documents/YeniSablon'
```

---

## 📋 Checklist - Yeni Şablon

- [ ] Schema yazıldı (`schemas/yeni-sablon.schema.ts`)
- [ ] Component yazıldı (`components/documents/YeniSablon.tsx`)
- [ ] TemplateManager'a kaydedildi
- [ ] `templates/index.ts`'e eklendi
- [ ] `useNEW_SablonData` hook'u yazıldı (isteğe bağlı)
- [ ] Storybook story'si yazıldı (isteğe bağlı)
- [ ] Unit test yazıldı (isteğe bağlı)

---

## 🧪 Testing (Storybook)

```typescript
// src/templates/stories/IhtiyacListesi.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { IhtiyacListesiDocument, exampleIhtiyacListesi } from 'src/templates'

const meta: Meta<typeof IhtiyacListesiDocument> = {
  component: IhtiyacListesiDocument,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: exampleIhtiyacListesi
  }
}
```

---

## 📂 Dosya Yapısı

```
src/templates/
├── components/
│   ├── layouts/
│   │   ├── DocumentLayout.tsx
│   │   ├── DocumentHeader.tsx
│   │   ├── DocumentFooter.tsx
│   │   ├── DocumentTable.tsx
│   │   └── index.ts
│   ├── documents/
│   │   ├── IhtiyacListesi.tsx
│   │   ├── LuzumMuzekkeresi.tsx
│   │   └── index.ts
│   ├── shared/
│   │   ├── PersonelCard.tsx
│   │   └── index.ts
│   └── typography/
│       └── index.ts
├── config/
│   ├── theme.config.ts
│   └── index.ts
├── hooks/
│   ├── useDocumentData.ts
│   ├── useDocumentRender.ts
│   └── index.ts
├── schemas/
│   ├── base.schema.ts
│   ├── ihtiyac-listesi.schema.ts
│   └── index.ts
├── utils/
│   ├── TemplateManager.ts
│   └── legacy-migration.ts
├── stories/ (Storybook)
│   └── *.stories.tsx
├── __tests__/
│   └── *.test.tsx
└── index.ts
```

---

## 🔄 Legacy Sistemden Geçiş

Eski `processMappingRegistry` + `useCiktiMerkeziData` hook'u kullanılıyor mu?

```typescript
// ✅ Yeni sistem (Recommended)
import { useIhtiyacListesiData } from 'src/templates'
const { data, loading } = useIhtiyacListesiData(dosyaId)

// ⚠️ Eski sistem (Still works)
import { useCiktiMerkeziData } from 'src/screens/CiktiMerkezi'
const { contextsByPath } = useCiktiMerkeziData(dosyaId)
```

---

## 🆘 Troubleshooting

### Problem: Type hatası - `IhtiyacListesi` uyuşmuyor

**Çözüm:** Schema'yı güncelleyin:

```typescript
import { IhtiyacListesiSchema } from 'src/templates'

const data = {
  // Tüm required alanları ekleyin
  ihtiyacKalemleri: []
} satisfies z.infer<typeof IhtiyacListesiSchema>
```

### Problem: Component render etmiyor

**Çözüm:** `initTemplatesNow()` çağrıldı mı?

```typescript
useEffect(() => {
  initTemplatesNow()
}, [])
```

### Problem: PDF export çalışmıyor

**Çözüm:** Electron IPC handler'ı kontrol edin:

```typescript
// main.ts (Electron)
ipcMain.handle('export-pdf', async (event, html, options, filename) => {
  // PDF export logic
})
```

---

## 📚 Referanslar

- [Zod Documentation](https://zod.dev)
- [React Documentation](https://react.dev)
- [Electron IPC](https://www.electronjs.org/docs/latest/api/ipc-main)

---

## 🎯 Roadmap

- [ ] HTML2PDF yerine native React PDF renderer ekle
- [ ] DOCX export (mammoth.js)
- [ ] Bellge imzalama desteği
- [ ] Multi-page document support
- [ ] QR code / barcode integrasyonu

---

**Made with ❤️ for Turkish Government Documents**
