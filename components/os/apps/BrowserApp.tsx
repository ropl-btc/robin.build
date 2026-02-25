"use client";

import {
  ArrowLeft,
  ArrowRight,
  Compass,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface BrowserAppProps {
  className?: string;
  initialUrl?: string;
}

interface BrowserHistoryState {
  entries: string[];
  index: number;
}

const DEFAULT_HOME_URL = "https://robin.build";
const SECURE_PROTOCOL_PREFIX = "https://";

/**
 * Normalizes user-entered browser input into an absolute HTTP(S) URL.
 */
function normalizeBrowserUrl(rawValue: string): string | null {
  const trimmedValue = rawValue.trim();
  if (!trimmedValue) return null;

  const maybeAbsoluteUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmedValue)
    ? trimmedValue
    : `${SECURE_PROTOCOL_PREFIX}${trimmedValue}`;

  try {
    const parsedUrl = new URL(maybeAbsoluteUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }
    return parsedUrl.toString();
  } catch {
    return null;
  }
}

/**
 * Lightweight in-OS browser with history controls and URL entry.
 */
export default function BrowserApp({ className, initialUrl }: BrowserAppProps) {
  const firstUrl = useMemo(() => {
    return (
      normalizeBrowserUrl(initialUrl ?? DEFAULT_HOME_URL) ?? DEFAULT_HOME_URL
    );
  }, [initialUrl]);
  const [historyState, setHistoryState] = useState<BrowserHistoryState>(() => ({
    entries: [firstUrl],
    index: 0,
  }));
  const currentUrl = historyState.entries[historyState.index] ?? firstUrl;
  const [addressValue, setAddressValue] = useState(currentUrl);
  const [validationMessage, setValidationMessage] = useState("");
  const [reloadTick, setReloadTick] = useState(0);

  useEffect(() => {
    setAddressValue(currentUrl);
  }, [currentUrl]);

  useEffect(() => {
    const normalizedIncomingUrl =
      normalizeBrowserUrl(initialUrl ?? DEFAULT_HOME_URL) ?? DEFAULT_HOME_URL;

    setHistoryState((previousState) => {
      const visibleHistory = previousState.entries.slice(
        0,
        previousState.index + 1,
      );
      if (visibleHistory[previousState.index] === normalizedIncomingUrl) {
        return previousState;
      }
      return {
        entries: [...visibleHistory, normalizedIncomingUrl],
        index: visibleHistory.length,
      };
    });
    setValidationMessage("");
  }, [initialUrl]);

  const navigateToAddress = useCallback((rawValue: string) => {
    const normalizedUrl = normalizeBrowserUrl(rawValue);
    if (!normalizedUrl) {
      setValidationMessage("Enter a valid http(s) URL.");
      return;
    }

    setValidationMessage("");
    setHistoryState((previousState) => {
      const visibleHistory = previousState.entries.slice(
        0,
        previousState.index + 1,
      );
      if (visibleHistory[previousState.index] === normalizedUrl) {
        return previousState;
      }
      return {
        entries: [...visibleHistory, normalizedUrl],
        index: visibleHistory.length,
      };
    });
  }, []);

  const canGoBack = historyState.index > 0;
  const canGoForward = historyState.index < historyState.entries.length - 1;

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="border-b border-border/80 px-2 py-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => {
              if (!canGoBack) return;
              setHistoryState((previousState) => ({
                ...previousState,
                index: Math.max(0, previousState.index - 1),
              }));
              setValidationMessage("");
            }}
            disabled={!canGoBack}
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => {
              if (!canGoForward) return;
              setHistoryState((previousState) => ({
                ...previousState,
                index: Math.min(
                  previousState.entries.length - 1,
                  previousState.index + 1,
                ),
              }));
              setValidationMessage("");
            }}
            disabled={!canGoForward}
            aria-label="Forward"
          >
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
            onClick={() => setReloadTick((count) => count + 1)}
            aria-label="Reload"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <form
            className="flex min-w-0 flex-1 items-center gap-1.5"
            onSubmit={(event) => {
              event.preventDefault();
              navigateToAddress(addressValue);
            }}
          >
            <label htmlFor="browser-address" className="sr-only">
              URL
            </label>
            <div className="relative min-w-0 flex-1">
              <Compass className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="browser-address"
                type="text"
                value={addressValue}
                onChange={(event) => setAddressValue(event.target.value)}
                className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-2 text-xs text-foreground outline-none ring-0 placeholder:text-muted-foreground/80 focus:border-border focus-visible:ring-2 focus-visible:ring-ring/40"
                placeholder="Enter website URL"
                spellCheck={false}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-8 items-center rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              Go
            </button>
          </form>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-accent"
            onClick={() => {
              window.open(currentUrl, "_blank", "noopener,noreferrer");
            }}
            aria-label="Open in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
        {validationMessage ? (
          <p className="mt-1 text-[11px] text-destructive">
            {validationMessage}
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-muted-foreground">
            Some websites block iframe embedding. Use the external button if
            needed.
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 bg-background">
        <iframe
          key={`${currentUrl}-${reloadTick}`}
          src={currentUrl}
          title={`Browser preview for ${currentUrl}`}
          className="h-full w-full border-0"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
