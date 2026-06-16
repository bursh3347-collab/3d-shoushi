import { GrowthDashboard } from "../components/GrowthDashboard";
import { features, heroMetrics } from "../lib/mock-data";

export default function Page() {
  return (
    <main className="page">
      <div className="shell">
        <nav className="nav">
          <div className="logo"><span className="logoMark" /> AI Growth Engineer</div>
          <div className="navLinks">
            <span>SEO</span><span>GEO</span><span>Social</span><span>GitHub PR</span>
          </div>
        </nav>

        <section className="hero">
          <div>
            <div className="eyebrow">Growth agent that ships</div>
            <h1>把增长机会变成可合并的代码、页面和帖子。</h1>
            <p className="lead">
              监控 Google、Reddit、LinkedIn、X、ChatGPT、Gemini 和 AI Overview；发现 SEO / GEO / 社媒机会；生成内容、结构化数据和站点修复；最后打开 PR 等你审核。
            </p>
            <div className="actions">
              <button className="primary">Run growth audit</button>
              <button className="secondary">View action queue</button>
            </div>
          </div>

          <div className="card agentCard">
            <div className="agentHeader">
              <strong>shipping-agent</strong>
              <span className="status">auto mode ready</span>
            </div>
            <div className="terminal">
              <div>● Audit(app/pricing/page.tsx)</div>
              <div className="diffDel">18- The platform for teams</div>
              <div className="diffAdd">18+ AI Growth Engineer for SEO and AI Search</div>
              <div className="diffAdd">31+ Added Product schema + FAQ schema</div>
              <br />
              <div>● Opening PR: improve /pricing SEO</div>
              <div>github.com/your-site/pull/284</div>
              <div>checks: build · lint · preview</div>
            </div>
            <div className="grid">
              {heroMetrics.map((metric) => (
                <div className="card metric" key={metric.label}>
                  <div className="metricLabel">{metric.label}</div>
                  <div className="metricValue">{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="sectionTitle">
            <h2>全功能复刻范围</h2>
            <p>按公开站点能力拆成八个增长代理：监控、评估、起草、排队、发 PR、回测，形成可持续增长闭环。</p>
          </div>
          <div className="features">
            {features.map((feature) => (
              <article className="card feature" key={feature.title}>
                <div className="featureIcon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section dashboard">
          <div className="sectionTitle">
            <h2>Growth command center</h2>
            <p>这里是后续接入真实 MCP / API 后的运营控制台：所有机会先进入审核队列，再决定是否生成 PR 或发布草稿。</p>
          </div>
          <GrowthDashboard />
        </section>
      </div>
    </main>
  );
}
