import { PlanType } from "@/context/UserContext";

export interface RateLimitUsageSummaryItem {
  action: string;
  label?: string;
  description?: string;
  category?: string;
  usedCredits: number;
  remainingCredits: number | null;
  limit: number | null;
  hits: number;
  windowEndsAt: string;
  windowSeconds: number;
}

export interface RateLimitSummaryResponse {
  plan_type: PlanType;
  usage: RateLimitUsageSummaryItem[];
}
