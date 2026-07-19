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
      style={{
        display: "flex",
        width: "100%",
        pageBreakInside: "avoid",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        marginTop: `${marginTop}px`,
        marginBottom: `${marginBottom}px`,
      }}
    >
      <div
        style={{
          textAlign: "center",
          minWidth: "250px",
          lineHeight: 1.8,
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "11pt" }}>{adSoyad}</div>
        {unvan && <div style={{ fontSize: "11pt" }}>{unvan}</div>}
        {showContactInfo && (
          <>
            {telefon && (
              <div style={{ fontSize: "10pt", color: "#666" }}>
                Tel: {telefon}
              </div>
            )}
            {eposta && (
              <div style={{ fontSize: "10pt", color: "#666" }}>
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
      style={{
        display: "flex",
        width: "100%",
        pageBreakInside: "avoid",
        justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
        marginTop: `${marginTop}px`,
      }}
    >
      <div
        style={{
          textAlign: "center",
          minWidth: "250px",
          lineHeight: 1.5,
        }}
      >
        {/* BAŞLIK */}
        <div
          style={{ fontWeight: "bold", fontSize: "12pt", marginBottom: "10px" }}
        >
          {title}
        </div>

        {/* TARİH */}
        {date && (
          <div style={{ fontSize: "11pt", marginBottom: "15px" }}>
            {date}
          </div>
        )}

        {/* İMZA ALANI */}
        {showSpace && (
          <div style={{ minHeight: "40px", marginBottom: "10px" }} />
        )}

        {/* AD-SOYAD */}
        {adSoyad && (
          <div
            style={{ fontSize: "11pt", fontWeight: "bold", marginTop: "10px" }}
          >
            {adSoyad}
          </div>
        )}

        {/* UNVAN */}
        {unvan && (
          <div style={{ fontSize: "11pt" }}>
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
    <div style={{ marginTop: `${marginTop}px`, pageBreakInside: "avoid" }}>
      <div
        style={{ fontWeight: "bold", fontSize: "12pt", marginBottom: "15px" }}
      >
        {title}
      </div>

      {members.map((member, idx) => (
        <div key={idx} style={{ marginBottom: "12px", lineHeight: 1.6 }}>
          <div style={{ fontSize: "11pt" }}>
            <strong>{member.adSoyad}</strong>
          </div>
          <div style={{ fontSize: "10pt" }}>{member.unvan}</div>
          {member.gorevi && (
            <div style={{ fontSize: "10pt", color: "#666" }}>
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
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
        paddingBottom: showBorder ? "10px" : 0,
        borderBottom: showBorder ? `1px solid #ccc` : "none",
        pageBreakInside: "avoid",
      }}
    >
      {/* Sol Taraf: Sayı ve Konu (Sayfanın yarısını geçemez) */}
      <div style={{ maxWidth: "50%" }}>
        <table
          style={{
            border: "none",
            padding: 0,
            margin: 0,
            fontSize: "11pt",
            borderSpacing: 0,
          }}
        >
          <tbody>
            {evrakSayisi && (
              <tr>
                <td style={{ verticalAlign: "top", padding: 0, width: "45px" }}>
                  <strong>Sayı</strong>
                </td>
                <td style={{ verticalAlign: "top", padding: "0 5px 0 0" }}>
                  <strong>:</strong>
                </td>
                <td style={{ verticalAlign: "top", padding: 0 }}>
                  {evrakSayisi}
                </td>
              </tr>
            )}
            {dosyaKonusu && (
              <tr>
                <td style={{ verticalAlign: "top", padding: 0, width: "45px" }}>
                  <strong>Konu</strong>
                </td>
                <td style={{ verticalAlign: "top", padding: "0 5px 0 0" }}>
                  <strong>:</strong>
                </td>
                <td
                  style={{
                    verticalAlign: "top",
                    padding: 0,
                    textAlign: "justify",
                  }}
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
        <div style={{ fontSize: "11pt", textAlign: "right" }}>
          <strong>Tarih:</strong> {tarih}
        </div>
      )}
    </div>
  );
};
