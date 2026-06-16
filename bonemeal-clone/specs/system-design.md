# System Design — AI Growth Engineer

## 1. 目标

复刻公开可见的 Bonemeal 类产品能力：连接搜索、站点、社交、AI 搜索和 GitHub，把增长机会自动转成可审核的页面、帖子、结构化数据和 PR。

## 2. 核心闭环

```txt
Collect signals
→ Normalize evidence
→ Score opportunities
→ Draft actions
→ Human review
→ Ship via GitHub / CMS / social
→ Measure result
→ Learn priority model
```

## 3. Agent 划分

### 3.1 Surface Monitor Agent

输入：Reddit、LinkedIn、X、Google Search Console、GA4、ChatGPT、Gemini、Perplexity、AI Overview、竞品站点。

输出：`SurfaceSignal[]`。

### 3.2 Opportunity Scoring Agent

评分维度：

- intent strength
- traffic upside
- current rank / citation gap
- competitor weakness
- conversion proximity
- effort
- risk
- freshness window

输出：`GrowthOpportunity[]`。

### 3.3 Drafting Agent

按 asset type 生成：

- Reddit reply
- LinkedIn post
- X thread
- blog post
- landing page
- comparison page
- glossary page
- title / meta / schema patch
- CTA / internal link patch

### 3.4 Shipping Agent

默认只做 reviewable shipping：

- create branch
- write files
- open PR
- attach checklist
- wait for human review

### 3.5 Measurement Agent

上线后回测：

- GSC impressions / clicks / CTR / position
- GA4 sessions / conversion
- AI search visibility
- citation source changes
- social engagement
- Reddit reply outcome

## 4. 数据模型

```ts
type SurfaceSignal = {
  id: string;
  surface: Surface;
  title: string;
  url?: string;
  evidence: string[];
  detectedAt: string;
  score: number;
};

type GrowthOpportunity = {
  id: string;
  signalIds: string[];
  title: string;
  reasoning: string;
  impactScore: number;
  confidence: number;
  assetType: AssetType;
  risk: RiskLevel;
};

type DraftedAction = {
  id: string;
  opportunityId: string;
  title: string;
  body: string;
  targetPath?: string;
  reviewRequired: boolean;
  acceptanceCriteria: string[];
};
```

## 5. MCP / Provider 接口

建议 provider：

```txt
GitHub MCP       → branch / files / PR
Search Console  → query, page, CTR, position
GA4              → behavior + conversion
Reddit API       → subreddit thread discovery + draft queue
LinkedIn API     → post draft queue
X API            → post / thread draft queue
LLM Provider     → copy, code patch, schema, reasoning
Crawler          → site audit + competitor pages
AI Search Probe  → prompt visibility and citation check
```

## 6. Human-in-the-loop

高风险动作必须人工审核：

- 对外发帖
- 自动回复社区
- 修改 pricing / legal / claims
- merge PR
- 删除页面
- 大批量生成页面

## 7. 不能直接复制的部分

- 不复制对方私有源码。
- 不复制对方商标、logo、视觉资产。
- 不伪装成对方服务。
- 只实现同类功能和业务逻辑。
