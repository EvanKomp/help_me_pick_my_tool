"use client";

import { useState, useCallback } from "react";
import { getSessionId } from "@/lib/session";

function renderPromptWithPlaceholders(promptStr) {
  return promptStr.split(/({{[^}]+}})/g).map((part, i) => {
    const match = part.match(/^{{(.+)}}$/);
    if (match) {
      return (
        <span
          key={i}
          style={{
            background: "#fef3c7",
            fontWeight: 700,
            padding: "1px 4px",
            borderRadius: 3,
            color: "#92400e",
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function ToolCard({ tool, index, section, catColor, nodeId, voteData, onVote }) {
  const [showCode, setShowCode] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const toggleCode = useCallback(() => setShowCode((s) => !s), []);
  const togglePrompt = useCallback(() => setShowPrompt((s) => !s), []);
  const cc = catColor || "#2563eb";

  const up = voteData?.up || 0;
  const down = voteData?.down || 0;
  const myVote = voteData?.myVote || 0; // +1, -1, or 0

  const castVote = useCallback(
    (direction) => {
      // If clicking the same direction, remove vote (set to 0)
      const newVote = myVote === direction ? 0 : direction;
      if (onVote) onVote(section, index, newVote);

      // POST in background
      if (newVote !== 0) {
        fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            node_id: nodeId,
            tool_section: section,
            tool_index: index,
            tool_name: tool.name,
            vote: newVote,
            session_id: getSessionId(),
          }),
        }).catch(() => {});
      }
    },
    [myVote, onVote, section, index, nodeId, tool.name]
  );

  const copyPrompt = useCallback(() => {
    navigator.clipboard.writeText(tool.prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [tool.prompt]);

  const voteButtonStyle = (active) => ({
    fontSize: 12,
    lineHeight: 1,
    padding: "2px 5px",
    border: "1px solid " + (active ? "#94a3b8" : "#e2e8f0"),
    borderRadius: 4,
    background: active ? "#f1f5f9" : "transparent",
    cursor: "pointer",
    color: active ? "#1e293b" : "#94a3b8",
  });

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${tool.top ? cc : "#e2e8f0"}`,
        borderRadius: 8,
        padding: "10px 14px",
        marginBottom: 6,
        borderLeft: tool.top ? `3px solid ${cc}` : undefined,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 2,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700 }}>
          {tool.url ? (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: cc, textDecoration: "none" }}
            >
              {tool.name} ↗
            </a>
          ) : (
            <span style={{ color: "#1e293b" }}>{tool.name}</span>
          )}
        </span>
        {tool.top && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              background: cc + "18",
              color: cc,
              padding: "1px 7px",
              borderRadius: 10,
            }}
          >
            RECOMMENDED
          </span>
        )}
        {tool.pricing && (
          <span style={{ fontSize: 10, color: "#94a3b8" }}>
            💰 {tool.pricing}
          </span>
        )}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            marginLeft: "auto",
            flexShrink: 0,
          }}
        >
          <button onClick={() => castVote(1)} style={voteButtonStyle(myVote === 1)} title="Useful">
            ▲
          </button>
          <span style={{ fontSize: 11, color: "#64748b", minWidth: 16, textAlign: "center" }}>
            {up - down || ""}
          </span>
          <button onClick={() => castVote(-1)} style={voteButtonStyle(myVote === -1)} title="Not useful">
            ▼
          </button>
        </span>
      </div>
      {tool.libs && (
        <div
          style={{
            fontSize: 11,
            color: "#059669",
            fontFamily: "monospace",
            marginBottom: 2,
          }}
        >
          📦 {tool.libs}
        </div>
      )}
      <p
        style={{
          fontSize: 12,
          color: "#374151",
          margin: "0 0 3px",
          lineHeight: 1.45,
        }}
      >
        {tool.desc}
      </p>
      {tool.link && (
        <a
          href={tool.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color: cc }}
        >
          📖 Documentation ↗
        </a>
      )}
      {tool.howto && (
        <div style={{ marginTop: 4 }}>
          <button
            onClick={toggleCode}
            style={{
              fontSize: 11,
              color: cc,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            {showCode ? "▼ Hide code example" : "▶ Show code example"}
          </button>
          {showCode && (
            <pre
              style={{
                background: "#1e293b",
                color: "#e2e8f0",
                padding: "10px 12px",
                borderRadius: 6,
                fontSize: 11,
                lineHeight: 1.5,
                overflow: "auto",
                marginTop: 4,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {tool.howto}
            </pre>
          )}
        </div>
      )}
      {tool.prompt && (
        <div style={{ marginTop: 4 }}>
          <button
            onClick={togglePrompt}
            style={{
              fontSize: 11,
              color: "#b45309",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            {showPrompt
              ? "▼ Hide Claude Code prompt"
              : "▶ Get started with Claude Code"}
          </button>
          {showPrompt && (
            <div
              style={{
                background: "#fff7ed",
                border: "1px solid #f59e0b",
                borderRadius: 6,
                padding: "10px 12px",
                marginTop: 4,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#92400e",
                  marginBottom: 6,
                  fontWeight: 500,
                }}
              >
                Copy this prompt, fill in the blanks, and give it to Claude
                Code:
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#1e293b",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {renderPromptWithPlaceholders(tool.prompt)}
              </div>
              <button
                onClick={copyPrompt}
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  color: copied ? "#059669" : "#b45309",
                  background: copied ? "#d1fae5" : "#fef3c7",
                  border: `1px solid ${copied ? "#059669" : "#f59e0b"}`,
                  borderRadius: 4,
                  padding: "3px 10px",
                  cursor: "pointer",
                }}
              >
                {copied ? "Copied!" : "Copy prompt"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
