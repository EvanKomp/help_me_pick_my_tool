"use client";

import { useState } from "react";
import FeedbackInput from "./FeedbackInput";

export default function QuestionNode({ node, isRoot, catColor, onSelect, nodeId, path }) {
  const [showFeedback, setShowFeedback] = useState(false);

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

        {!isRoot && (
          <button
            onClick={() => setShowFeedback((s) => !s)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              background: showFeedback ? "#f1f5f9" : "transparent",
              border: "1px dashed #cbd5e1",
              borderRadius: 10,
              cursor: "pointer",
              textAlign: "left",
              marginTop: 4,
            }}
          >
            <span style={{ fontSize: 14, flexShrink: 0, opacity: 0.6 }}>?</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8" }}>
                I don&apos;t see what I need
              </div>
            </div>
          </button>
        )}
      </div>

      {showFeedback && <FeedbackInput nodeId={nodeId} path={path} />}
    </div>
  );
}
