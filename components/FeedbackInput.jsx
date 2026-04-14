"use client";

import { useState, useCallback } from "react";
import { getSessionId } from "@/lib/session";

export default function FeedbackInput({ nodeId, path }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error

  const submit = useCallback(async () => {
    if (!input.trim()) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_id: nodeId,
          path,
          user_input: input.trim(),
          session_id: getSessionId(),
        }),
      });
      if (res.ok) {
        setStatus("done");
        setInput("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }, [input, nodeId, path]);

  if (status === "done") {
    return (
      <div
        style={{
          background: "#d1fae5",
          border: "1px solid #059669",
          borderRadius: 8,
          padding: "12px 16px",
          marginTop: 8,
          fontSize: 13,
          color: "#065f46",
        }}
      >
        Thanks! We&apos;ll review this and update the guide.
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 8,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 8,
        padding: "12px 16px",
      }}
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe what you're trying to do and we'll add it in a future update..."
        rows={3}
        style={{
          width: "100%",
          fontSize: 13,
          padding: "8px 10px",
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          resize: "vertical",
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
        <button
          onClick={submit}
          disabled={!input.trim() || status === "submitting"}
          style={{
            fontSize: 12,
            fontWeight: 600,
            padding: "6px 14px",
            borderRadius: 6,
            border: "none",
            background: input.trim() ? "#2563eb" : "#e2e8f0",
            color: input.trim() ? "#fff" : "#94a3b8",
            cursor: input.trim() ? "pointer" : "default",
          }}
        >
          {status === "submitting" ? "Submitting..." : "Submit"}
        </button>
        {status === "error" && (
          <span style={{ fontSize: 12, color: "#dc2626" }}>
            Something went wrong. Try again?
          </span>
        )}
      </div>
    </div>
  );
}
