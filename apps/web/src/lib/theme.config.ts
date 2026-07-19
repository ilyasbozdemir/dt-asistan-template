/**
 * GLOBAL_THEME: Tüm şablonlarda tutarlılık sağlayan merkezi tema
 * 
 * Kullanım:
 * - CSS'te: var(--font-family), var(--color-text), vb.
 * - TypeScript'te: GLOBAL_THEME.typography.fontFamily
 */

export const GLOBAL_THEME = {
  // ───────────────────────────────────
  // TİPOGRAFİ
  // ───────────────────────────────────
  typography: {
    fontFamily: "'Times New Roman', Times, serif",
    baseFontSize: '12pt',
    lineHeight: 1.5,
    fontSize: {
      xs: '8pt',
      sm: '10pt',
      base: '12pt',
      lg: '14pt',
      xl: '16pt',
      '2xl': '18pt'
    },
    fontWeight: {
      normal: 400,
      semibold: 600,
      bold: 700
    }
  },

  // ───────────────────────────────────
  // RENKLER
  // ───────────────────────────────────
  colors: {
    text: '#000',
    textLight: '#333',
    textMuted: '#666',
    border: '#333',
    borderLight: '#999',
    headerBg: '#f2f2f2',
    accentLine: '#c00', // Kırmızı kurum çizgisi
    white: '#fff',
    black: '#000'
  },

  // ───────────────────────────────────
  // SAYFA AYARLARI (A4)
  // ───────────────────────────────────
  page: {
    format: 'A4',
    width: '21cm',
    height: '29.7cm',
    margins: {
      top: 1.5, // cm
      right: 1.5,
      bottom: 1.5,
      left: 1.5
    },
    // Yazdırılabilir alan yüksekliği (dinamik sayfalama için)
    printableHeight: 890 // px (A4 @ 96 DPI)
  },

  // ───────────────────────────────────
  // TABLO AYARLARI
  // ───────────────────────────────────
  table: {
    borderCollapse: 'collapse',
    fontSize: '10pt',
    cellPadding: '6px',
    headerBgColor: '#f2f2f2',
    headerFontWeight: 'bold',
    headerTextAlign: 'center',
    borderColor: '#333',
    borderWidth: '1px'
  },

  // ───────────────────────────────────
  // BOŞLUK (Spacing)
  // ───────────────────────────────────
  spacing: {
    headerHeight: '80px',
    footerHeight: '60px',
    approvalSpacing: '40px',
    marginBottom: '20px',
    marginTop: '20px',
    titleMargin: '20px 0'
  },

  // ───────────────────────────────────
  // TUTARLILIĞIN ÖZET BİLGİSİ
  // ───────────────────────────────────
  summary: {
    description:
      'Tüm şablonlarda tutarlı görünüm. Türkçe dökümanlar için Times New Roman, A4 format, 1.5cm margin.',
    lastUpdated: new Date().toISOString()
  }
}

/**
 * CSS değişkenleri string olarak
 * Style tag'ine enjekte edilebilir
 */
export const generateCSSVariables = (): string => {
  return `
    :root {
      --font-family: ${GLOBAL_THEME.typography.fontFamily};
      --font-size-base: ${GLOBAL_THEME.typography.baseFontSize};
      --line-height: ${GLOBAL_THEME.typography.lineHeight};
      
      --color-text: ${GLOBAL_THEME.colors.text};
      --color-border: ${GLOBAL_THEME.colors.border};
      --color-header-bg: ${GLOBAL_THEME.colors.headerBg};
      --color-accent: ${GLOBAL_THEME.colors.accentLine};
      
      --page-margin-top: ${GLOBAL_THEME.page.margins.top}cm;
      --page-margin-right: ${GLOBAL_THEME.page.margins.right}cm;
      --page-margin-bottom: ${GLOBAL_THEME.page.margins.bottom}cm;
      --page-margin-left: ${GLOBAL_THEME.page.margins.left}cm;
      
      --table-font-size: ${GLOBAL_THEME.table.fontSize};
      --table-cell-padding: ${GLOBAL_THEME.table.cellPadding};
    }
  `
}

/**
 * Margin/padding hesaplayıcı
 */
export const calculateMargins = (type: 'all' | 'print' | 'screen' = 'print') => {
  const margins = GLOBAL_THEME.page.margins

  if (type === 'print') {
    return `${margins.top}cm ${margins.right}cm ${margins.bottom}cm ${margins.left}cm`
  }

  return {
    top: `${margins.top}cm`,
    right: `${margins.right}cm`,
    bottom: `${margins.bottom}cm`,
    left: `${margins.left}cm`
  }
}

/**
 * Kolay erişim helper'ları
 */
export const themeHelpers = {
  // Font class'ı oluştur
  fontClass: (size: keyof typeof GLOBAL_THEME.typography.fontSize, weight?: keyof typeof GLOBAL_THEME.typography.fontWeight) => {
    const s = GLOBAL_THEME.typography.fontSize[size]
    const w = weight ? GLOBAL_THEME.typography.fontWeight[weight] : GLOBAL_THEME.typography.fontWeight.normal
    return `font-size: ${s}; font-weight: ${w};`
  },

  // Tablo cell stilini oluştur
  tableCellStyle: () => {
    return `border: ${GLOBAL_THEME.table.borderWidth} solid ${GLOBAL_THEME.table.borderColor}; padding: ${GLOBAL_THEME.table.cellPadding}; text-align: left;`
  },

  // Header cell stilini oluştur
  tableHeaderStyle: () => {
    return `${themeHelpers.tableCellStyle()}; background-color: ${GLOBAL_THEME.table.headerBgColor}; font-weight: ${GLOBAL_THEME.table.headerFontWeight}; text-align: ${GLOBAL_THEME.table.headerTextAlign};`
  },

  // Margin helper
  margin: (top?: string, right?: string, bottom?: string, left?: string) => {
    return `margin: ${top || '0'} ${right || '0'} ${bottom || '0'} ${left || '0'};`
  }
}
