export const heroMetrics = [
  { label: "机会", value: "42" },
  { label: "PR", value: "7" },
  { label: "AI 可见", value: "+18%" },
  { label: "CTR", value: "+9.4%" },
];

export const features = [
  { icon: "🛰️", title: "Surface Monitor", description: "聚合 Reddit、LinkedIn、X、Google、ChatGPT、Gemini、AI Overview 的需求和讨论信号。" },
  { icon: "🔎", title: "SEO Opportunity Engine", description: "识别高曝光低点击、临近首页、标题弱、缺 schema、内容缺口和流量衰退页面。" },
  { icon: "🤖", title: "GEO / AI Search Tracker", description: "按 prompt 跟踪品牌在 ChatGPT、Gemini、Perplexity 和 AI Overview 中的可见度、引用和情绪。" },
  { icon: "✍️", title: "Content Drafting", description: "生成博客、落地页、对比页、词汇表、Reddit 回复、LinkedIn 帖和 X thread 草稿。" },
  { icon: "🧬", title: "Schema & Page Fixes", description: "为产品页、价格页、FAQ 和文章生成标题、meta、结构化数据和 CTA 修复。" },
  { icon: "🏁", title: "Competitor Research", description: "监控竞品增长最快目录、关键词、引用源和内容格式，转化为可执行 action。" },
  { icon: "🔀", title: "GitHub Shipping", description: "将站点修复写成文件变更，创建分支、提交并打开 PR，等待人工 review。" },
  { icon: "📈", title: "Learning Loop", description: "上线后回看排名、点击、引用、转化和社媒反馈，把结果反馈给下一轮优先级。" },
  { icon: "🛡️", title: "Human Review", description: "默认不自动发帖、不自动 merge；高风险动作进入人工审批。" },
];

export const actionQueue = [
  {
    id: "act_001",
    title: "Improve /pricing SEO and add Product schema",
    reason: "Search Console 显示 pricing 相关查询曝光上涨 38%，但 CTR 低于同类页面。",
    surface: "Google Search",
    impact: "High",
    assetType: "PR",
    status: "ready",
  },
  {
    id: "act_002",
    title: "Draft Reddit reply for r/marketing AI search thread",
    reason: "该 thread 已进入 Google 第一页，讨论意图和产品定位高度匹配。",
    surface: "Reddit",
    impact: "Medium",
    assetType: "Reply draft",
    status: "drafting",
  },
  {
    id: "act_003",
    title: "Create comparison page for competitor alternative query",
    reason: "竞品 alternative query 月度需求增长，当前站点没有交易型页面承接。",
    surface: "Competitor SEO",
    impact: "High",
    assetType: "Landing page",
    status: "queued",
  },
  {
    id: "act_004",
    title: "Refresh AI citation sources guide",
    reason: "Gemini 和 Perplexity 引用源集中在第三方 guide，本站内容缺少可引用定义。",
    surface: "AI Search",
    impact: "High",
    assetType: "Blog update",
    status: "shipped",
  },
];

export const aiVisibility = [
  { engine: "ChatGPT", visibility: 64 },
  { engine: "Gemini", visibility: 48 },
  { engine: "Perplexity", visibility: 57 },
  { engine: "AI Overview", visibility: 31 },
];

export const surfaceSignals = [
  { source: "Reddit", title: "How to rank in ChatGPT?", score: "92" },
  { source: "Google", title: "pricing page CTR anomaly", score: "88" },
  { source: "LinkedIn", title: "founders discuss AI search visibility", score: "73" },
  { source: "Competitor", title: "/compare folder growth +21%", score: "69" },
];
