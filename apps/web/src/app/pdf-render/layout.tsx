/**
 * PDF Render sayfası için minimal layout.
 * Geist fontları, dark mode sınıfları veya herhangi bir UI frame içermez.
 * Sadece beyaz arka plan ve belgeler için Times New Roman font tanımlıdır.
 */
export default function PdfRenderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          * {
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: white;
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            color: #000;
          }
          @media print {
            html, body {
              background: white;
            }
          }
        `}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
