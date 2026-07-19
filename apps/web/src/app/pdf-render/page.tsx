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
    <>
      {/* DocumentLayout @page ve yazdırma stillerini zaten içinde barındırıyor */}
      <ActiveComponent data={pdfData.data} />

      {/* Puppeteer'a render'ın bittiğini bildiren script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Fontların ve görsellerin tam oturması için bekle
            setTimeout(() => {
              window.__PDF_READY = true;
            }, 1000);
          `,
        }}
      />
    </>
  );
}
