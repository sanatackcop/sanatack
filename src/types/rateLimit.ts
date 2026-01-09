import { PlanType } from "@/context/UserContext";

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
  plan_type: PlanType;
  usage: RateLimitUsageItem[];
}
