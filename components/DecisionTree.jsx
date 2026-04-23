"use client";

import { useState, useCallback, useEffect } from "react";
import { NODES, getCatColor } from "@/data/nodes";
import Breadcrumbs from "./Breadcrumbs";
import ParadigmBanner, { InfoBox } from "./ParadigmBanner";
import QuestionNode from "./QuestionNode";
import TerminalNode from "./TerminalNode";
import IconLegend from "./IconLegend";

export default function DecisionTree() {
  const [path, setPath] = useState(["root"]);
  const [votes, setVotes] = useState({});
  const [showLegend, setShowLegend] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("icon_legend_dismissed");
  });

  const id = path[path.length - 1];
  const node = NODES[id];
  const cc = getCatColor(path);
  const isRoot = id === "root";

  const nav = useCallback((n) => setPath((p) => [...p, n]), []);

  const dismissLegend = useCallback(() => {
    localStorage.setItem("icon_legend_dismissed", "1");
    setShowLegend(false);
  }, []);

  // Fetch vote counts on mount
  useEffect(() => {
    fetch("/api/votes")
      .then((r) => r.json())
      .then((data) => setVotes(data))
      .catch(() => {});
  }, []);

  // Optimistic vote update
  const handleVote = useCallback((section, index, newVote) => {
    const key = `${id}:${section}:${index}`;
    setVotes((prev) => {
      const current = prev[key] || { up: 0, down: 0 };
      const myPrev = current.myVote || 0;
      let { up, down } = current;

      // Remove previous vote
      if (myPrev === 1) up--;
      if (myPrev === -1) down--;

      // Apply new vote
      if (newVote === 1) up++;
      if (newVote === -1) down++;

      return { ...prev, [key]: { up, down, myVote: newVote } };
    });
  }, [id]);

  return (
    <div
      style={{
        fontFamily: "'Inter',-apple-system,system-ui,sans-serif",
        maxWidth: 860,
        margin: "0 auto",
        padding: 16,
      }}
    >
      <IconLegend visible={showLegend} onDismiss={dismissLegend} />
      <div
        style={{
          textAlign: "center",
          marginBottom: 18,
          paddingBottom: 14,
          borderBottom: "1px solid #e2e8f0",
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", margin: 0 }}>
          AI/ML Decision Guide for Biological Science
        </h1>
        <p style={{ fontSize: 11, color: "#94a3b8", margin: "3px 0 0" }}>
          AI Clinic Series
        </p>
        <button
          onClick={() => setShowLegend(true)}
          title="Icon guide"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 28,
            height: 28,
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            color: "#64748b",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ?
        </button>
      </div>

      {cc && (
        <div
          style={{ height: 3, background: cc, borderRadius: 2, marginBottom: 10 }}
        />
      )}

      {!isRoot && (
        <Breadcrumbs path={path} catColor={cc} onNavigate={setPath} />
      )}

      <ParadigmBanner banner={node?.paradigmBanner} />
      <InfoBox infoBox={node?.infoBox} />

      {!node?.terminal && (
        <QuestionNode
          node={node}
          isRoot={isRoot}
          catColor={cc}
          onSelect={nav}
          nodeId={id}
          path={path}
        />
      )}

      {node?.terminal && (
        <TerminalNode
          node={node}
          catColor={cc}
          nodeId={id}
          votes={votes}
          onVote={handleVote}
        />
      )}

      <div
        style={{
          textAlign: "center",
          marginTop: 24,
          paddingTop: 10,
          borderTop: "1px solid #e2e8f0",
          fontSize: 11,
          color: "#94a3b8",
        }}
      >
        AI Clinic Series
      </div>
    </div>
  );
}
