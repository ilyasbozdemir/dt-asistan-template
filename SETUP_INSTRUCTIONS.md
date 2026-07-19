# 🚀 TSX Template System - KURULUM REHBERI

Modern React + TypeScript belge şablonları sistemi kurma adımları.

---

## 📁 Klasör Yapısı

```
src/
└── templates/
    ├── components/
    │   ├── layouts/
    │   │   ├── DocumentLayout.tsx
    │   │   ├── DocumentHeader.tsx
    │   │   ├── DocumentFooter.tsx
    │   │   ├── DocumentTable.tsx
    │   │   └── index.ts (exports)
    │   ├── documents/
    │   │   ├── IhtiyacListesi.tsx
    │   │   ├── LuzumMuzekkeresi.tsx (TODO)
    │   │   ├── HarcamaTalimati.tsx (TODO)
    │   │   └── index.ts
    │   ├── shared/
    │   │   ├── PersonelCard.tsx
    │   │   └── index.ts
    │   ├── typography/
    │   │   └── index.ts (typography-styles.ts'i copy et)
    │   └── index.ts
    ├── hooks/
    │   ├── useDocumentData.ts
    │   ├── useDocumentRender.ts
    │   └── index.ts
    ├── schemas/
    │   ├── base.schema.ts
    │   ├── ihtiyac-listesi.schema.ts
    │   └── index.ts
    ├── config/
    │   ├── theme.config.ts
    │   └── index.ts
    ├── utils/
    │   ├── TemplateManager.ts
    │   └── legacy-migration.ts
    ├── __tests__/
    │   ├── IhtiyacListesi.test.tsx
    │   └── ...
    ├── stories/ (Storybook)
    │   ├── IhtiyacListesi.stories.tsx
    │   └── ...
    └── index.ts
```

---

## 📋 STEP-BY-STEP KURULUM

### Adım 1️⃣: Klasörleri Oluştur

```bash
cd src

# Klasör yapısını oluştur
mkdir -p templates/{components/{layouts,documents,shared,typography},hooks,schemas,config,utils,__tests__,stories}

# Eğer MacOS/Linux kullanıyorsan, tek komut:
mkdir -p templates/{components/{layouts,documents,shared,typography},hooks,schemas,config,utils,__tests__,stories}
```

### Adım 2️⃣: Components'ı Kopyala

Aşağıdaki dosyaları **karşılık gelen klasörlere** kopyala:

```
📄 typography-styles.ts
   → src/templates/components/typography/index.ts

📄 DocumentLayout.tsx
   → src/templates/components/layouts/DocumentLayout.tsx

📄 DocumentHeader.tsx
   → src/templates/components/layouts/DocumentHeader.tsx

📄 DocumentFooter.tsx
   → src/templates/components/layouts/DocumentFooter.tsx

📄 DocumentTable.tsx
   → src/templates/components/layouts/DocumentTable.tsx

📄 PersonelCard.tsx
   → src/templates/components/shared/PersonelCard.tsx

📄 IhtiyacListesi.tsx
   → src/templates/components/documents/IhtiyacListesi.tsx
```

### Adım 3️⃣: Hooks'ları Kopyala

```
📄 useDocumentData.ts
   → src/templates/hooks/useDocumentData.ts

📄 useDocumentRender.ts
   → src/templates/hooks/useDocumentRender.ts
```

### Adım 4️⃣: Schemas'ı Kopyala

Eski yerde varsa, oradan taşı:

```bash
# Eğer daha önce oluşturduysanız:
cp src/templates/schemas/base.schema.ts src/templates/schemas/base.schema.ts
cp src/templates/schemas/ihtiyac-listesi.schema.ts src/templates/schemas/ihtiyac-listesi.schema.ts

# Yoksa, yeni oluşturulmuş dosyaları kullan
```

### Adım 5️⃣: Theme & Config'i Kopyala

