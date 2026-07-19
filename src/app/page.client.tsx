"use client";

import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
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

  // Select first template when category changes
  React.useEffect(() => {
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

  return (
    <main className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {/* Sidebar */}
      <aside className="w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 flex flex-col gap-6 overflow-y-auto h-screen sticky top-0 scrollbar-hide">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
            Şablon Sistemi
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            52 Otomatik Dönüştürülmüş Şablon
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Kategori Seçin
          </label>
          <select
            className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full text-sm font-medium transition-all"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
          >
            {Object.keys(groupedTemplates).sort().map((cat) => {
              let niceName = cat;
              if (cat.includes("1-")) niceName = "1. Hazırlık ve İhtiyaç";
              else if (cat.includes("2-")) {
                niceName = "2. Piyasa Fiyat Araştırması";
              } else if (cat.includes("3-")) niceName = "3. Sipariş & Sözleşme";
              else if (cat.includes("4-")) niceName = "4. Kabul & Ödeme";
              else if (cat.includes("5-")) niceName = "5. Klasör & Kapaklar";

              return <option key={cat} value={cat}>{niceName}</option>;
            })}
          </select>

          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2">
            Şablon Seçin
          </label>
          <div className="flex flex-col gap-2">
            {activeCategory &&
              groupedTemplates[activeCategory].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplateId(t.id)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTemplateId === t.id
                      ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm border"
                      : "hover:bg-slate-100 text-slate-600 border border-transparent dark:hover:bg-slate-700 dark:text-slate-400"
                  }`}
                >
                  {t.name.replace(/([A-Z])/g, " $1").trim()}
                </button>
              ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {activeTemplateConf?.name.replace(/([A-Z])/g, " $1").trim()}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Önizleme Modu (Mock Data ile)
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition-colors">
                Düzenle
              </button>
              <button className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-sm shadow-blue-200 hover:bg-blue-700 transition-colors">
                PDF Çıktısı Al
              </button>
            </div>
          </div>

          {/* Document Render Area */}
          <div className="bg-slate-200 dark:bg-slate-900 p-8 rounded-2xl flex justify-center overflow-x-auto shadow-inner min-h-[800px]">
            {ActiveComponent
              ? (
                <div className="zoom-wrapper transform origin-top w-full flex justify-center text-slate-900">
                  <ActiveComponent />
                </div>
              )
              : (
                <div className="flex items-center justify-center h-64 text-slate-500">
                  Şablon Yüklenemedi
                </div>
              )}
          </div>
        </div>
      </section>
    </main>
  );
}
