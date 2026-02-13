"use client";

import { Dock } from "@/components/ui/dock";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Folder,
  Calculator,
  SunDim,
  Moon,
  StickyNote,
  FileText,
} from "lucide-react";
import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { FilesApp } from "@/components/os/apps/FilesApp";
import CalculatorApp from "@/components/os/apps/CalculatorApp";
import NotesApp from "@/components/os/apps/NotesApp";
import { AppWindow } from "@/components/os/AppWindow";
import StatusBar from "@/components/os/StatusBar";
import { MorphingText } from "@/components/magicui/morphing-text";
import TextReaderApp from "@/components/os/apps/TextReaderApp";
import ImageViewerApp from "@/components/os/apps/ImageViewerApp";
import SnakeApp from "@/components/os/apps/SnakeApp";
import {
  DESKTOP_README_CONTENT,
  DESKTOP_README_FILE_NAME,
  getShortcutIconSrc,
  PROJECT_WEB_SHORTCUTS,
} from "@/lib/desktop-shortcuts";

interface DesktopProps {
  className?: string;
  name?: string;
}

interface DesktopShortcutButtonProps {
  label: string;
  ariaLabel: string;
  icon: ReactNode;
  onClick: () => void;
}

/** Shared desktop shortcut tile so all shortcuts use one visual language. */
function DesktopShortcutButton({
  label,
  ariaLabel,
  icon,
  onClick,
}: DesktopShortcutButtonProps) {
  return (
    <button
      className={cn(
        "group flex w-28 flex-col items-center gap-2 rounded-md p-2",
        "transition-colors hover:bg-foreground/5 focus:outline-none",
      )}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-md",
          "bg-foreground/5 text-foreground transition-colors",
          "group-hover:bg-foreground/10",
        )}
      >
        {icon}
      </div>
      <span className="text-center text-xs leading-4 text-foreground/90">
        {label}
      </span>
    </button>
  );
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
  const [snakeOpen, setSnakeOpen] = useState(false);
  const openSnake = useCallback(() => setSnakeOpen(true), []);
  const closeSnake = useCallback(() => setSnakeOpen(false), []);
  // Z-order management for windows (declare early so callbacks can depend on it)
  const [, setZCounter] = useState(20);
  const [zMap, setZMap] = useState<Record<string, number>>({});
  const bringToFront = useCallback((key: string) => {
    setZCounter((z) => {
      const next = z + 1;
      setZMap((m) => ({ ...m, [key]: next }));
      return next;
    });
  }, []);
  const [textReader, setTextReader] = useState<{
    open: boolean;
    fileName?: string;
    content?: string;
  }>({ open: false });
  const openTextReader = useCallback(
    (payload: { fileName: string; content: string }) => {
      setTextReader({
        open: true,
        fileName: payload.fileName,
        content: payload.content,
      });
      bringToFront("text");
    },
    [bringToFront],
  );
  const closeTextReader = useCallback(() => setTextReader({ open: false }), []);
  const [imageViewer, setImageViewer] = useState<{
    open: boolean;
    fileName?: string;
    src?: string;
  }>({ open: false });
  const openImageViewer = useCallback(
    (payload: { fileName: string; src: string }) => {
      setImageViewer({
        open: true,
        fileName: payload.fileName,
        src: payload.src,
      });
      bringToFront("image");
    },
    [bringToFront],
  );
  const closeImageViewer = useCallback(
    () => setImageViewer({ open: false }),
    [],
  );
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

  useEffect(() => {
    if (filesOpen) bringToFront("files");
  }, [filesOpen, bringToFront]);
  useEffect(() => {
    if (calcOpen) bringToFront("calc");
  }, [calcOpen, bringToFront]);
  useEffect(() => {
    if (notesOpen) bringToFront("notes");
  }, [notesOpen, bringToFront]);
  useEffect(() => {
    if (snakeOpen) bringToFront("snake");
  }, [snakeOpen, bringToFront]);

  /** Opens an external website in a new tab with a strict opener policy. */
  const openExternalUrl = useCallback((href: string) => {
    try {
      window.open(href, "_blank", "noopener,noreferrer");
    } catch {
      window.location.assign(href);
    }
  }, []);

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
      {/* Top-right status bar */}
      <StatusBar />

      {/* Desktop icons */}
      <div className="absolute left-4 top-6 grid gap-4 sm:left-6">
        <DesktopShortcutButton
          label="Files"
          ariaLabel="Files"
          onClick={() => {
            openFiles();
            bringToFront("files");
          }}
          icon={<Folder className="h-6 w-6" />}
        />

        <DesktopShortcutButton
          label="README.md"
          ariaLabel="Open desktop README"
          onClick={() => {
            openTextReader({
              fileName: DESKTOP_README_FILE_NAME,
              content: DESKTOP_README_CONTENT,
            });
            bringToFront("text");
          }}
          icon={<FileText className="h-6 w-6" />}
        />

        {PROJECT_WEB_SHORTCUTS.map((shortcut) => (
          <DesktopShortcutButton
            key={shortcut.id}
            label={shortcut.host}
            ariaLabel={`Open ${shortcut.host}`}
            onClick={() => openExternalUrl(shortcut.href)}
            icon={
              <Image
                src={getShortcutIconSrc(shortcut, isDark)}
                alt={`${shortcut.name} logo`}
                width={48}
                height={48}
                className="h-8 w-8 rounded-[4px] object-contain"
              />
            }
          />
        ))}
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
            <AppWindow
              title="Files"
              onClose={closeFiles}
              onMinimize={closeFiles}
              dragConstraints={desktopRef}
              initialWidth={980}
              initialHeight={600}
            >
              <FilesApp
                onOpenText={openTextReader}
                onOpenImage={openImageViewer}
                onOpenApp={({ appId }) => {
                  if (appId === "calculator") {
                    openCalc();
                    bringToFront("calc");
                  } else if (appId === "notes") {
                    openNotes();
                    bringToFront("notes");
                  } else if (appId === "snake") {
                    openSnake();
                    bringToFront("snake");
                  } else if (appId === "files") {
                    openFiles();
                    bringToFront("files");
                  }
                }}
              />
            </AppWindow>
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
            <AppWindow
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
            </AppWindow>
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
            <AppWindow
              title="Notes"
              onClose={closeNotes}
              onMinimize={closeNotes}
              dragConstraints={desktopRef}
              initialWidth={820}
              initialHeight={560}
            >
              <NotesApp />
            </AppWindow>
          </div>
        </div>
      )}

      {textReader.open && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: (zMap as Record<string, number>)["text"] ?? 20 }}
        >
          <div
            className="pointer-events-auto"
            onPointerDown={() => bringToFront("text")}
          >
            <AppWindow
              title={textReader.fileName ?? "Text Reader"}
              onClose={closeTextReader}
              onMinimize={closeTextReader}
              dragConstraints={desktopRef}
              initialWidth={780}
              initialHeight={520}
            >
              <TextReaderApp
                fileName={textReader.fileName ?? "Untitled.txt"}
                content={textReader.content ?? ""}
              />
            </AppWindow>
          </div>
        </div>
      )}

      {imageViewer.open && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: (zMap as Record<string, number>)["image"] ?? 20 }}
        >
          <div
            className="pointer-events-auto"
            onPointerDown={() => bringToFront("image")}
          >
            <AppWindow
              title={imageViewer.fileName ?? "Image Viewer"}
              onClose={closeImageViewer}
              onMinimize={closeImageViewer}
              dragConstraints={desktopRef}
              initialWidth={720}
              initialHeight={560}
            >
              <ImageViewerApp
                fileName={imageViewer.fileName ?? "image"}
                src={imageViewer.src ?? ""}
              />
            </AppWindow>
          </div>
        </div>
      )}

      {snakeOpen && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ zIndex: (zMap as Record<string, number>)["snake"] ?? 20 }}
        >
          <div
            className="pointer-events-auto"
            onPointerDown={() => bringToFront("snake")}
          >
            <AppWindow
              title="Snake"
              onClose={closeSnake}
              onMinimize={closeSnake}
              dragConstraints={desktopRef}
              initialWidth={520}
              initialHeight={640}
            >
              <SnakeApp />
            </AppWindow>
          </div>
        </div>
      )}
    </div>
  );
}
