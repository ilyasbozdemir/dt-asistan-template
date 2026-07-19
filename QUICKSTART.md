# ⚡ QUICK START - 5 Dakika

## 🎯 Sonuç: Modern React belge şablonları (type-safe)

---

## 1️⃣ Klasörü Oluştur

```bash
mkdir -p src/templates/{components/{layouts,documents,shared,typography},hooks,schemas,config,utils}
```

---

## 2️⃣ Dosyaları Kopyala

Aşağıdaki dosyaları indirilen klasörlerden uygun yerlere taşı:

| Dosya | Hedef |
|-------|-------|
| `typography-styles.ts` | `src/templates/components/typography/index.ts` |
| `DocumentLayout.tsx` | `src/templates/components/layouts/` |
| `DocumentHeader.tsx` | `src/templates/components/layouts/` |
| `DocumentFooter.tsx` | `src/templates/components/layouts/` |
| `DocumentTable.tsx` | `src/templates/components/layouts/` |
| `PersonelCard.tsx` | `src/templates/components/shared/` |
| `IhtiyacListesi.tsx` | `src/templates/components/documents/` |
| `useDocumentData.ts` | `src/templates/hooks/` |
| `useDocumentRender.ts` | `src/templates/hooks/` |
| `base.schema.ts` | `src/templates/schemas/` |
| `ihtiyac-listesi.schema.ts` | `src/templates/schemas/` |
| `theme.config.ts` | `src/templates/config/` |
| `templates-config-index.ts` | `src/templates/config/index.ts` |
| `TemplateManager.ts` | `src/templates/utils/` |
| `legacy-migration.ts` | `src/templates/utils/` |
| `templates-index.ts` | `src/templates/index.ts` |

---

## 3️⃣ Dependencies

```bash
npm install zod mustache
npm install -D @types/mustache
```

---

## 4️⃣ App.tsx'e Ekle

```typescript
import { initializeTemplates } from './templates'

export function App() {
  useEffect(() => {
    initializeTemplates()
  }, [])

  return <YourApp />
}
```

---

## 5️⃣ Kullan

```typescript
import { 
  IhtiyacListesiDocument,
  useIhtiyacListesiData,
  useDocumentRender 
} from 'src/templates'

export function MyScreen() {
  const { data, loading } = useIhtiyacListesiData(dosyaId)
  const { render } = useDocumentRender()
  const ref = useRef<HTMLDivElement>(null)

  return (
    <>
      <div ref={ref}>
        <IhtiyacListesiDocument data={data!} />
      </div>
      <button onClick={() => render(ref.current!, { format: 'pdf' })}>
        📥 PDF
      </button>
    </>
  )
}
```

---

## ✅ Çalışıyor mu?

Browser'ı aç:
```
http://localhost:5173 (Vite)
```

Şablonun gösterildiğini gör. ✅

---

## 🚀 İleri Adımlar

1. Diğer şablonları migre et (Lüzum Müzekkeresi, vb.)
2. Storybook setup (`npm install -D @storybook/react`)
3. Unit testler yazma
4. E2E testler (Playwright/Cypress)

---

## 📚 Daha Fazla

- `SETUP_INSTRUCTIONS.md` - Ayrıntılı kurulum
- `TEMPLATES_README.md` - API referansı
- `INTEGRATION_GUIDE.md` - Mevcut kod entegrasyonu
- `ExampleCiktiScreen.tsx` - Gerçek örnek

---

**Hazır mısın?** 🚀

Sorular varsa SETUP_INSTRUCTIONS.md oku veya test componentini çalıştır:

```typescript
import { TemplateTest } from './components/TemplateTest'

export function App() {
  return <TemplateTest />
}
```