```bash
# theme.config.ts'i config klasörüne kopyala
cp theme.config.ts src/templates/config/theme.config.ts

# templates/config/index.ts'i kopyala (DIKKAT: dosya adında templates var)
cp templates-config-index.ts src/templates/config/index.ts
```

### Adım 6️⃣: Utils'ı Kopyala

```bash
cp TemplateManager.ts src/templates/utils/TemplateManager.ts
cp legacy-migration.ts src/templates/utils/legacy-migration.ts
```

### Adım 7️⃣: Main Index'i Kopyala

```bash
cp templates-index.ts src/templates/index.ts
```

### Adım 8️⃣: Index Files Oluştur (Exports)

Her klasörde bir `index.ts` oluştur:

**src/templates/components/layouts/index.ts**
```typescript
export { DocumentLayout, printStyles } from './DocumentLayout'
export { DocumentHeader, DocumentHeaderCompact } from './DocumentHeader'
export { DocumentFooter } from './DocumentFooter'
export { DocumentTable, SummaryTable } from './DocumentTable'
```

**src/templates/components/documents/index.ts**
```typescript
export { IhtiyacListesiDocument } from './IhtiyacListesi'
export type { } from './IhtiyacListesi'
```

**src/templates/components/shared/index.ts**
```typescript
export { PersonelCard, ApprovalSignature, CommissionList, MetadataBlock } from './PersonelCard'
```

**src/templates/hooks/index.ts**
```typescript
export { useDocumentData, useIhtiyacListesiData, useDocumentContext } from './useDocumentData'
export { useDocumentRender, useDocumentPrint, useDocumentValidation, extractDocumentHTML, openPDFPreview } from './useDocumentRender'
```

**src/templates/schemas/index.ts**
```typescript
export { BaseTemplateSchema, PartialBaseTemplateSchema, printSchemaFields } from './base.schema'
export type { BaseTemplate } from './base.schema'

export { IhtiyacListesiSchema, IhtiyacKalemiSchema, validateIhtiyacListesi, exampleIhtiyacListesi } from './ihtiyac-listesi.schema'
export type { IhtiyacListesi, IhtiyacKalemi } from './ihtiyac-listesi.schema'
```

**src/templates/config/index.ts**
```typescript
// templates-config-index.ts'in içeriğini buraya kopyala
```

**src/templates/utils/index.ts**
```typescript
export { TemplateManager, templateManager } from './TemplateManager'
export type { TemplateConfig, ProcessMapping } from './TemplateManager'

export { registerLegacyMappings, LEGACY_PATH_MAPPINGS, extractTemplateIdFromPath, generateMigrationReport } from './legacy-migration'
```

---

## ⚙️ Adım 9️⃣: Package Dependencies

Gerekli paketler yüklü mü kontrol et:

```bash
npm list zod mustache typescript
```

Eksikse, kur:

```bash
npm install zod
npm install mustache
npm install -D @types/mustache
```

---

## 🔌 Adım 1️⃣0️⃣: App.tsx'e Başlatma Ekle

```typescript
// src/App.tsx (veya main.tsx)
import React, { useEffect } from 'react'
import { initializeTemplates } from './templates'

export function App() {
  useEffect(() => {
    // Tüm şablonları başlat
    initializeTemplates()
    console.log('✅ Template Engine başlatıldı')
  }, [])

  return (
    // Your app...
  )
}
```

---

## 🧪 Adım 1️⃣1️⃣: Test Et

Basit bir test component oluştur:

```typescript
// src/components/TemplateTest.tsx
import React from 'react'
import { 
  IhtiyacListesiDocument,
  exampleIhtiyacListesi,
  templateManager
} from 'src/templates'

export function TemplateTest() {
  return (
    <div>
      <h2>Template Engine Test</h2>
      
      {/* Info */}
      <pre>
        {JSON.stringify(templateManager.info(), null, 2)}
      </pre>

      {/* Document */}
      <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}>
        <IhtiyacListesiDocument data={exampleIhtiyacListesi} />
      </div>
    </div>
  )
}
```

