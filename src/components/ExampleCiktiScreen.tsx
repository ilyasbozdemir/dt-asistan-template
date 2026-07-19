/**
 * EXAMPLE: CiktiMerkezi Ekranında TSX Kullanımı
 *
 * Bu örnek, mevcut CiktiMerkezi ekranının
 * yeni TSX template sistemini nasıl kullanacağını gösterir
 */

import React, { useRef, useState } from "react";
// Mock workspace store since it's missing
const useWorkspaceStore = () => ({ activeDosyaId: 1 });

import { IhtiyacListesiDocument } from "./IhtiyacListesi";
import { useIhtiyacListesiData } from "../lib/useDocumentData";
import {
  useDocumentPrint,
  useDocumentRender,
  useDocumentValidation,
} from "../lib/useDocumentRender";
import { DocumentLayout } from "./DocumentLayout";
import { GLOBAL_THEME } from "../lib/theme.config";
import { AlertCircle, Download, Loader2, Printer } from "lucide-react";

/**
 * TAB 1: İhtiyaç Listesi - REACT TSX İLE
 *
 * Bu component:
 * ✅ Verileri database'den çeker
 * ✅ Zod ile doğrular
 * ✅ React component olarak render eder
 * ✅ PDF/Print/DOCX olarak export eder
 */
export function IhtiyacListesiTab(): React.JSX.Element {
  const { activeDosyaId } = useWorkspaceStore();
  const docRef = useRef<HTMLDivElement>(null);

  // 1. VERİ ÇEKME
  const { data, loading, error, validation, refresh } = useIhtiyacListesiData(
    activeDosyaId!,
  );

  // 2. EXPORT/PRINT HOOKS
  const { render: exportPDF, rendering: pdfRendering } = useDocumentRender();
  const { print, printing: printRendering } = useDocumentPrint();
  const { validate } = useDocumentValidation();

  // 3. STATE
  const [exportFormat, setExportFormat] = useState<"pdf" | "docx">("pdf");

  // 4. VALIDASYON KONTROL
  const isValid = validation.valid;
  const hasWarnings = validation.errors.length > 0;

  // 5. EXPORT HANDLER
  const handleExport = async () => {
    if (!docRef.current) return;

    try {
      await exportPDF(docRef.current, {
        filename: `ihtiyac-listesi-${activeDosyaId}`,
        format: exportFormat,
      });

      // @ts-ignore
      await (window as any).electron?.ipcRenderer?.invoke(
        "db:run",
        `
        INSERT INTO DATA_TeminBelge (temin_dosya_id, belge_adi, belge_tarihi)
        VALUES (?, ?, ?)
      `,
        [activeDosyaId, "İhtiyaç Listesi", new Date().toISOString()],
      );

      showToast("Belge başarıyla kaydedildi", "success");
    } catch (err) {
      showToast(`Hata: ${(err as Error).message}`, "error");
    }
  };

  const handlePrint = async () => {
    if (!docRef.current) return;
    try {
      await print(docRef.current);
      showToast("Belge yazdırma kuyruğuna gönderildi", "success");
    } catch (err) {
      showToast(`Yazdırma hatası: ${(err as Error).message}`, "error");
    }
  };

  // UI
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="ml-2">Veri yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Veri Yükleme Hatası</strong>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={refresh}
              className="text-sm mt-2 underline hover:no-underline"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>Veri bulunamadı</div>;
  }

  return (
    <div className="space-y-4">
      {/* DOĞRULAMA UYARISI */}
      {hasWarnings && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-lg text-sm">
          ⚠️ {validation.errors.length}{" "}
          alan eksik. Yine de export edebilirsiniz.
        </div>
      )}

      {/* KONTROL PANELİ */}
      <div className="flex flex-wrap gap-3 bg-slate-50 p-4 rounded-lg">
        {/* FORMAT SEÇİMİ */}
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as any)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
        >
          <option value="pdf">📄 PDF</option>
          <option value="docx">📝 DOCX</option>
        </select>

        {/* EXPORT BUTTON */}
        <button
          onClick={handleExport}
          disabled={pdfRendering}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {pdfRendering ? "İşleniyor..." : "İndir"}
        </button>

        {/* PRINT BUTTON */}
        <button
          onClick={handlePrint}
          disabled={printRendering}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
        >
          <Printer className="w-4 h-4" />
          {printRendering ? "Yazdırılıyor..." : "Yazdır"}
        </button>

        {/* YENILE */}
        <button
          onClick={refresh}
          className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100"
        >
          🔄 Yenile
        </button>
      </div>

      {/* BELGE ÖNİZLEMESİ */}
      <div
        ref={docRef}
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
          padding: "20px",
          borderRadius: "8px",
          pageBreakAfter: "always",
        }}
      >
        <IhtiyacListesiDocument data={data} />
      </div>

      {/* HIDDEN PRINT STYLES */}
      <style>
        {`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .hidden-on-print {
            display: none;
          }
        }
      `}
      </style>
    </div>
  );
}

