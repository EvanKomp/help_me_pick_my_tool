export default function ParadigmBanner({ banner }) {
  if (!banner) return null;
  return (
    <div
      style={{
        background: banner.color + "0d",
        border: `1px solid ${banner.color}33`,
        borderRadius: 8,
        padding: "10px 14px",
        marginBottom: 12,
        borderLeft: `4px solid ${banner.color}`,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: banner.color,
          marginBottom: banner.explanation ? 4 : 0,
        }}
      >
        🎓 {banner.label}
      </div>
      {banner.explanation && (
        <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.55 }}>
          {banner.explanation}
        </div>
      )}
    </div>
  );
}

export function InfoBox({ infoBox }) {
  if (!infoBox) return null;
  return (
    <div
      style={{
        background: infoBox.color + "0a",
        border: `1px solid ${infoBox.color}22`,
        borderRadius: 8,
        padding: "10px 14px",
        marginBottom: 12,
        fontSize: 12,
        color: "#374151",
        lineHeight: 1.55,
      }}
    >
      💡 {infoBox.text}
    </div>
  );
}
