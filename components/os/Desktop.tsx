"use client";

import { Dock } from "@/components/ui/dock";
import { cn } from "@/lib/utils";
import { Folder, Calculator, SunDim, Moon, StickyNote } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { FilesApp } from "@/components/os/apps/FilesApp";
import CalculatorApp from "@/components/os/apps/CalculatorApp";
import NotesApp from "@/components/os/apps/NotesApp";
import { Window } from "@/components/os/Window";
import StatusClock from "@/components/os/StatusClock";
import { MorphingText } from "@/components/magicui/morphing-text";

interface DesktopProps {
  className?: string;
  name?: string;
}

export function Desktop({ className, name }: DesktopProps) {
  const [filesOpen, setFilesOpen] = useState(false);
  const openFiles = useCallback(() => setFilesOpen(true), []);
  const closeFiles = useCallback(() => setFilesOpen(false), []);
  const [calcOpen, setCalcOpen] = useState(false);
  const openCalc = useCallback(() => setCalcOpen(true), []);
  const closeCalc = useCallback(() => setCalcOpen(false), []);
  const [notesOpen, setNotesOpen] = useState(false);
  const openNotes = useCallback(() => setNotesOpen(true), []);
  const closeNotes = useCallback(() => setNotesOpen(false), []);
  const desktopRef = useRef<HTMLDivElement | null>(null);
  // Theme toggle for Dock
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    try {
      setIsDark(document.documentElement.classList.contains("dark"));
    } catch {}
  }, []);
  const toggleTheme = useCallback(() => {
    try {
      const dark = document.documentElement.classList.toggle("dark");
      setIsDark(dark);
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  }, []);

  // Time-aware greeting for background morphing text
  const [greeting, setGreeting] = useState<string>("morning");
  useEffect(() => {
    const compute = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "morning";
      if (hour >= 12 && hour < 18) return "afternoon";
      if (hour >= 18 && hour < 22) return "evening";
      return "night";
    };
    setGreeting(compute());
    const id = setInterval(() => setGreeting(compute()), 60_000);
    return () => clearInterval(id);
  }, []);
  const displayName = name ?? "{name}";

  // Z-order management for windows
  const [, setZCounter] = useState(20);
  const [zMap, setZMap] = useState<Record<string, number>>({});
  const bringToFront = useCallback((key: string) => {
    setZCounter((z) => {
      const next = z + 1;
      setZMap((m) => ({ ...m, [key]: next }));
      return next;
    });
  }, []);
  useEffect(() => {
    if (filesOpen) bringToFront("files");
  }, [filesOpen, bringToFront]);
  useEffect(() => {
    if (calcOpen) bringToFront("calc");
  }, [calcOpen, bringToFront]);
  useEffect(() => {
    if (notesOpen) bringToFront("notes");
  }, [notesOpen, bringToFront]);
  return (
    <div
      className={cn("relative min-h-screen w-full select-none", className)}
      ref={desktopRef}
    >
      {/* Subtle morphing greeting in the background */}
      <div className="pointer-events-none absolute inset-0 z-0 grid place-items-center">
        <MorphingText
          texts={["good", greeting, displayName]}
          className="text-foreground font-mono opacity-10"
        />
      </div>
      {/* Top-right status clock */}
      <StatusClock />

      {/* Desktop icons */}
      <div className="absolute left-6 top-6 grid gap-6">
        <button
          className={cn(
            "group flex w-24 flex-col items-center gap-2 rounded-md p-2",
            "transition-colors hover:bg-foreground/5 focus:outline-none",
          )}
          aria-label="Files"
          onClick={() => {
            openFiles();
            bringToFront("files");
          }}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-md",
              "bg-foreground/5 text-foreground",
              "group-hover:bg-foreground/10",
            )}
          >
            <Folder className="h-6 w-6" />
          </div>
          <span className="text-xs text-foreground/90">Files</span>
        </button>
      </div>

      {/* Dock pinned to bottom */}
      <div className="pointer-events-none fixed inset-x-0 bottom-1 z-10">
        <div className="pointer-events-auto flex w-full items-center justify-center">
          <Dock
            compact
            items={[
              {
                icon: Folder,
                label: "Files",
                onClick: () => {
                  openFiles();
                  bringToFront("files");
                },
              },
              {
                icon: Calculator,
                label: "Calculator",
                onClick: () => {
                  openCalc();
                  bringToFront("calc");
                },
              },
              {
                icon: StickyNote,
                label: "Notes",
                onClick: () => {
                  openNotes();
                  bringToFront("notes");
                },
              },
              {
                icon: isDark ? SunDim : Moon,
                label: "Theme",
                onClick: toggleTheme,
              },
            ]}
          />
        </div>
      </div>

      {/* App windows */}
      {filesOpen && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: zMap.files ?? 20 }}
        >
          <div
            className="pointer-events-auto"
            onPointerDown={() => bringToFront("files")}
          >
            <Window
              title="Files — Recents"
              onClose={closeFiles}
              onMinimize={closeFiles}
              dragConstraints={desktopRef}
              initialWidth={980}
              initialHeight={600}
            >
              <FilesApp />
            </Window>
          </div>
        </div>
      )}

      {calcOpen && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: zMap.calc ?? 20 }}
        >
          <div
            className="pointer-events-auto"
            onPointerDown={() => bringToFront("calc")}
          >
            <Window
              title="Calculator"
              onClose={closeCalc}
              onMinimize={closeCalc}
              dragConstraints={desktopRef}
              initialWidth={360}
              initialHeight={610}
              minWidth={280}
              minHeight={360}
              resizable={false}
            >
              <CalculatorApp />
            </Window>
          </div>
        </div>
      )}

      {notesOpen && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: zMap.notes ?? 20 }}
        >
          <div
            className="pointer-events-auto"
            onPointerDown={() => bringToFront("notes")}
          >
            <Window
              title="Notes"
              onClose={closeNotes}
              onMinimize={closeNotes}
              dragConstraints={desktopRef}
              initialWidth={820}
              initialHeight={560}
            >
              <NotesApp />
            </Window>
          </div>
        </div>
      )}
    </div>
  );
}
