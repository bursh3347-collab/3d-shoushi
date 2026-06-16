import { actionQueue, aiVisibility, surfaceSignals } from "../lib/mock-data";

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
    <div style= display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 14 >
      <div className="card" style= padding: 18 >
        <h3 style= marginTop: 0 >Action queue</h3>
        <div style= display: "grid", gap: 10 >
          {actionQueue.map((action) => (
            <div key={action.id} style= border: "1px solid var(--line)", borderRadius: 16, padding: 14, background: "rgba(255,255,255,.035)" >
              <div style= display: "flex", justifyContent: "space-between", gap: 12 >
                <strong>{action.title}</strong>
                <span style= color: "var(--green)", fontSize: 13 >{statusLabel(action.status)}</span>
              </div>
              <p style= color: "var(--muted)", margin: "8px 0 12px", lineHeight: 1.55 >{action.reason}</p>
              <div style= display: "flex", gap: 8, flexWrap: "wrap", fontSize: 12, color: "var(--muted)" >
                <span>surface: {action.surface}</span>
                <span>impact: {action.impact}</span>
                <span>asset: {action.assetType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style= display: "grid", gap: 14 >
        <div className="card" style= padding: 18 >
          <h3 style= marginTop: 0 >AI search visibility</h3>
          {aiVisibility.map((row) => (
            <div key={row.engine} style= display: "grid", gridTemplateColumns: "110px 1fr 50px", gap: 10, alignItems: "center", marginBottom: 12 >
              <span>{row.engine}</span>
              <span style= height: 8, borderRadius: 999, background: "rgba(255,255,255,.08)", overflow: "hidden" >
                <span style={{ display: "block", width: `${row.visibility}%`, height: "100%", background: "linear-gradient(90deg, var(--green), var(--blue))" }} />
              </span>
              <strong>{row.visibility}%</strong>
            </div>
          ))}
        </div>

        <div className="card" style= padding: 18 >
          <h3 style= marginTop: 0 >Live surface signals</h3>
          <div style= display: "grid", gap: 10 >
            {surfaceSignals.map((signal) => (
              <div key={signal.title} style= display: "flex", justifyContent: "space-between", gap: 10, borderBottom: "1px solid var(--line)", paddingBottom: 10 >
                <div>
                  <strong>{signal.source}</strong>
                  <div style= color: "var(--muted)", fontSize: 13 >{signal.title}</div>
                </div>
                <span style= color: "var(--yellow)", whiteSpace: "nowrap" >{signal.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
