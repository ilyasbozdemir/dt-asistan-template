import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { pdfStore } from "../../../lib/pdfStore";
import { templateManager } from "../../../lib/TemplateManager";
import { initializeTemplates } from "../../../lib/templates-config-index";

// Initialize templates on the server side
initializeTemplates();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateId, data } = body;

    if (!templateId || !data) {
      return NextResponse.json({ error: "templateId and data are required" }, { status: 400 });
    }

    const templateConfig = templateManager.getTemplate(templateId);
    if (!templateConfig) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    // Generate unique ID for this render job
    const id = Math.random().toString(36).substring(2, 15);
    pdfStore.set(id, templateId, data);

    // Get baseUrl
    const baseUrl = req.nextUrl.origin;
    const renderUrl = `${baseUrl}/pdf-render?id=${id}`;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Yüksek kalite için ekran çözünürlüğünü ayarla
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2,
    });

    // Sayfaya git ve her şeyin yüklenmesini bekle
    await page.goto(renderUrl, { waitUntil: 'networkidle0' });

    // Sayfa içindeki React bileşeninin render edildiğinden emin olmak için hazır bayrağını bekle
    // pdf-render sayfasında useEffect içinde window.__PDF_READY = true yapılacak.
    await page.waitForFunction('window.__PDF_READY === true', { timeout: 10000 }).catch(() => {
      console.warn("PDF_READY bayrağı gelmedi, timeout oldu ancak devam ediliyor.");
    });

    // Template ayarlarına göre Puppeteer'ı yapılandır
    const pageSize = templateConfig.metadata?.pageSize || 'A4';
    const isLandscape = templateConfig.metadata?.orientation === 'landscape';

    // PDF Oluştur
    const pdfBuffer = await page.pdf({
      format: pageSize as any,
      landscape: isLandscape,
      printBackground: true, // Arka plan renklerini ve Tailwind stillerini dahil et
      preferCSSPageSize: true, // CSS'teki @page kurallarına öncelik ver
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    await browser.close();
    pdfStore.remove(id); // Clean up

    // PDF'i stream olarak dön
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="document-${templateId}-${Date.now()}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate PDF" }, { status: 500 });
  }
}
