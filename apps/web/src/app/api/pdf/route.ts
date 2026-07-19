import { NextRequest, NextResponse } from "next/server";
import { generatePDF } from "@dt-asistan/pdf-generator";
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

    // Get baseUrl
    const baseUrl = req.nextUrl.origin;
    const pageSize = templateConfig.metadata?.pageSize || 'A4';
    const isLandscape = templateConfig.metadata?.orientation === 'landscape';

    // Generate PDF using shared monorepo package
    const pdfBuffer = await generatePDF({
      templateId,
      data,
      baseUrl,
      pageSize: pageSize as any,
      isLandscape
    });

    // PDF'i stream olarak dön
    return new NextResponse(pdfBuffer, {
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
