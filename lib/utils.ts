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
