export type Surface = "reddit" | "linkedin" | "twitter" | "google" | "chatgpt" | "gemini" | "perplexity" | "ai_overview" | "competitor";
export type AssetType = "blog" | "landing_page" | "comparison_page" | "glossary" | "social_reply" | "schema_fix" | "github_pr";
export type RiskLevel = "low" | "medium" | "high";

export interface SurfaceSignal {
  id: string;
  surface: Surface;
  title: string;
  url?: string;
  evidence: string[];
  detectedAt: string;
  score: number;
}

export interface GrowthOpportunity {
  id: string;
  signalIds: string[];
  title: string;
  reasoning: string;
  impactScore: number;
  confidence: number;
  assetType: AssetType;
  risk: RiskLevel;
}

export interface DraftedAction {
  id: string;
  opportunityId: string;
  title: string;
  body: string;
  targetPath?: string;
  reviewRequired: boolean;
  acceptanceCriteria: string[];
}

export interface ShippingPlan {
  branchName: string;
  commitMessage: string;
  files: Array<{ path: string; content: string }>;
  pullRequestTitle: string;
  pullRequestBody: string;
}

export class GrowthAgent {
  rankSignals(signals: SurfaceSignal[]): SurfaceSignal[] {
    return [...signals].sort((a, b) => b.score - a.score);
  }

  createOpportunities(signals: SurfaceSignal[]): GrowthOpportunity[] {
    return this.rankSignals(signals).map((signal, index) => ({
      id: `opp_${index + 1}`,
      signalIds: [signal.id],
      title: `Act on ${signal.title}`,
      reasoning: signal.evidence.join(" "),
      impactScore: Math.min(100, Math.round(signal.score * 0.82 + 12)),
      confidence: Math.min(0.95, signal.score / 100),
      assetType: this.pickAssetType(signal),
      risk: signal.surface === "reddit" || signal.surface === "linkedin" || signal.surface === "twitter" ? "medium" : "low",
    }));
  }

  draftAction(opportunity: GrowthOpportunity): DraftedAction {
    return {
      id: `draft_${opportunity.id}`,
      opportunityId: opportunity.id,
      title: opportunity.title,
      body: this.composeDraftBody(opportunity),
      targetPath: this.pickTargetPath(opportunity),
      reviewRequired: true,
      acceptanceCriteria: [
        "Evidence is cited in the internal action record",
        "No API keys or secrets are committed",
        "Human review is required before publishing externally",
        "Post-ship metrics are recorded after 7 and 30 days",
      ],
    };
  }

  createShippingPlan(action: DraftedAction): ShippingPlan {
    const slug = action.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48);
    const targetPath = action.targetPath ?? `content/${slug}.md`;

    return {
      branchName: `growth/${slug}`,
      commitMessage: `Add growth action: ${action.title}`,
      files: [{ path: targetPath, content: action.body }],
      pullRequestTitle: action.title,
      pullRequestBody: [
        "## Summary",
        action.body.slice(0, 600),
        "",
        "## Review checklist",
        ...action.acceptanceCriteria.map((item) => `- [ ] ${item}`),
      ].join("\n"),
    };
  }

  private pickAssetType(signal: SurfaceSignal): AssetType {
    if (signal.surface === "reddit") return "social_reply";
    if (signal.surface === "competitor") return "comparison_page";
    if (signal.surface === "chatgpt" || signal.surface === "gemini" || signal.surface === "perplexity" || signal.surface === "ai_overview") return "blog";
    if (signal.title.toLowerCase().includes("schema")) return "schema_fix";
    return "landing_page";
  }

  private pickTargetPath(opportunity: GrowthOpportunity): string {
    if (opportunity.assetType === "social_reply") return `drafts/social/${opportunity.id}.md`;
    if (opportunity.assetType === "schema_fix") return `drafts/schema/${opportunity.id}.md`;
    if (opportunity.assetType === "comparison_page") return `drafts/compare/${opportunity.id}.md`;
    return `drafts/content/${opportunity.id}.md`;
  }

  private composeDraftBody(opportunity: GrowthOpportunity): string {
    return [
      `# ${opportunity.title}`,
      "",
      `Impact score: ${opportunity.impactScore}`,
      `Confidence: ${Math.round(opportunity.confidence * 100)}%`,
      `Risk: ${opportunity.risk}`,
      "",
      "## Reasoning",
      opportunity.reasoning,
      "",
      "## Draft",
      "Replace this section with model-generated copy or code patch after connecting the LLM provider.",
      "",
      "## Measurement plan",
      "Track impressions, clicks, ranking, AI citations, sentiment, and conversions after shipping.",
    ].join("\n");
  }
}
