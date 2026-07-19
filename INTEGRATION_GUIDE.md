# 🔗 Integration Guide - Eski Sistemden Yeni Sisteme Geçiş

Mevcut `useCiktiMerkeziData` hook'u + Mustache şablonları → **React TSX Components**

---

## 📊 Geçiş Stratejisi

### Faz 1: Parallel (Şu An)
- ✅ Eski sistem devam ediyor
- ✅ Yeni TSX components çalışıyor
- ✅ Her ikisi birlikte var olabiliyor

### Faz 2: Gradual (2-4 hafta)
- Bir shablonu bir adım dönüştür
- Diğerleri eski sistemde kalır
- Test et, confirm et

### Faz 3: Full Migration (Hedef)
- Tüm şablonlar TSX
- `useCiktiMerkeziData` kaldırılabilir
- `processMappingRegistry` devre dışı bırakılır

---

## 🔀 CiktiMerkezi Ekranını Güncelle

### BEFORE: Mustache Template

```typescript
// useCiktiMerkeziData (Eski)
const { contextsByPath, dosyaContext } = useCiktiMerkeziData(activeDosyaId)

// Mustache render
const html = Mustache.render(sablon.icerik, dosyaContext)
```

### AFTER: React Components

```typescript
import { IhtiyacListesiDocument, useIhtiyacListesiData } from 'src/templates'

// Veri çek
const { data, loading } = useIhtiyacListesiData(activeDosyaId)

// Render component
if (loading) return <Loader />

return (
  <div ref={docRef}>
    <IhtiyacListesiDocument data={data} />
  </div>
)
```

---

## 📝 Adım-Adım Geçiş (Her Şablon İçin)

### Şablon: İhtiyaç Listesi

#### Adım 1: Schema Kontrol Et

Mevcut `ihtiyac-listesi.schema.ts` zaten hazır ✅

```typescript
import { IhtiyacListesiSchema } from 'src/templates'

// Validation test
const result = validateIhtiyacListesi(rawData)
```

#### Adım 2: Hook Test Et

```typescript
import { useIhtiyacListesiData } from 'src/templates'

const { data, loading, error, validation } = useIhtiyacListesiData(activeDosyaId)

if (error) {
  console.error('Data load failed:', error)
  console.log('Validation errors:', validation.errors)
}
```

#### Adım 3: Component Kullan

```typescript
import { IhtiyacListesiDocument } from 'src/templates'

return (
  <IhtiyacListesiDocument data={data} />
)
```

#### Adım 4: PDF Export Test Et

```typescript
import { useDocumentRender } from 'src/templates'

const { render } = useDocumentRender()
const docRef = useRef<HTMLDivElement>(null)

const handleExport = async () => {
  await render(docRef.current!, {
    filename: 'ihtiyac-listesi',
    format: 'pdf'
  })
}
```

#### Adım 5: Yazdırma Test Et

```typescript
import { useDocumentPrint } from 'src/templates'

const { print } = useDocumentPrint()

const handlePrint = async () => {
  await print(docRef.current!)
}
```

---

## 🔄 CiktiMerkeziScreen Güncellemesi

### Güncel Kod (Faz 1: Parallel)

```typescript
// src/screens/CiktiMerkezi.screen.tsx

import React, { useState, useRef } from 'react'
import { useCiktiMerkeziData } from './CiktiMerkezi.hooks'
import { useDocumentRender, useDocumentPrint } from 'src/templates'

export function CiktiMerkeziScreen(): React.JSX.Element {
  const { activeDosyaId } = useWorkspaceStore()
  const { dosyaContext, contextsByPath } = useCiktiMerkeziData(activeDosyaId)
  
  // YENİ SISTEM
  const { data: ihtiyacData, loading: ihtiyacLoading } = useIhtiyacListesiData(activeDosyaId)
  const { render } = useDocumentRender()
  const { print } = useDocumentPrint()
  const docRef = useRef<HTMLDivElement>(null)

  // Tab routing
  const currentTab = useCurrentTab() // 'ihtiyac-listesi', 'luzum-muzekkeresi', vb.

  return (
    <>
      {/* TAB 1: İhtiyaç Listesi (YENİ SISTEM) */}
      {currentTab === 'ihtiyac-listesi' && (
        <div ref={docRef}>
          {ihtiyacLoading ? (
            <Loader />
          ) : (
            <IhtiyacListesiDocument data={ihtiyacData!} />
          )}
        </div>
      )}

      {/* TAB 2: Lüzum Müzekkeresi (ESKİ SISTEM - Henüz geçirilmedi) */}
      {currentTab === 'luzum-muzekkeresi' && (
        <div>
          <OldMustacheRenderer
            template={mustacheTemplate}
            context={contextsByPath['luzum-muzekkeresi']}
          />
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-2">
        <button onClick={() => render(docRef.current!, { format: 'pdf' })}>
          📥 PDF
        </button>
        <button onClick={() => print(docRef.current!)}>
          🖨️ Yazdır
        </button>
      </div>
    </>
  )
}
```

