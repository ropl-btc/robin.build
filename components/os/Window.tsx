"use client";

import { cn } from "@/lib/utils";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { useId, useRef, useState } from "react";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  /** Pass a ref to constrain dragging within this element. Optional. */
  dragConstraints?: React.RefObject<HTMLElement | null> | false;
  /** Initial top offset in pixels. */
  top?: number;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  /** Enable window edge/corner resizing. Default: true */
  resizable?: boolean;
}

export function Window({
  title,
  children,
  className,
  bodyClassName,
  onClose,
  onMinimize,
  dragConstraints,
  top = 64,
  initialWidth = 960,
  initialHeight = 560,
  minWidth = 640,
  minHeight = 420,
  resizable = true,
}: WindowProps) {
  const controls = useDragControls();
  const labelId = useId();
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [maximized, setMaximized] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const resizingRef = useRef<null | {
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    edge: "right" | "bottom" | "corner";
  }>(null);

  const startResize = (
    edge: "right" | "bottom" | "corner",
    e: React.PointerEvent
  ) => {
    if (maximized) return;
    e.preventDefault();
    resizingRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: size.width,
      startH: size.height,
      edge,
    };

    const onMove = (ev: PointerEvent) => {
      const r = resizingRef.current;
      if (!r) return;
      const dx = ev.clientX - r.startX;
      const dy = ev.clientY - r.startY;
      let w = r.startW;
      let h = r.startH;
      if (r.edge === "right" || r.edge === "corner")
        w = Math.max(minWidth, r.startW + dx);
      if (r.edge === "bottom" || r.edge === "corner")
        h = Math.max(minHeight, r.startH + dy);
      setSize({ width: w, height: h });
    };
    const onUp = () => {
      resizingRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  };

  return (
    <motion.div
      role="dialog"
      aria-labelledby={labelId}
      className={cn(
        "mx-auto rounded-2xl border border-border bg-background shadow-xl overflow-hidden",
        "fixed",
        maximized
          ? "inset-0 left-0 top-0 w-screen h-screen"
          : "left-1/2 -translate-x-1/2",
        className
      )}
      style={
        maximized
          ? { x, y }
          : { top, width: size.width, height: size.height, x, y }
      }
      drag={!maximized}
      dragListener={false}
      dragControls={controls}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={dragConstraints ?? undefined}
    >
      {/* Titlebar / Drag handle */}
      <div
        className={cn(
          "relative flex items-center gap-2 border-b border-border px-4",
          "h-10 select-none",
          maximized ? "cursor-default" : "cursor-move"
        )}
        onPointerDown={(e) => (!maximized ? controls.start(e) : undefined)}
      >
        <div className="flex items-center gap-2 pr-2">
          <button
            aria-label="Close"
            onClick={onClose}
            className="h-2.5 w-2.5 rounded-full bg-red-500"
          />
          <button
            aria-label="Minimize"
            onClick={onMinimize}
            className="h-2.5 w-2.5 rounded-full bg-yellow-500"
          />
          <button
            aria-label="Toggle Fullscreen"
            onClick={() => {
              // Reset any drag offsets so maximized window anchors to viewport
              x.set(0);
              y.set(0);
              setMaximized((v) => !v);
            }}
            className="h-2.5 w-2.5 rounded-full bg-green-500"
          />
        </div>
        <div
          id={labelId}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-medium text-center"
        >
          {title}
        </div>
      </div>

      {/* Body */}
      <div
        className={cn(
          "flex h-full min-h-0 flex-col overflow-hidden",
          bodyClassName
        )}
      >
        {children}
      </div>

      {/* Resize handles (disabled when maximized or not resizable) */}
      {!maximized && resizable && (
        <>
          <div
            className="absolute right-0 top-10 bottom-0 w-2 cursor-ew-resize touch-none select-none"
            onPointerDown={(e) => startResize("right", e)}
          />
          <div
            className="absolute left-0 right-0 bottom-0 h-2 cursor-ns-resize touch-none select-none"
            onPointerDown={(e) => startResize("bottom", e)}
          />
          <div
            className="absolute bottom-0 right-0 h-3 w-3 cursor-nwse-resize touch-none select-none"
            onPointerDown={(e) => startResize("corner", e)}
          />
        </>
      )}
    </motion.div>
  );
}
