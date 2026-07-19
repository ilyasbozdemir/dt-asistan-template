/**
 * PDF Render için geçici in-memory store
 * API'ye gelen büyük JSON verilerini tutar. Puppeteer render sayfası bu veriyi çeker.
 */

interface PdfData {
  templateId: string;
  data: any;
  timestamp: number;
}

class PdfStore {
  private store: Map<string, PdfData> = new Map();

  set(id: string, templateId: string, data: any) {
    this.store.set(id, {
      templateId,
      data,
      timestamp: Date.now()
    });

    // Cleanup old entries (older than 5 minutes)
    this.cleanup();
  }

  get(id: string): PdfData | undefined {
    return this.store.get(id);
  }

  remove(id: string) {
    this.store.delete(id);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (now - value.timestamp > 5 * 60 * 1000) {
        this.store.delete(key);
      }
    }
  }
}

export const pdfStore = new PdfStore();
