"use client";

import { useMemo } from "react";
import { NODES } from "@/data/nodes";

export default function Breadcrumbs({ path, catColor, onNavigate }) {
  const crumbs = useMemo(
    () =>
      path.map((pid, i) => {
        const n = NODES[pid];
        if (!n) return pid;
        if (n.terminal)
          return n.title.length > 28 ? n.title.slice(0, 25) + "\u2026" : n.title;
        if (pid === "root") return "Start";
        for (let j = i - 1; j >= 0; j--) {
          const par = NODES[path[j]];
          if (par?.options) {
            const o = par.options.find((x) => x.next === pid);
            if (o) {
              const l = o.label;
              return l.length > 28 ? l.slice(0, 25) + "\u2026" : l;
            }
          }
        }
        return pid;
      }),
    [path]
  );

  const bs = {
    padding: "4px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    color: "#475569",
    background: "#f8fafc",
  };

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
        <button onClick={() => onNavigate(path.slice(0, -1))} style={bs}>
          &larr; Back
        </button>
        <button
          onClick={() => onNavigate(["root"])}
          style={{ ...bs, color: "#94a3b8" }}
        >
          Start over
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          fontSize: 11,
          color: "#94a3b8",
        }}
      >
        {crumbs.map((l, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            {i > 0 && <span>&rsaquo;</span>}
            <span
              onClick={() => i < path.length - 1 && onNavigate(path.slice(0, i + 1))}
              style={{
                cursor: i < path.length - 1 ? "pointer" : "default",
                fontWeight: i === path.length - 1 ? 600 : 400,
                color:
                  i === path.length - 1 ? catColor || "#1e293b" : "#94a3b8",
                textDecoration: i < path.length - 1 ? "underline" : "none",
              }}
            >
              {l}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
