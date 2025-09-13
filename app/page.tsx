"use client";

import { TypingHyperText } from "@/components/custom/typing-hyper-text";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/magicui/terminal";
import { Desktop } from "@/components/os/Desktop";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { useTerminalSequenceItem } from "@/components/magicui/terminal";

export default function Home() {
  const [showCta, setShowCta] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Reset boot flag when relaunching
  useEffect(() => {
    if (!launched) return;
    setBootComplete(false);
  }, [launched]);

  // Disable page scrolling when Desktop is active
  useEffect(() => {
    const desktopActive = launched && bootComplete;
    const html = document.documentElement;
    const { style: htmlStyle } = html;
    const { style: bodyStyle } = document.body;
    if (desktopActive) {
      htmlStyle.overflow = "hidden";
      bodyStyle.overflow = "hidden";
    } else {
      htmlStyle.overflow = "";
      bodyStyle.overflow = "";
    }
    return () => {
      htmlStyle.overflow = "";
      bodyStyle.overflow = "";
    };
  }, [launched, bootComplete]);

  // Inline component: prompt for user's name inside Terminal sequence
  function TerminalNamePrompt() {
    const { isActive, complete } = useTerminalSequenceItem();
    const [value, setValue] = useState("");
    const [submitted, setSubmitted] = useState(false);
    useEffect(() => {
      if (!isActive) return;
      const el = document.getElementById(
        "terminal-name-input",
      ) as HTMLInputElement | null;
      el?.focus();
    }, [isActive]);
    if (!isActive) return null;
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="font-mono text-muted-foreground">{">"}</span>
        <label
          htmlFor="terminal-name-input"
          className="font-mono text-muted-foreground"
        >
          enter your name:
        </label>
        <input
          id="terminal-name-input"
          className="ml-2 min-w-0 flex-1 bg-transparent font-mono outline-none placeholder:text-muted-foreground"
          placeholder="your name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              setSubmitted(true);
              const name = value.trim();
              setUserName(name);
              complete();
              setBootComplete(true);
            }
          }}
          disabled={submitted}
          aria-label="enter your name"
        />
      </div>
    );
  }
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {!bootComplete && (
        <div className="absolute right-4 top-4 z-30">
          <AnimatedThemeToggler className="size-8 grid place-items-center rounded-md outline-none focus:outline-none cursor-pointer" />
        </div>
      )}
      {/* Hero section (title + CTA) */}
      <div
        className={
          "flex flex-col items-center gap-4 transition-all duration-500 ease-out " +
          (launched
            ? "opacity-0 -translate-y-2 scale-[0.98] pointer-events-none"
            : "opacity-100 translate-y-0 scale-100")
        }
        aria-hidden={launched}
      >
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
            <InteractiveHoverButton onClick={() => setLaunched(true)}>
              Continue
            </InteractiveHoverButton>
          </div>
        </div>
      </div>

      {/* Terminal section */}
      {launched && !bootComplete ? (
        <div
          className="absolute inset-0 grid place-items-center z-10"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="w-full px-4 sm:px-0 flex items-center justify-center">
            <Terminal startOnView={false} className="shadow-sm">
              <TypingAnimation className="text-muted-foreground">
                {"> start robin.build"}
              </TypingAnimation>

              <AnimatedSpan className="text-muted-foreground">
                starting robin.build…
              </AnimatedSpan>

              <AnimatedSpan className="text-green-500">
                ✔ initializing kernel
              </AnimatedSpan>
              <AnimatedSpan className="text-green-500">
                ✔ mounting workspace volume
              </AnimatedSpan>
              <AnimatedSpan className="text-green-500">
                ✔ loading core services
              </AnimatedSpan>
              <AnimatedSpan className="text-green-500">
                ✔ network online
              </AnimatedSpan>
              <AnimatedSpan className="text-green-500">
                ✔ window manager ready
              </AnimatedSpan>
              <TypingAnimation className="text-muted-foreground">
                launching apps: files, editor, terminal
              </TypingAnimation>
              <AnimatedSpan className="text-muted-foreground">
                boot complete — welcome to robin.build
              </AnimatedSpan>
              {/* Name prompt (activates after prior steps) */}
              <TerminalNamePrompt />
            </Terminal>
          </div>
        </div>
      ) : null}

      {/* Desktop section */}
      {launched && bootComplete ? (
        <div className="fixed inset-0 z-10">
          <Desktop name={userName ?? undefined} />
        </div>
      ) : null}
    </div>
  );
}
