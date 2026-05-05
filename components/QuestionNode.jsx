export default function QuestionNode({ node, isRoot, catColor, onSelect }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1e293b", margin: "0 0 4px" }}>
        {node.question}
      </h2>
      {node.subtitle && (
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px" }}>
          {node.subtitle}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {node.options.map((o, i) => (
          <button
            key={i}
            onClick={() => onSelect(o.next)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: isRoot ? "14px 16px" : "11px 14px",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              cursor: "pointer",
              textAlign: "left",
              borderLeft: o.color ? `4px solid ${o.color}` : undefined,
              transition: "border-color 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = catColor || "#2563eb";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            {o.icon && (
              <span style={{ fontSize: 22, flexShrink: 0 }}>{o.icon}</span>
            )}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: isRoot ? 15 : 14,
                  fontWeight: isRoot ? 700 : 500,
                  color: "#1e293b",
                }}
              >
                {o.label}
              </div>
              {o.desc && (
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>
                  {o.desc}
                </div>
              )}
            </div>
            <span style={{ color: "#cbd5e1", flexShrink: 0 }}>&rarr;</span>
          </button>
        ))}
      </div>
    </div>
  );
}
