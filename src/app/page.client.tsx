"use client";

import React, { useEffect, useRef, useState } from "react";
import {
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  return (
    <main className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden absolute top-0 left-0 w-full h-16 bg-slate-900 text-white flex items-center px-4 z-20 shadow-md">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="ml-3 flex items-center gap-2">
          <FileArchive className="w-5 h-5 text-blue-400" />
          <h1 className="font-bold text-lg">Şablon Sistemi</h1>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Sleek Dark Theme) */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        lg:relative lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3 text-white">
            <LayoutDashboard className="w-6 h-6 text-blue-500" />
            <h1 className="text-xl font-bold tracking-tight">Şablonlar</h1>
          </div>
          <button
            className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="flex flex-col gap-6">
            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Kategori
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 py-2.5 pl-4 pr-10 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  {Object.keys(groupedTemplates).sort().map((cat) => {
                    let niceName = cat;
                    if (cat.includes("1-")) niceName = "1. Hazırlık ve İhtiyaç";
                    else if (cat.includes("2-")) {
                      niceName = "2. Piyasa Fiyat Araştırması";
                    } else if (cat.includes("3-")) {
                      niceName = "3. Sipariş & Sözleşme";
                    } else if (cat.includes("4-")) {
                      niceName = "4. Kabul & Ödeme";
                    } else if (cat.includes("5-")) {
                      niceName = "5. Klasör & Kapaklar";
                    }

                    return <option key={cat} value={cat}>{niceName}</option>;
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
            </div>

            {/* Template List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Belgeler
              </label>
              <div className="flex flex-col gap-1">
                {activeCategory &&
                  groupedTemplates[activeCategory].map((t) => {
                    const isActive = activeTemplateId === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTemplateId(t.id);
                          setSidebarOpen(false); // mobile auto-close
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                      >
                        <FileText
                          className={`w-4 h-4 ${
                            isActive ? "text-blue-200" : "text-slate-500"
                          }`}
                        />
                        <span className="truncate">
                          {t.name.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 overflow-y-auto pt-16 lg:pt-0 p-4 lg:p-8 flex flex-col bg-slate-50 dark:bg-slate-900 scrollbar-hide">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 gap-4 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {activeTemplateConf?.name.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75">
                </span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500">
                </span>
              </span>
              <p className="text-slate-500 text-sm font-medium">
                Canlı Önizleme Aktif
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm shadow-sm">
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Düzenle</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-sm shadow-blue-600/20 hover:bg-blue-700 transition-colors text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF İndir</span>
            </button>
          </div>
        </div>

        {/* 2-Column Grid (Form + Preview) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
          {/* Form Panel */}
          <div className="xl:col-span-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-[600px] xl:h-full">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 flex-shrink-0">
              <Settings className="w-5 h-5 text-blue-500" />
              Şablon Değişkenleri
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 flex flex-col gap-4">
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
                              onBlur={(e) =>
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
          <div
            ref={previewContainerRef}
            className="xl:col-span-8 bg-slate-200/50 dark:bg-slate-950 p-4 sm:p-8 rounded-2xl flex justify-center items-start overflow-hidden shadow-inner border border-slate-200 dark:border-slate-800 min-h-[600px] xl:h-full relative"
          >
            {ActiveComponent
              ? (
                <div
                  className="bg-white shadow-2xl origin-top transition-transform duration-200 ease-out flex-shrink-0"
                  style={{
                    transform: `scale(${previewScale})`,
                    width: "800px", // Standard document width
                    minHeight: "1131px", // Standard A4 height roughly (for realism, though it will expand)
                  }}
                >
                  <ActiveComponent data={formData} />
                </div>
              )
              : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <FileText className="w-12 h-12 mb-3 opacity-20" />
                  <p className="font-medium">
                    Şablon Yüklenemedi veya Seçilmedi
                  </p>
                </div>
              )}
          </div>
        </div>
      </section>
    </main>
  );
}
