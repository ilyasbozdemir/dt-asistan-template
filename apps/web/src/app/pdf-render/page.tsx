import React from "react";
import { pdfStore } from "../../lib/pdfStore";
import { TEMPLATE_REGISTRY } from "../../components/templates";
import * as Templates from "../../components/templates";

// Bu sayfa Server Component olarak çalışır ve PDF için statik render sunar.
export default async function PdfRenderPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  if (!id) {
    return <div>Missing ID</div>;
  }

  const pdfData = pdfStore.get(id);
  if (!pdfData) {
    return <div>Data not found or expired</div>;
  }

  const templateConf = TEMPLATE_REGISTRY.find(t => t.id === pdfData.templateId);
  if (!templateConf) {
    return <div>Template not found</div>;
  }

  // Komponenti al
  const ActiveComponent = Templates[templateConf.name as keyof typeof Templates] as any;
  
  if (!ActiveComponent) {
    return <div>Component not found</div>;
  }

  return (
    <div className="pdf-print-wrapper bg-white min-h-screen">
      {/* 
        Tailwind sınıflarını ve özel fontları içerir.
        DocumentLayout zaten içinde kendi özel printStyles'ını ve @page ayarlarını getiriyor.
      */}
      <ActiveComponent data={pdfData.data} />

      {/* Puppeteer'a render'ın bittiğini ve her şeyin dom'a yerleştiğini bildiren script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Biraz bekleyip her şeyin tam oturduğundan emin olalım (görseller vb.)
            setTimeout(() => {
              window.__PDF_READY = true;
            }, 500);
          `,
        }}
      />
    </div>
  );
}
