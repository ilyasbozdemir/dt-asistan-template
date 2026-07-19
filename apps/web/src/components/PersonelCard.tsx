/**
 * SHARED COMPONENTS
 *
 * 1. PersonelCard - Personel adı ve unvan bloğu
 * 2. ApprovalSignature - Onay/İmza bloğu
 */

import React from "react";

/**
 * PERSONEL CARD
 * Hazırlayan, Talep Eden vb. personel bilgisini gösteren blok
 */
interface PersonelCardProps {
  adSoyad?: string | null;
  unvan?: string | null;
  telefon?: string | null;
  eposta?: string | null;
  align?: "left" | "center" | "right";
  marginTop?: number;
  marginBottom?: number;
  showContactInfo?: boolean;
}

export const PersonelCard: React.FC<PersonelCardProps> = ({
  adSoyad,
  unvan,
  telefon,
  eposta,
  align = "center",
  marginTop = 20,
  marginBottom = 20,
  showContactInfo = false,
}) => {
  if (!adSoyad) return null;

  return (
    <div
      className={`flex w-full break-inside-avoid ${
        align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
      }`}
      style={{ marginTop: `${marginTop}px`, marginBottom: `${marginBottom}px` }}
    >
      <div className="text-center min-w-[250px] leading-[1.8]">
        <div className="font-bold text-[11pt]">{adSoyad}</div>
        {unvan && <div className="text-[11pt]">{unvan}</div>}
        {showContactInfo && (
          <>
            {telefon && (
              <div className="text-[10pt] text-gray-600">
                Tel: {telefon}
              </div>
            )}
            {eposta && (
              <div className="text-[10pt] text-gray-600">
                E-posta: {eposta}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * APPROVAL SIGNATURE
 * Onay/İmza bloğu - "OLUR" yazısı, tarih, ad-soyad, unvan
 */
interface ApprovalSignatureProps {
  title?: string;
  date?: string | null;
  adSoyad?: string | null;
  unvan?: string | null;
  showSpace?: boolean; // İmza için boş alan
  marginTop?: number;
  align?: "left" | "center" | "right";
}

export const ApprovalSignature: React.FC<ApprovalSignatureProps> = ({
  title = "OLUR",
  date,
  adSoyad,
  unvan,
  showSpace = true,
  marginTop = 40,
  align = "center",
}) => {
  return (
    <div
      className={`flex w-full break-inside-avoid ${
        align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
      }`}
      style={{ marginTop: `${marginTop}px` }}
    >
      <div
        className="text-center min-w-[250px] leading-relaxed"
      >
        {/* BAŞLIK */}
        <div
          className="font-bold text-[12pt] mb-2.5"
        >
          {title}
        </div>

        {/* TARİH */}
        {date && (
          <div className="text-[11pt] mb-[15px]">
            {date}
          </div>
        )}

        {/* İMZA ALANI */}
        {showSpace && (
          <div className="min-h-[40px] mb-2.5" />
        )}

        {/* AD-SOYAD */}
        {adSoyad && (
          <div
            className="text-[11pt] font-bold mt-2.5"
          >
            {adSoyad}
          </div>
        )}

        {/* UNVAN */}
        {unvan && (
          <div className="text-[11pt]">
            {unvan}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * COMMISSION MEMBERS
 * Komisyon üyeleri listesi
 */
interface CommissionMember {
  adSoyad: string;
  unvan: string;
  gorevi?: string;
}

interface CommissionListProps {
  members: CommissionMember[];
  title?: string;
  marginTop?: number;
}

export const CommissionList: React.FC<CommissionListProps> = ({
  members,
  title = "Komisyon Üyeleri",
  marginTop = 30,
}) => {
  if (!members || members.length === 0) return null;

  return (
    <div className="break-inside-avoid" style={{ marginTop: `${marginTop}px` }}>
      <div
        className="font-bold text-[12pt] mb-[15px]"
      >
        {title}
      </div>

      {members.map((member, idx) => (
        <div key={idx} className="mb-3 leading-relaxed">
          <div className="text-[11pt]">
            <strong>{member.adSoyad}</strong>
          </div>
          <div className="text-[10pt]">{member.unvan}</div>
          {member.gorevi && (
            <div className="text-[10pt] text-gray-600">
              ({member.gorevi})
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * METADATA BLOCK
 * Evrak sayısı, tarih vb. bilgiler
 */
interface MetadataBlockProps {
  evrakSayisi?: string;
  tarih?: string;
  dosyaKonusu?: string;
  showBorder?: boolean;
}

export const MetadataBlock: React.FC<MetadataBlockProps> = ({
  evrakSayisi,
  tarih,
  dosyaKonusu,
  showBorder = false,
}) => {
  return (
    <div
      className={`flex justify-between mb-5 break-inside-avoid ${showBorder ? "pb-2.5 border-b border-gray-300" : ""}`}
    >
      {/* Sol Taraf: Sayı ve Konu (Sayfanın yarısını geçemez) */}
      <div className="max-w-[50%]">
        <table
          className="border-none p-0 m-0 text-[11pt] border-spacing-0"
        >
          <tbody>
            {evrakSayisi && (
              <tr>
                <td className="align-top p-0 w-[45px]">
                  <strong>Sayı</strong>
                </td>
                <td className="align-top pr-1.5">
                  <strong>:</strong>
                </td>
                <td className="align-top p-0">
                  {evrakSayisi}
                </td>
              </tr>
            )}
            {dosyaKonusu && (
              <tr>
                <td className="align-top p-0 w-[45px]">
                  <strong>Konu</strong>
                </td>
                <td className="align-top pr-1.5">
                  <strong>:</strong>
                </td>
                <td
                  className="align-top p-0 text-justify"
                >
                  {dosyaKonusu}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sağ Taraf: Tarih */}
      {tarih && (
        <div className="text-[11pt] text-right">
          <strong>Tarih:</strong> {tarih}
        </div>
      )}
    </div>
  );
};
