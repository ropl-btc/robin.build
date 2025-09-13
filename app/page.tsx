"use client";

import { TypingHyperText } from "@/components/custom/typing-hyper-text";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { useState } from "react";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";

export default function Home() {
  const [showCta, setShowCta] = useState(false);
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="absolute right-4 top-4">
        <AnimatedThemeToggler className="size-8 grid place-items-center rounded-md outline-none focus:outline-none cursor-pointer" />
      </div>
      <div className="flex flex-col items-center gap-4">
        <TypingHyperText
          className="text-4xl sm:text-6xl"
          typeInterval={140}
          scrambleDuration={420}
          onComplete={() => setShowCta(true)}
        >
          robin.build
        </TypingHyperText>
        {/* Smooth reserved space + fade/slide in for the button */}
        <div
          className={
            (showCta ? "h-12 mt-1" : "h-0 mt-0 ") +
            " w-full overflow-hidden transition-[height,margin] duration-300 ease-out"
          }
        >
          <div
            className={
              "flex w-full justify-center transition-all duration-300 ease-out " +
              (showCta
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-2 pointer-events-none")
            }
          >
            <InteractiveHoverButton>Continue</InteractiveHoverButton>
          </div>
        </div>
      </div>
    </div>
  );
}
