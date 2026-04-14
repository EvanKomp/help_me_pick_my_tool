import ToolCard from "./ToolCard";

export default function TerminalNode({ node, catColor, nodeId, votes, onVote }) {
  return (
    <div>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>
        {node.title}
      </h2>
      {node.description && (
        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: "0 0 12px" }}>
          {node.description}
        </p>
      )}
      {node.pipeline && (
        <div
          style={{
            background: "#d1fae5",
            border: "1px solid #059669",
            borderRadius: 8,
            padding: "8px 12px",
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}>PIPELINE</div>
          <div style={{ fontSize: 13, fontFamily: "monospace", color: "#064e3b" }}>
            {node.pipeline}
          </div>
        </div>
      )}

      {node.hosted?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <h3
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94a3b8",
              margin: "0 0 6px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            🌐 Ready-to-use tools
          </h3>
          {node.hosted.map((t, i) => (
            <ToolCard
              key={`hosted-${i}`}
              tool={t}
              index={i}
              section="hosted"
              catColor={catColor}
              nodeId={nodeId}
              voteData={votes?.[`${nodeId}:hosted:${i}`]}
              onVote={onVote}
            />
          ))}
        </div>
      )}

      {node.diy?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <h3
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#94a3b8",
              margin: "0 0 6px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            🔧 Build your own
          </h3>
          {node.diy.map((t, i) => (
            <ToolCard
              key={`diy-${i}`}
              tool={t}
              index={i}
              section="diy"
              catColor={catColor}
              nodeId={nodeId}
              voteData={votes?.[`${nodeId}:diy:${i}`]}
              onVote={onVote}
            />
          ))}
        </div>
      )}

      {node.dataNeeded && (
        <div
          style={{
            background: "#fef3c7",
            border: "1px solid #d97706",
            borderRadius: 8,
            padding: "10px 14px",
            marginTop: 10,
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 2 }}>
            📋 DATA YOU&apos;LL NEED
          </div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
            {node.dataNeeded}
          </div>
        </div>
      )}
      {node.clinicConnection && (
        <div
          style={{
            background: "#ede9fe",
            border: "1px solid #7c3aed",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#5b21b6", marginBottom: 2 }}>
            🔗 CLINIC 1 CONNECTION
          </div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
            {node.clinicConnection}
          </div>
        </div>
      )}
      {node.note && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #ef4444",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#b91c1c", marginBottom: 2 }}>
            ⚠️ NOTE
          </div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{node.note}</div>
        </div>
      )}
    </div>
  );
}