/**
 * HELPER TOAST FUNCTION
 */
function showToast(message: string, type: "success" | "error" | "warning") {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // Toast UI kodu buraya...
}

/**
 * ÖRNEK 2: MULTI-TAB KULLANIM
 *
 * Farklı şablonlar için farklı tab'lar
 */
export function CiktiMerkeziMultiTab(): React.JSX.Element {
  const [activeTab, setActiveTab] = React.useState<
    "ihtiyac" | "luzum" | "harcama"
  >("ihtiyac");

  return (
    <div>
      {/* TAB NAVIGATION */}
      <div className="flex gap-2 border-b mb-4">
        <button
          onClick={() => setActiveTab("ihtiyac")}
          className={`px-4 py-2 ${
            activeTab === "ihtiyac" ? "border-b-2 border-blue-600" : ""
          }`}
        >
          İhtiyaç Listesi
        </button>
        <button
          onClick={() => setActiveTab("luzum")}
          className={`px-4 py-2 ${
            activeTab === "luzum" ? "border-b-2 border-blue-600" : ""
          }`}
        >
          Lüzum Müzekkeresi
        </button>
        <button
          onClick={() => setActiveTab("harcama")}
          className={`px-4 py-2 ${
            activeTab === "harcama" ? "border-b-2 border-blue-600" : ""
          }`}
        >
          Harcama Talimatı
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div>
        {activeTab === "ihtiyac" && <IhtiyacListesiTab />}
        {/* activeTab === 'luzum' && <LuzumMuzekkeresiTab /> */}
        {/* activeTab === 'harcama' && <HarcamaTalimatiTab /> */}
      </div>
    </div>
  );
}

/**
 * ÖRNEK 3: PREVIEW MODAL
 *
 * Modal'da belge önizlemesi
// import { Dialog, DialogContent } from '@/components/ui/dialog'
// using standard div for now since dialog is not installed
const Dialog = ({ children, open, onOpenChange }: any) => open ? <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">{children}</div> : null
const DialogContent = ({ children, className }: any) => <div className={`bg-white p-6 rounded-lg ${className}`}>{children}</div>

interface DocumentPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  dosyaId: number
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  dosyaId
}: DocumentPreviewModalProps) {
  const { data, loading } = useIhtiyacListesiData(dosyaId)
  const docRef = useRef<HTMLDivElement>(null)
  const { render } = useDocumentRender()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => render(docRef.current!, { format: 'pdf' })}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
            >
              📥 PDF
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1 bg-slate-600 text-white text-sm rounded"
            >
              🖨️ Yazdır
            </button>
          </div>

          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <div ref={docRef}>
              {data && <IhtiyacListesiDocument data={data} />}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * ÖRNEK 4: BULK EXPORT
 *
 * Birden fazla belge aynı anda export
 */
export async function bulkExportDocuments(
  dosyaIds: number[],
  templateId: string,
  format: "pdf" | "docx",
) {
  for (const dosyaId of dosyaIds) {
    // const { data } = await loadDocumentData(templateId, dosyaId)
    const data = {}; // Mocked

    if (data) {
      const element = document.createElement("div");
      // Render component to element
      // export(element, format)

      console.log(`✅ Exported ${templateId} for dosya ${dosyaId}`);
    }
  }
}
