import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Feature flag helpers
export type FeatureMap = Record<string, boolean>

export function isFeatureEnabled(featureKey: string | undefined, featureMap?: FeatureMap): boolean {
  if (!featureKey) return true
  if (!featureMap) return true
  return featureMap[featureKey] !== false
}

// Subscription helpers
export type SubscriptionLevel = "BASIC" | "STANDARD" | "PREMIUM" | "ENTERPRISE"

const SUBSCRIPTION_RANK: Record<SubscriptionLevel, number> = {
  BASIC: 0,
  STANDARD: 1,
  PREMIUM: 2,
  ENTERPRISE: 3,
}

export function hasRequiredSubscription(
  current: SubscriptionLevel | undefined,
  required: SubscriptionLevel | undefined
): boolean {
  if (!required) return true
  const currentLevel = (current || "BASIC") as SubscriptionLevel
  return SUBSCRIPTION_RANK[currentLevel] >= SUBSCRIPTION_RANK[required]
}
