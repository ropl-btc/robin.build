"use client";
import { Noise } from "@/components/ui/noise";

export function NoiseBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* Subtle grain for both light and dark */}
      <Noise patternAlpha={14} patternRefreshInterval={4} />
    </div>
  );
}
