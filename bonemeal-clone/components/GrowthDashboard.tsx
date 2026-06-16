import { actionQueue, aiVisibility, surfaceSignals } from "../lib/mock-data";

const panelStyle: React.CSSProperties = {
  padding: 20,
};

const splitGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.15fr 0.85fr",
  gap: 14,
};

const stackStyle: React.CSSProperties = {
  display: "grid",
  gap: 14,
};

const queueItemStyle: React.CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 18,
  padding: 14,
  background: "rgba(255,255,255,.04)",
};

const rowBetweenStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
};

const pillStyle: React.CSSProperties = {
  border: "1px solid var(--line)",
  borderRadius: 999,
  padding: "4px 9px",
  color: "var(--green)",
  fontSize: 12,
};

const metaStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  color: "var(--muted)",
  fontSize: 12,
};

const progressTrackStyle: React.CSSProperties = {
  flex: 1,
  height: 8,
  borderRadius: 999,
  overflow: "hidden",
  background: "rgba(255,255,255,.1)",
};

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    queued: "Queued",
    drafting: "Drafting",
    ready: "Ready",
    shipped: "Shipped",
  };
  return labels[status] ?? status;
}

export function GrowthDashboard() {
  return (
    <div style={splitGridStyle}>
      <div className="card" style={panelStyle}>
        <h3 style= marginTop: 0 >Action queue</h3>
        <div style={stackStyle}>
          {actionQueue.map((action) => (
            <div key={action.id} style={queueItemStyle}>
              <div style={rowBetweenStyle}>
                <strong>{action.title}</strong>
                <span style={pillStyle}>{statusLabel(action.status)}</span>
              </div>
              <p style= color: "var(--muted)", lineHeight: 1.6 >{action.reason}</p>
              <div style={metaStyle}>
                <span>surface: {action.surface}</span>
                <span>impact: {action.impact}</span>
                <span>asset: {action.assetType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={stackStyle}>
        <div className="card" style={panelStyle}>
          <h3 style= marginTop: 0 >AI search visibility</h3>
          <div style={stackStyle}>
            {aiVisibility.map((row) => (
              <div key={row.engine} style= ...rowBetweenStyle, gap: 10 >
                <span style= minWidth: 80 >{row.engine}</span>
                <span style={progressTrackStyle}>
                  <span style={{ display: "block", width: `${row.visibility}%`, height: "100%", background: "linear-gradient(90deg, var(--green), var(--blue))" }} />
                </span>
                <strong>{row.visibility}%</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={panelStyle}>
          <h3 style= marginTop: 0 >Live surface signals</h3>
          <div style={stackStyle}>
            {surfaceSignals.map((signal) => (
              <div key={signal.title} style={rowBetweenStyle}>
                <div>
                  <strong>{signal.source}</strong>
                  <div style= color: "var(--muted)", marginTop: 4 >{signal.title}</div>
                </div>
                <span style={pillStyle}>{signal.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
