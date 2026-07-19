import React from "react";
import { DocumentLayout } from "../../DocumentLayout";
import { IhtiyacListesiType } from "../../../lib/schemas/IhtiyacListesi.schema";
import { ApprovalSignature } from "../../ApprovalSignature";

interface IhtiyacListesiProps {
  data?: Partial<IhtiyacListesiType>;
}

/**
 * PATTERN (Şablon Yapısı):
 * 1. Tüm belgeleri DocumentLayout ile sarmalıyoruz.
 * 2. DocumentLayout, içerisine aldığı data props'u ile Antet (Header) ve Footer kısımlarını OTOMATİK oluşturur.
 * 3. title props'u ile belgenin başlığını (örneğin "İHTİYAÇ LİSTESİ") verebilirsiniz.
 * 4. Siz sadece belgenin gövdesini (body) yazarsınız.
 */
export function IhtiyacListesi({ data = {} }: IhtiyacListesiProps) {
  return (
    <DocumentLayout data={data}>
      {/* ÜST BİLGİ ALANI (Sayı, Konu, Tarih vb.) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <table style={{ border: "none" }}>
            <tbody>
              <tr>
                <td style={{ fontWeight: "bold", paddingRight: "10px" }}>
                  Sayı
                </td>
                <td>: {data?.evrakSayisi}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: "bold", paddingRight: "10px" }}>
                  Konu
                </td>
                <td>: {data?.dosyaKonusu}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <strong>Tarih:</strong> {data?.tarih || data?.dosyaTarihi}
        </div>
      </div>

      {/* MAKAM VE İÇERİK METNİ */}
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "14pt",
          margin: "40px 0",
        }}
      >
        {data?.sunulacakMakamAdi}
      </div>

      <div
        style={{ textIndent: "40px", lineHeight: "1.5", textAlign: "justify" }}
      >
        {data?.ihtiyacYeri}{" "}
        ihtiyacı olan aşağıda yazılı mal/hizmet kalemlerinin temin edilmesi
        gerekmektedir.
        <br />
        Söz konusu ihtiyacın 4734 sayılı Kamu İhale Kanunun{" "}
        {data?.maddeNo || "22/d"}{" "}
        maddesine göre temini için gereğini olurlarınıza arz ederim.
      </div>

      {/* TALEP EDEN (Sağ Alt) */}
      <div
        style={{ textAlign: "right", marginTop: "40px", marginBottom: "40px" }}
      >
        {data?.talepEdenPersonelAdi}
        <br />
        {data?.talepEdenPersonelUnvan}
      </div>

      {/* İHTİYAÇ KALEMLERİ TABLOSU */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          border: "1px solid black",
        }}
        border={1}
      >
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5", textAlign: "center" }}>
            <th style={{ padding: "8px" }}>Sıra No</th>
            <th style={{ padding: "8px" }}>Kodu</th>
            <th style={{ padding: "8px" }}>Malzeme Adı</th>
            <th style={{ padding: "8px" }}>Özelliği</th>
            <th style={{ padding: "8px" }}>Birimi</th>
            <th style={{ padding: "8px" }}>KDV Oranı (%)</th>
            <th style={{ padding: "8px" }}>Miktar</th>
          </tr>
        </thead>
        <tbody>
          {data?.ihtiyacKalemleri && data.ihtiyacKalemleri.length > 0
            ? (
              data.ihtiyacKalemleri.map((kalem: any, index: number) => (
                <tr key={index}>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    {kalem.siraNo || index + 1}
                  </td>
                  <td style={{ padding: "6px" }}>{kalem.kodu}</td>
                  <td style={{ padding: "6px" }}>{kalem.malzemeAdi}</td>
                  <td style={{ padding: "6px" }}>{kalem.ozelligi}</td>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    {kalem.birimi}
                  </td>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    {kalem.kdvOrani}
                  </td>
                  <td style={{ padding: "6px", textAlign: "center" }}>
                    {kalem.miktar}
                  </td>
                </tr>
              ))
            )
            : (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "15px",
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  İhtiyaç kalemi bulunamadı.
                </td>
              </tr>
            )}
        </tbody>
      </table>

      {/* ONAY BLOĞU */}
      {data?.olurYazisi && (
        <ApprovalSignature
          title="OLUR"
          date={data?.dosyaTarihi}
          adSoyad={data?.onaylayanPersonelAdi}
          unvan={data?.onaylayanPersonelUnvan}
          showSpace={true}
          marginTop={40}
        />
      )}
    </DocumentLayout>
  );
}
