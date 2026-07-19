/**
 * DOCUMENT LAYOUT
 *
 * Tüm resmi belgeler için base layout component
 * - Header (Antet)
 * - Content area
 * - Footer (Kurum bilgisi)
 * - Print-optimized CSS
 */

import React, { ReactNode } from "react";
import { BaseTemplate } from "../lib/base.schema";
import { GLOBAL_THEME } from "../lib/theme.config";
import { DocumentHeader } from "./DocumentHeader";
import { DocumentFooter } from "./DocumentFooter";

interface DocumentLayoutProps {
  children: ReactNode;
  data?: Partial<BaseTemplate>;
  title?: string;
  hideFooter?: boolean;
  pageSize?: "A4" | "A3";
  orientation?: "portrait" | "landscape";
}

export const DocumentLayout = React.forwardRef<
  HTMLDivElement,
  DocumentLayoutProps
>(
  (
    {
      children,
      data,
      title,
      hideFooter = false,
      pageSize = "A4",
      orientation = "portrait",
    },
    ref,
  ) => {
    const margins = GLOBAL_THEME.page.margins;

    // Calculate width/height based on pageSize and orientation
    let docWidth = "21cm";
    let docHeight = "29.7cm";

    if (pageSize === "A4") {
      docWidth = orientation === "landscape" ? "29.7cm" : "21cm";
      docHeight = orientation === "landscape" ? "21cm" : "29.7cm";
    } else if (pageSize === "A3") {
      docWidth = orientation === "landscape" ? "42cm" : "29.7cm";
      docHeight = orientation === "landscape" ? "29.7cm" : "42cm";
    }

    // Dynamic Print Styles
    const dynamicPrintStyles = `
      @media print {
        @page {
          size: ${pageSize} ${orientation};
          margin: 1.5cm;
        }

        body {
          margin: 0;
          padding: 0;
          background: white;
        }

        .document-container {
          box-shadow: none !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          min-height: 0 !important;
        }

        /* Page break rules */
        table {
          page-break-inside: avoid;
        }
        tr {
          page-break-inside: avoid;
        }
        .approval-block {
          page-break-inside: avoid;
        }

        /* Widow/Orphan control */
        p {
          orphans: 2;
          widows: 2;
        }
      }
    `;

    return (
      <div
        ref={ref}
        className="document-container"
        style={{
          width: "100%",
          maxWidth: docWidth,
          margin: "0 auto",
          padding:
            `${margins.top}cm ${margins.right}cm ${margins.bottom}cm ${margins.left}cm`,
          fontFamily: GLOBAL_THEME.typography.fontFamily,
          fontSize: GLOBAL_THEME.typography.baseFontSize,
          lineHeight: GLOBAL_THEME.typography.lineHeight,
          color: GLOBAL_THEME.colors.text,
          backgroundColor: "#fff",
          position: "relative",
          minHeight: docHeight,
          pageBreakAfter: "always",
          boxSizing: "border-box",
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: dynamicPrintStyles }} />

        {/* HEADER - Antet (Kurum Logosu ve Bilgisi) */}
        <DocumentHeader data={data} />

        {/* BAŞLIK (varsa) */}
        {title && (
          <div
            style={{
              textAlign: "center",
              fontSize: "14pt",
              fontWeight: "bold",
              marginTop: "30px",
              marginBottom: "20px",
              textDecoration: "underline",
            }}
          >
            {title}
          </div>
        )}

        {/* İÇERİK */}
        <div style={{ marginTop: "20px" }} className="document-content">
          {children}
        </div>

        {/* FOOTER - Kurum İletişim Bilgisi */}
        {!hideFooter && !data?.kurumIci && <DocumentFooter data={data} />}
      </div>
    );
  },
);

DocumentLayout.displayName = "DocumentLayout";