App'a ekle:
```typescript
<TemplateTest />
```

Tarayıcıda çalışıyor mu kontrol et. ✅

---

## 📚 Adım 1️⃣2️⃣: Kullanımı Anla

Aşağıdaki dosyaları oku:

1. **TEMPLATES_README.md** - Özet rehber
2. **INTEGRATION_GUIDE.md** - Mevcut kod nasıl entegre edilir
3. **ExampleCiktiScreen.tsx** - Gerçek örnek

---

## 🔄 Adım 1️⃣3️⃣: Mevcut Kodla Entegre Et

### Seçenek A: CiktiMerkezi hook'unu güncelle

```typescript
// screens/CiktiMerkezi.screen.tsx

import { useIhtiyacListesiData, IhtiyacListesiDocument } from 'src/templates'

export function CiktiMerkeziScreen() {
  const { data, loading } = useIhtiyacListesiData(activeDosyaId)

  return (
    <IhtiyacListesiDocument data={data!} />
  )
}
```

### Seçenek B: New Tab ekle

Existing Mustache tabs yanında yeni TSX tab açabilirsin.

---

## ✅ KONTROL LİSTESİ

Kurulumdan sonra kontrol et:

- [ ] Klasör yapısı doğru
- [ ] Tüm dosyalar kopyalanmış
- [ ] `npm install zod` çalıştırıldı
- [ ] `initializeTemplates()` App.tsx'e eklendi
- [ ] `TemplateTest.tsx` çalışıyor
- [ ] `templateManager.info()` browser console'da bilgi gösteriyor
- [ ] `IhtiyacListesiDocument` render ediliyor
- [ ] "PDF İndir" butonu çalışıyor
- [ ] "Yazdır" butonu çalışıyor

---

## 🆘 Troubleshooting

### Problem: "Module not found" hatası

```
❌ Cannot find module 'src/templates'
```

**Çözüm:** `src/templates/index.ts` var mı kontrol et. `export` dosyası ekle.

### Problem: Type hatası - "IhtiyacListesi type unknown"

```
❌ Type 'unknown' is not assignable to type 'IhtiyacListesi'
```

**Çözüm:** Schema'yı import et ve cast et:

```typescript
const data = result.data as IhtiyacListesi
```

### Problem: Electron IPC çalışmıyor (PDF export)

```
❌ electron is undefined
```

**Çözüm:** Browser ortamında fallback ekle:

```typescript
const isPlatformElectron = typeof window !== 'undefined' && (window as any).electron

if (isPlatformElectron) {
  // Electron code
} else {
  // Browser fallback (html2pdf, etc.)
}
```

### Problem: CSS print styles uygulanmıyor

**Çözüm:** `DocumentLayout`'un içindeki print styles'ı global CSS'e ekle:

```typescript
// index.css
@import 'templates/components/layouts/DocumentLayout.css'
```

---

## 🎯 Sonraki Adımlar

1. ✅ **Kurulum bitti** - Şimdi entegrasyon başla
2. **Test et** - Örnek component'leri test et
3. **Prodükte çalıştır** - Gerçek dosyalara bağla
4. **Yeni şablon ekle** - Lüzum Müzekkeresi, vb.
5. **Eski sistem kaldır** - Mustache templates'ı deprecate et

---

## 📞 Support

Sorular varsa:
- `TEMPLATES_README.md` oku
- `INTEGRATION_GUIDE.md` kontrol et
- `ExampleCiktiScreen.tsx` örneklerini incele
- Browser console'da debug et

---

## 📈 Timeline

| Faz | Hedef | Süre |
|-----|-------|------|
| **1** | Kurulum + Test | 1 gün |
| **2** | İhtiyaç Listesi entegrasyonu | 1-2 gün |
| **3** | Diğer şablonları migrate et | 2-3 hafta |
| **4** | Eski sistem kaldır | 1 gün |

**Toplam:** ~4 hafta 🎯

---

**Happy templating! 🎉**
