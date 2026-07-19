/**
 * DOCUMENT LAYOUT
 * 
 * Tüm resmi belgeler için base layout component
 * - Header (Antet)
 * - Content area
 * - Footer (Kurum bilgisi)
 * - Print-optimized CSS
 */

import React, { ReactNode } from 'react'
import { BaseTemplate } from '../lib/base.schema'
import { GLOBAL_THEME } from '../lib/theme.config'
import { DocumentHeader } from './DocumentHeader'
import { DocumentFooter } from './DocumentFooter'

interface DocumentLayoutProps {
  children: ReactNode
  data?: Partial<BaseTemplate>
  title?: string
  hideFooter?: boolean
  pageSize?: 'A4' | 'A3'
}

export const DocumentLayout = React.forwardRef<HTMLDivElement, DocumentLayoutProps>(
  ({ children, data, title, hideFooter = false, pageSize = 'A4' }, ref) => {
    const margins = GLOBAL_THEME.page.margins

    return (
      <div
        ref={ref}
        className="document-container"
        style={{
          width: '100%',
          maxWidth: GLOBAL_THEME.page.width,
          margin: '0 auto',
          padding: `${margins.top}cm ${margins.right}cm ${margins.bottom}cm ${margins.left}cm`,
          fontFamily: GLOBAL_THEME.typography.fontFamily,
          fontSize: GLOBAL_THEME.typography.baseFontSize,
          lineHeight: GLOBAL_THEME.typography.lineHeight,
          color: GLOBAL_THEME.colors.text,
          backgroundColor: '#fff',
          position: 'relative',
          minHeight: GLOBAL_THEME.page.height,
          pageBreakAfter: 'always'
        }}
      >
        {/* HEADER - Antet (Kurum Logosu ve Bilgisi) */}
        <DocumentHeader data={data} />

        {/* BAŞLIK (varsa) */}
        {title && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '14pt',
              fontWeight: 'bold',
              marginTop: '30px',
              marginBottom: '20px',
              textDecoration: 'underline'
            }}
          >
            {title}
          </div>
        )}

        {/* İÇERİK */}
        <div style={{ marginTop: '20px' }} className="document-content">
          {children}
        </div>

        {/* FOOTER - Kurum İletişim Bilgisi */}
        {!hideFooter && !data?.kurumIci && <DocumentFooter data={data} />}
      </div>
    )
  }
)

DocumentLayout.displayName = 'DocumentLayout'

/**
 * Print CSS (global style tag'inde)
 * document-container elementine uygulanacak
 */
export const printStyles = `
  @media print {
    @page {
      size: A4;
      margin: 1.5cm;
    }

    body {
      margin: 0;
      padding: 0;
      background: white;
    }

    .document-container {
      box-shadow: none;
      margin: 0;
      width: 100%;
      max-width: 100%;
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
`
