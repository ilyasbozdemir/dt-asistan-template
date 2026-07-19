/**
 * TYPOGRAPHY - Tutarlı yazı tipi tanımları
 * Tüm şablonlarda aynı stil
 */

export const typographyStyles = {
  // Base document style
  document: `
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000;
  `,

  // Başlık (H1) - Merkezi, büyük, bold
  heading1: `
    font-size: 18pt;
    font-weight: bold;
    text-align: center;
    margin: 20px 0;
    text-transform: uppercase;
  `,

  // Başlık (H2)
  heading2: `
    font-size: 14pt;
    font-weight: bold;
    margin: 15px 0 10px 0;
  `,

  // Başlık (H3)
  heading3: `
    font-size: 12pt;
    font-weight: bold;
    margin: 10px 0 8px 0;
  `,

  // Normal paragraf
  paragraph: `
    margin: 0 0 12pt 0;
    text-align: justify;
    line-height: 1.5;
  `,

  // İlk satırı içeri çek (indent)
  paragraphIndented: `
    margin: 0 0 12pt 0;
    text-align: justify;
    text-indent: 40px;
    line-height: 1.5;
  `,

  // Tablo stil
  table: `
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0 30px 0;
    font-size: 10pt;
  `,

  tableHeader: `
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: center;
    border: 1px solid #333;
    padding: 6px;
  `,

  tableCell: `
    border: 1px solid #333;
    padding: 6px;
    text-align: left;
  `,

  // Personel bloğu
  personelBlock: `
    text-align: center;
    margin: 30px 0;
    line-height: 1.8;
  `,

  // Onay/İmza bloğu
  approvalBlock: `
    text-align: center;
    margin-top: 40px;
    line-height: 1.5;
  `,

  // Kırmızı hat (kurum çizgisi)
  accentLine: `
    border-top: 2px solid #c00;
    margin: 10px 0;
  `
}

/**
 * Tailwind + Print-safe CSS classes
 * Yazdırma için optimize edilmiş
 */
export const printClasses = {
  document: 'font-serif text-sm leading-relaxed text-black',
  heading1: 'text-2xl font-bold text-center uppercase my-5',
  heading2: 'text-lg font-bold my-3',
  heading3: 'text-base font-bold my-2',
  paragraph: 'text-justify mb-3',
  paragraphIndented: 'text-justify mb-3 indent-10',
  table: 'w-full border-collapse my-5 text-xs',
  tableHeader: 'bg-gray-200 font-bold text-center border border-black p-1.5',
  tableCell: 'border border-black p-1.5 text-left',
  accentLine: 'border-t-2 border-red-600 my-2'
}

/**
 * İnline style generator (Print-safe)
 */
export function getInlineStyle(styleKey: keyof typeof typographyStyles): React.CSSProperties {
  const style = typographyStyles[styleKey]

  return {
    fontFamily: style.includes('Times') ? "'Times New Roman', Times, serif" : 'inherit',
    fontSize: parseSize(style, 'font-size'),
    fontWeight: parseWeight(style),
    textAlign: parseAlign(style),
    margin: parseMargin(style),
    lineHeight: style.includes('1.5') ? 1.5 : style.includes('1.8') ? 1.8 : 1,
    textIndent: style.includes('text-indent: 40px') ? 40 : 0,
    color: '#000'
  }
}

function parseSize(style: string, key: string): string {
  const match = style.match(/font-size:\s*(\d+pt)/i)
  return match ? match[1] : '12pt'
}

function parseWeight(style: string): number | 'bold' {
  if (style.includes('font-weight: bold')) return 'bold'
  return 400
}

function parseAlign(style: string): 'left' | 'center' | 'right' | 'justify' {
  if (style.includes('text-align: center')) return 'center'
  if (style.includes('text-align: right')) return 'right'
  if (style.includes('text-align: justify')) return 'justify'
  return 'left'
}

function parseMargin(style: string): string {
  const match = style.match(/margin:\s*([^;]+)/i)
  return match ? match[1] : '0'
}
