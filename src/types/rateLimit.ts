export type RateLimitTier = "free" | "pro" | "team" | "admin";

export interface RateLimitUsageItem {
  action: string;
  label?: string;
  description?: string;
  category?: string;
  creditsPerUse: number;
  usedCredits: number;
  remainingCredits: number | null;
  limit: number | null;
  hits: number;
  windowEndsAt: string;
  windowSeconds: number;
}

export interface RateLimitSummaryResponse {
  tier: RateLimitTier;
  usage: RateLimitUsageItem[];
}

export interface RateLimitCatalogItem {
  action: string;
  label?: string;
  description?: string;
  category?: string;
  creditsPerUse: number;
  windowSeconds: number;
  limits: Partial<Record<RateLimitTier, number | null>>;
}
