# DT Asistan Template Engine (Monorepo)

Bu depo (repository), DT Asistan projesinin şablon motorunu ve belge çıktı
yönetimini içeren bir **pnpm monorepo** çalışma alanıdır.

## 📂 Dizin Yapısı

- **`apps/web`:** Next.js, React ve Tailwind CSS ile geliştirilen, dinamik belge
  şablonlarını yöneten, düzenleyen ve önizleyen ana web uygulamasıdır.
  İçerisinde resmi evraklar için Zod şemaları ve özel tasarım motoru bulunur.

## 🚀 Hızlı Başlangıç

Bu depoda paket yönetimi ve iş akışları için **pnpm** kullanılmaktadır.
Başlamadan önce bilgisayarınızda Node.js ve pnpm yüklü olduğundan emin olun.

### 1. Kurulum

Bağımlılıkları yüklemek için kök dizinde aşağıdaki komutu çalıştırın:

```bash
pnpm install
```

### 2. Geliştirme Sunucusu

Aşağıdaki komutu çalıştırarak `apps/web` projesini (Şablon Motoru)
başlatabilirsiniz:

```bash
pnpm dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek
canlı önizlemeyi ve şablon yönetim sistemini görüntüleyebilirsiniz.

## 🛠 Kullanılan Teknolojiler

- [Next.js](https://nextjs.org) (App Router)
- React & TypeScript
- Tailwind CSS
- Zod (Şema Validasyonu)
- Radix UI (Erişilebilir Bileşenler)
