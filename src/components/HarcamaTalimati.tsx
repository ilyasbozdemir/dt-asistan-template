import React from 'react'
import { FileText } from 'lucide-react'

export function HarcamaTalimatiTab(): React.JSX.Element {
  return (
    <div className="space-y-4">
      {/* KONTROL PANELİ */}
      <div className="flex flex-wrap gap-3 bg-slate-50 p-4 rounded-lg items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold">Harcama Talimatı Belgesi</h2>
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
          <h4 className="text-lg font-semibold uppercase mb-4">Harcama Talimatı</h4>
        </div>
        
        <div className="space-y-6 text-sm">
          <p className="indent-8 text-justify leading-relaxed">
            İlgili kanun ve yönetmelikler çerçevesinde aşağıda detayı verilen mal/hizmet alımının yapılması hususunu olurlarınıza arz ederim.
          </p>

          <table className="w-full border-collapse border border-slate-300 mt-6 text-sm">
            <tbody>
              <tr>
                <td className="border border-slate-300 p-2 font-bold w-1/3 bg-slate-50">Harcamanın Konusu</td>
                <td className="border border-slate-300 p-2">Yıllık Kırtasiye Malzemesi Alımı</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-bold bg-slate-50">Tahmini Bedeli</td>
                <td className="border border-slate-300 p-2">20.000,00 TL (KDV Hariç)</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-bold bg-slate-50">Bütçe Tertibi</td>
                <td className="border border-slate-300 p-2">03.2.1.01 - Kırtasiye Alımları</td>
              </tr>
              <tr>
                <td className="border border-slate-300 p-2 font-bold bg-slate-50">Satın Alma Usulü</td>
                <td className="border border-slate-300 p-2">4734 Sayılı KİK 22/d (Doğrudan Temin)</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between mt-16 pt-8">
            <div className="text-center w-1/3">
              <p className="font-bold mb-8">Düzenleyen</p>
              <p>(İmza)</p>
            </div>
            <div className="text-center w-1/3">
              <p className="font-bold mb-8">Harcama Yetkilisi</p>
              <p>OLUR<br/><br/>(İmza)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
