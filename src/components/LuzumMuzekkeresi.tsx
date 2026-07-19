import React from 'react'
import { FileText } from 'lucide-react'

export function LuzumMuzekkeresiTab(): React.JSX.Element {
  return (
    <div className="space-y-4">
      {/* KONTROL PANELİ */}
      <div className="flex flex-wrap gap-3 bg-slate-50 p-4 rounded-lg items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold">Lüzum Müzekkeresi Belgesi</h2>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-sm">
            🔄 Yenile
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            PDF Olarak İndir
          </button>
        </div>
      </div>

      {/* BELGE ÖNİZLEMESİ */}
      <div
        className="bg-white shadow-lg p-8 rounded-lg min-h-[600px] border border-slate-200 text-slate-900"
        style={{ margin: '0 auto', maxWidth: '800px' }}
      >
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold uppercase mb-2">T.C.</h3>
          <h4 className="text-lg font-semibold uppercase mb-4">Lüzum Müzekkeresi</h4>
        </div>
        
        <div className="space-y-6 text-sm">
          <p className="indent-8 text-justify leading-relaxed">
            Aşağıda cinsi, nev&apos;i ve miktarı yazılı mal/hizmetin hizasında gösterilen tahmini bedeller üzerinden satın alınması hususunda gereğini arz ederim.
          </p>

          <table className="w-full border-collapse border border-slate-300 mt-6 text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2">Sıra No</th>
                <th className="border border-slate-300 p-2">Malın/Hizmetin Cinsi</th>
                <th className="border border-slate-300 p-2">Miktarı</th>
                <th className="border border-slate-300 p-2">Ölçü Birimi</th>
                <th className="border border-slate-300 p-2">Tahmini Bedel (TL)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 text-center">1</td>
                <td className="border border-slate-300 p-2">Örnek Malzeme 1</td>
                <td className="border border-slate-300 p-2 text-center">10</td>
                <td className="border border-slate-300 p-2 text-center">Adet</td>
                <td className="border border-slate-300 p-2 text-right">5.000,00</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 text-center">2</td>
                <td className="border border-slate-300 p-2">Örnek Hizmet 2</td>
                <td className="border border-slate-300 p-2 text-center">1</td>
                <td className="border border-slate-300 p-2 text-center">Ay</td>
                <td className="border border-slate-300 p-2 text-right">15.000,00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="font-bold bg-slate-50">
                <td colSpan={4} className="border border-slate-300 p-2 text-right">TOPLAM TAHMİNİ BEDEL:</td>
                <td className="border border-slate-300 p-2 text-right">20.000,00</td>
              </tr>
            </tfoot>
          </table>

          <div className="flex justify-between mt-16 pt-8">
            <div className="text-center w-1/3">
              <p className="font-bold mb-8">Gerçekleştirme Görevlisi</p>
              <p>(İmza)</p>
            </div>
            <div className="text-center w-1/3">
              <p className="font-bold mb-8">Harcama Yetkilisi</p>
              <p>(İmza)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
