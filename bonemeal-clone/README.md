# Bonemeal-style AI Growth Engineer Clone

> 从零实现的「AI Growth Engineer」功能复刻脚手架。不是复制 bonemeal.ai 的源码、品牌或私有实现，而是按公开可见能力做一套可落地的同类系统。

## 已覆盖的功能面

| 模块 | 功能 |
|---|---|
| Growth Command Center | 总览任务、机会、影响分、状态 |
| Surface Monitor | Reddit / LinkedIn / X / Google / ChatGPT / Gemini / AI Overview 信号聚合 |
| SEO Opportunity Engine | 发现低 CTR、高曝光、临近首页、缺 schema、标题弱的页面 |
| GEO / AI Search Tracker | 跟踪 ChatGPT、Gemini、Perplexity、Google AI Overview 的品牌可见度、引用源、情绪 |
| Content Drafting | 生成 blog、landing page、comparison page、glossary、social reply 草稿 |
| Competitor Research | 监控竞品增长页面、关键词、内容缺口 |
| Action Queue | 把机会转成可审核 action，支持 queued / drafting / ready / shipped |
| GitHub Shipping Agent | 把页面/SEO/schema 修改转成 PR 草稿的抽象接口 |
| Review Loop | 记录 shipped 后的点击、排名、引用、转化变化 |

## 目录结构

```txt
bonemeal-clone/
├── README.md
├── package.json
├── tsconfig.json
├── next.config.mjs
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── GrowthDashboard.tsx
├── lib/
│   ├── growth-agent.ts
│   └── mock-data.ts
└── specs/
    └── system-design.md
```

## 本地运行

```bash
cd bonemeal-clone
npm install
npm run dev
```

然后打开：

```txt
http://localhost:3000
```

## 下一步接真实 MCP / API

当前版本是功能骨架 + mock 数据。后续把以下 provider 替换成真实接口即可：

- `RedditProvider`
- `LinkedInProvider`
- `TwitterProvider`
- `SearchConsoleProvider`
- `GA4Provider`
- `AIVisibilityProvider`
- `GitHubShippingProvider`

核心编排在：

```txt
lib/growth-agent.ts
```

## 安全边界

- 默认只生成草稿和 PR，不自动发帖、不自动 merge。
- 所有外部发布动作必须人工审核。
- API key 不入库，使用环境变量。
