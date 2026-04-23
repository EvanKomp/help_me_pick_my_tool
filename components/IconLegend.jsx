"use client";

import { TAG_DEFINITIONS } from "@/data/nodes";

const TAG_DESCRIPTIONS = {
  nocode: "Use entirely through a web interface — no programming needed",
  cli: "Requires command-line usage but no custom code",
  code: "Requires writing Python, R, or other scripts",
  ml: "Uses machine learning models (training or inference)",
  ai: "Involves LLMs, agents, or foundation models",
  deterministic: "Rule-based or algorithmic — no stochastic ML component",
  gpu: "Needs GPU or HPC resources for reasonable performance",
};

function LegendRow({ emoji, badge, badgeColor, label, labelColor, desc }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 6,
        fontSize: 12,
      }}
    >
      <span style={{ width: 100, flexShrink: 0, textAlign: "right" }}>
        {badge ? (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              background: badgeColor + "18",
              color: badgeColor,
              padding: "1px 7px",
              borderRadius: 10,
            }}
          >
            {badge}
          </span>
        ) : label ? (
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              background: labelColor + "14",
              color: labelColor,
              padding: "1px 6px",
              borderRadius: 10,
              whiteSpace: "nowrap",
            }}
          >
            {emoji} {label}
          </span>
        ) : (
          <span style={{ fontSize: 14 }}>{emoji}</span>
        )}
      </span>
      <span style={{ color: "#374151" }}>{desc}</span>
    </div>
  );
}

export default function IconLegend({ visible, onDismiss }) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onDismiss();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "24px 28px",
          maxWidth: 520,
          width: "90%",
          maxHeight: "85vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#1e293b",
            margin: "0 0 4px",
          }}
        >
          Icon Guide
        </h2>
        <p
          style={{
            fontSize: 12,
            color: "#64748b",
            margin: "0 0 16px",
          }}
        >
          Here&apos;s what the icons and badges mean throughout the guide.
        </p>

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Tool Badges
          </div>
          <LegendRow
            badge="RECOMMENDED"
            badgeColor="#2563eb"
            desc="Our top pick for this category"
          />
          <LegendRow
            badge="NEW"
            badgeColor="#2563eb"
            desc="Recently added tool"
          />
          {Object.entries(TAG_DEFINITIONS).map(([key, def]) => (
            <LegendRow
              key={key}
              emoji={def.emoji}
              label={def.label}
              labelColor={def.color}
              desc={TAG_DESCRIPTIONS[key]}
            />
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 8,
            }}
          >
            Other Icons
          </div>
          <LegendRow emoji="💰" desc="Pricing information" />
          <LegendRow emoji="📦" desc="Required libraries / packages" />
          <LegendRow emoji="📖" desc="Link to documentation" />
          <LegendRow emoji="🌐" desc="Ready-to-use hosted tools" />
          <LegendRow emoji="🔧" desc="Build-your-own / DIY tools" />
          <LegendRow emoji="📋" desc="Data you'll need" />
          <LegendRow emoji="🔗" desc="Connection to AI Clinic 1 material" />
          <LegendRow emoji="⚠️" desc="Important note or caveat" />
        </div>

        <button
          onClick={onDismiss}
          style={{
            width: "100%",
            padding: "10px 0",
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
            background: "#2563eb",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
