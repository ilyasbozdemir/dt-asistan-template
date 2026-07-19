"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  FileArchive,
  FileText,
  LayoutDashboard,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { TEMPLATE_REGISTRY } from "../components/templates";
import * as Templates from "../components/templates";

// Basic category grouping
const groupedTemplates = TEMPLATE_REGISTRY.reduce((acc, curr) => {
  if (!acc[curr.category]) acc[curr.category] = [];
  acc[curr.category].push(curr);
  return acc;
}, {} as Record<string, typeof TEMPLATE_REGISTRY>);

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>(
    Object.keys(groupedTemplates)[0] || "",
  );
  const [activeTemplateId, setActiveTemplateId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // For Mobile
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For Desktop
  const [formData, setFormData] = useState<any>({});

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  // Select first template when category changes
  useEffect(() => {
    if (activeCategory && groupedTemplates[activeCategory]) {
      setActiveTemplateId(groupedTemplates[activeCategory][0].id);
    }
  }, [activeCategory]);

  const activeTemplateConf = TEMPLATE_REGISTRY.find((t) =>
    t.id === activeTemplateId
  );
  const ActiveComponent = activeTemplateConf
    ? (Templates as any)[activeTemplateConf.name]
    : null;

  // Load default data when template changes
  useEffect(() => {
    if (activeTemplateConf?.defaultData) {
      setFormData(activeTemplateConf.defaultData);
    } else {
      setFormData({});
    }
  }, [activeTemplateId, activeTemplateConf]);

  // Handle PDF-like scaling based on container width
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const A4_WIDTH = 800; // Base width of our document layout
      const PADDING = 32; // Extra padding
      const availableWidth = width - PADDING;

      if (availableWidth < A4_WIDTH) {
        setPreviewScale(availableWidth / A4_WIDTH);
      } else {
        setPreviewScale(1);
      }
    });

    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, [activeTemplateId]);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleJsonChange = (key: string, valueStr: string) => {
    try {
      const parsed = JSON.parse(valueStr);
      handleInputChange(key, parsed);
    } catch (e) {
      // Ignored for now
    }
  };

  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = async () => {
    if (!activeTemplateId || !formData) return;

    try {
      setIsPrinting(true);
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: activeTemplateId,
          data: formData
        }),
      });

      if (!response.ok) {
        throw new Error('PDF oluşturulamadı');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Belge-${activeTemplateId}-${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF İndirme Hatası:", error);
      alert("PDF oluşturulurken bir hata oluştu.");
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <main className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      {/* Mobile Header (Print Gizli) */}
      <div className="print:hidden lg:hidden absolute top-0 left-0 w-full h-16 bg-slate-900 text-white flex items-center px-4 z-20 shadow-md">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="ml-3 flex items-center gap-2.5">
          <img
            src="https://raw.githubusercontent.com/ilyasbozdemir/dt-asistan-app/main/apps/app-desktop/resources/icon.png"
            alt="DT Asistan"
            className="w-7 h-7 object-contain"
          />
          <div className="flex flex-col">
            <h1 className="font-bold text-base leading-tight">DT Asistan</h1>
            <span className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">
              Template Engine
            </span>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="print:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Sleek Dark Theme) (Print Gizli) */}
      <aside
        className={`print:hidden
        fixed inset-y-0 left-0 z-40 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${sidebarCollapsed ? "w-20" : "w-72"}
      `}
      >
        {/* Sidebar Header */}
        <div
          className={`h-16 flex items-center ${
            sidebarCollapsed ? "justify-center" : "justify-between px-6"
          } bg-slate-950 border-b border-slate-800 flex-shrink-0`}
        >
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 text-white">
              <img
                src="https://raw.githubusercontent.com/ilyasbozdemir/dt-asistan-app/main/apps/app-desktop/resources/icon.png"
                alt="DT Asistan"
                className="w-8 h-8 object-contain flex-shrink-0"
              />
              <div className="flex flex-col overflow-hidden">
                <h1 className="text-lg font-bold tracking-tight whitespace-nowrap leading-tight">
                  DT Asistan
                </h1>
                <span className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold whitespace-nowrap">
                  Template Engine
                </span>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <img
              src="https://raw.githubusercontent.com/ilyasbozdemir/dt-asistan-app/main/apps/app-desktop/resources/icon.png"
              alt="DT Asistan"
              className="w-8 h-8 object-contain flex-shrink-0"
            />
          )}

          <button
            className="hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Genişlet" : "Daralt"}
          >
            {sidebarCollapsed
              ? <ChevronRight className="w-5 h-5" />
              : <ChevronLeft className="w-5 h-5" />}
          </button>

          <button
            className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="flex flex-col gap-6 mt-2">
            {/* Category Selector */}
            <div className="space-y-2">
              {!sidebarCollapsed && (
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 whitespace-nowrap">
                  Kategori
                </label>
              )}
              {sidebarCollapsed
                ? (
                  <div
                    className="flex justify-center text-slate-500 cursor-help"
                    title={activeCategory}
                  >
                    <FileArchive className="w-6 h-6" />
                  </div>
                )
                : (
                  <div className="relative">
                    <select
                      className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 py-2.5 pl-4 pr-10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                    >
                      {Object.keys(groupedTemplates).sort().map((cat) => {
                        let niceName = cat;
                        if (cat.includes("1-")) niceName = "1. Hazırlık";
                        else if (cat.includes("2-")) {
                          niceName = "2. Piyasa Fiyat";
                        } else if (cat.includes("3-")) niceName = "3. Sipariş";
                        else if (cat.includes("4-")) niceName = "4. Kabul";
                        else if (cat.includes("5-")) niceName = "5. Klasörler";

                        return (
                          <option key={cat} value={cat}>{niceName}</option>
                        );
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        >
                        </path>
                      </svg>
                    </div>
                  </div>
                )}
            </div>

            {/* Template List */}
            <div className="space-y-2">
              {!sidebarCollapsed && (
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 whitespace-nowrap">
                  Belgeler
                </label>
              )}
              <div className="flex flex-col gap-1">
                {activeCategory &&
                  groupedTemplates[activeCategory].map((t) => {
                    const isActive = activeTemplateId === t.id;
                    return (
                      <button
                        key={t.id}
                        title={t.name.replace(/([A-Z])/g, " $1").trim()}
                        onClick={() => {
                          setActiveTemplateId(t.id);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`flex items-center ${
                          sidebarCollapsed
                            ? "justify-center p-3"
                            : "gap-3 px-3 py-2.5"
                        } rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        <FileText
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive ? "text-blue-200" : "text-slate-500"
                          }`}
                        />
                        {!sidebarCollapsed && (
                          <span className="truncate whitespace-nowrap text-left w-full">
                            {t.name.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col h-screen overflow-hidden pt-16 lg:pt-0 bg-slate-50 dark:bg-slate-900">
        {/* Header Controls (Print Gizli) */}
        <div className="print:hidden p-4 lg:p-6 lg:pb-0 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                {activeTemplateConf?.name.replace(/([A-Z])/g, " $1").trim()}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75">
                  </span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500">
                  </span>
                </span>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                  Canlı Önizleme Aktif
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm shadow-sm">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Düzenle</span>
              </button>
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className={`flex items-center gap-2 px-4 py-2 ${isPrinting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-colors text-sm disabled:cursor-not-allowed`}
              >
                <Download className={`w-4 h-4 ${isPrinting ? 'animate-bounce' : ''}`} />
                <span className="hidden sm:inline">
                  {isPrinting ? "PDF Oluşturuluyor..." : "PDF İndir / Yazdır"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Grid (Form + Preview) - Tam Yükseklikte ve Kendi İçinde Kaydırılabilir */}
        <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-6 p-4 lg:p-6">
          {/* Form Panel (Print Gizli) */}
          <div className="print:hidden xl:col-span-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
              <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-500" />
                Şablon Değişkenleri
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 flex flex-col gap-4">
              {Object.keys(formData).length === 0
                ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm italic bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-dashed border-slate-200 dark:border-slate-700">
                    <Settings className="w-8 h-8 mb-2 opacity-50" />
                    <p>Bu şablona ait değişken bulunamadı.</p>
                  </div>
                )
                : (
                  Object.entries(formData).map(([key, value]) => {
                    const isObject = typeof value === "object" &&
                      value !== null;
                    const isBoolean = typeof value === "boolean";

                    return (
                      <div key={key} className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                          {key}
                        </label>
                        {isBoolean
                          ? (
                            <select
                              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 dark:text-slate-200"
                              value={value ? "true" : "false"}
                              onChange={(e) =>
                                handleInputChange(
                                  key,
                                  e.target.value === "true",
                                )}
                            >
                              <option value="true">Aktif (Evet)</option>
                              <option value="false">Pasif (Hayır)</option>
                            </select>
                          )
                          : isObject
                          ? (
                            <textarea
                              className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[140px] resize-y scrollbar-thin"
                              defaultValue={JSON.stringify(value, null, 2)}
                              onChange={(e) =>
                                handleJsonChange(key, e.target.value)}
                              placeholder="Geçerli JSON verisi..."
                            />
                          )
                          : (
                            <input
                              type="text"
                              className="w-full p-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 dark:text-slate-200"
                              value={value as string}
                              onChange={(e) =>
                                handleInputChange(key, e.target.value)}
                            />
                          )}
                      </div>
                    );
                  })
                )}
            </div>
          </div>

          {/* Document Preview Panel */}
          {/* Print modunda bu alanın dış kısımları gizlenmez ama kendisi flex-1 olduğu için baskıya uygun hale gelir */}
          <div
            ref={previewContainerRef}
            className="xl:col-span-8 bg-slate-200/50 dark:bg-slate-950 rounded-2xl flex justify-center items-start overflow-y-auto shadow-inner border border-slate-200 dark:border-slate-800 h-full relative print:!block print:!overflow-visible print:!h-auto print:!shadow-none print:!border-none print:!bg-transparent"
          >
            {
              /*
              Mobilde veya dar ekranda "transform: scale" kullanıyoruz.
              Ayrıca "min-h-[1131px]" ile belge bir A4 gibi gölgeli ve belirgin.
              Ortalamak için py-8 ve mx-auto kullanıldı.
            */
            }
            <div className="py-8 print:py-0 w-full flex justify-center">
              {ActiveComponent
                ? (
                  <div
                    className="bg-white shadow-2xl origin-top transition-transform duration-200 ease-out flex-shrink-0 print:!transform-none print:!shadow-none print:!w-full print:!m-0"
                    style={{
                      transform: `scale(${previewScale})`,
                      width: "800px", // Standard document max-width
                      minHeight: "1131px", // Standard A4 height roughly
                    }}
                  >
                    <ActiveComponent data={formData} />
                  </div>
                )
                : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-32">
                    <FileText className="w-12 h-12 mb-3 opacity-20" />
                    <p className="font-medium">
                      Şablon Yüklenemedi veya Seçilmedi
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