---

## 🔗 Mevcut Hook'tan Yeni Hook'a Geçiş

### Eski Pattern

```typescript
// useCiktiMerkeziData - Tüm şablonlar için generic
const { contextsByPath } = useCiktiMerkeziData(dosyaId)

// Rendering
const html = Mustache.render(template, contextsByPath[path])
```

### Yeni Pattern

```typescript
// useIhtiyacListesiData - Spesifik şablon için
const { data, validation } = useIhtiyacListesiData(dosyaId)

// Rendering (Component auto-handles)
<IhtiyacListesiDocument data={data} />
```

---

## ⚖️ Side-by-Side: Hangisini Kullanmalı?

| Seçim | Durumu | Recommendation |
|-------|--------|-------------------|
| **Eski (Mustache)** | Active, çalışan | Stable production |
| **Yeni (TSX)** | Development, Test | New features |
| **Parallel** | Her ikisi | Test & Validate |

---

## 🧪 Testing Checklist - Her Şablon İçin

```typescript
describe('IhtiyacListesiDocument', () => {
  // 1. Schema validation
  test('validates required fields', () => {
    const result = validateIhtiyacListesi(invalidData)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('...')
  })

  // 2. Component renders
  test('renders without crashing', () => {
    render(<IhtiyacListesiDocument data={validData} />)
  })

  // 3. PDF export
  test('exports to PDF', async () => {
    const { render: exportRender } = useDocumentRender()
    await exportRender(element, { format: 'pdf' })
    // Assert file created
  })

  // 4. Print works
  test('sends to printer', async () => {
    const { print } = useDocumentPrint()
    await print(element)
    // Assert electron IPC called
  })
})
```

---

## 📈 Progress Tracking

Aşağıdaki şablonları birer birer dönüştürün:

- [ ] **İhtiyaç Listesi** ✅ DONE (ihtiyac-listesi.schema.ts + IhtiyacListesi.tsx)
- [ ] Lüzum Müzekkeresi (TODO)
- [ ] Harcama Talimatı (TODO)
- [ ] Muayene Kabul Komisyonu (TODO)
- [ ] Harcama Pusulası (TODO)
- [ ] Yaklaşık Maliyet Cetveli (TODO)
- [ ] ... (diğer 20+ şablon)

**Her geçiş sonrası:** Test et, Production'a deploy et, Eski code'u kaldır

---

## 🚨 Common Pitfalls

### ❌ Problem 1: Type mismatch

```typescript
// ❌ WRONG - raw data
const data: IhtiyacListesi = rawDatabaseData

// ✅ CORRECT - validated
const result = IhtiyacListesiSchema.safeParse(rawDatabaseData)
if (result.success) {
  const data: IhtiyacListesi = result.data
}
```

### ❌ Problem 2: Missing fields

```typescript
// ❌ WRONG - Zod error
const data = { ihtiyacKalemleri: [] } // Missing required fields

// ✅ CORRECT - Fill all required
const data: IhtiyacListesi = {
  ihtiyacKalemleri: [],
  sunulacakMakamAdi: '...',
  // etc.
}
```

### ❌ Problem 3: Electron IPC not available

```typescript
// ❌ WRONG - Browser ortamında
export PDF

// ✅ CORRECT - Check environment
if (typeof window !== 'undefined' && (window as any).electron) {
  // Electron
} else {
  // Browser fallback (html2pdf, etc.)
}
```

---

## 📞 Support

Soru varsa:
1. `TEMPLATES_README.md` oku
2. Örnek component'i incele: `IhtiyacListesi.tsx`
3. Hook'ları test et: `useDocumentData`, `useDocumentRender`
4. Debug: `console.log(data.validation)`

---

**Timeline:** 2-4 hafta içinde Faz 3'e ulaş 🎯
