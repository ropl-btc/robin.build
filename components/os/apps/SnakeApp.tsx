"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SnakeAppProps {
  className?: string;
}

type Point = { x: number; y: number };
type Direction = "up" | "down" | "left" | "right";

const BOARD_SIZE = 20; // 20x20
const CELL = 20; // px
const INITIAL_SPEED_MS = 140;

function randomFood(exclude: Point[]): Point {
  // Avoid placing food on the snake
  while (true) {
    const p = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
    if (!exclude.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
}

export default function SnakeApp({ className }: SnakeAppProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState<Point[]>([
    { x: 9, y: 10 },
    { x: 8, y: 10 },
    { x: 7, y: 10 },
  ]);
  const [dir, setDir] = useState<Direction>("right");
  const [queuedDir, setQueuedDir] = useState<Direction>("right");
  const [food, setFood] = useState<Point>(() =>
    randomFood([
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 },
    ]),
  );
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const [speedMs, setSpeedMs] = useState(INITIAL_SPEED_MS);

  // Direction change handler (prevents reversing into itself)
  const queueDirection = useCallback(
    (next: Direction) => {
      setQueuedDir((prevQueued) => {
        const current = dir; // closed over per render; acceptable for simple game
        if (
          (current === "up" && next === "down") ||
          (current === "down" && next === "up") ||
          (current === "left" && next === "right") ||
          (current === "right" && next === "left")
        ) {
          return prevQueued;
        }
        return next;
      });
    },
    [dir],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          queueDirection("up");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          queueDirection("down");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          queueDirection("left");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          queueDirection("right");
          break;
        case " ":
          setRunning((r) => !r);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [queueDirection]);

  // Game loop
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setDir(queuedDir);
      setSnake((prev) => {
        const head = prev[0];
        let nx = head.x;
        let ny = head.y;
        if (queuedDir === "up") ny -= 1;
        if (queuedDir === "down") ny += 1;
        if (queuedDir === "left") nx -= 1;
        if (queuedDir === "right") nx += 1;

        // Wrap around edges
        if (nx < 0) nx = BOARD_SIZE - 1;
        if (ny < 0) ny = BOARD_SIZE - 1;
        if (nx >= BOARD_SIZE) nx = 0;
        if (ny >= BOARD_SIZE) ny = 0;

        const newHead = { x: nx, y: ny };
        // Collision with self
        if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setRunning(false);
          return prev;
        }

        const ate = newHead.x === food.x && newHead.y === food.y;
        const nextSnake = [newHead, ...prev];
        if (!ate) {
          nextSnake.pop();
        } else {
          setScore((s) => s + 1);
          setFood(randomFood(nextSnake));
          setSpeedMs((ms) => Math.max(60, Math.floor(ms * 0.96)));
        }
        return nextSnake;
      });
    }, speedMs);
    return () => clearInterval(id);
  }, [queuedDir, running, speedMs, food]);

  // Draw
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    // Background
    ctx.fillStyle =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim() || "#0b0b0b";
    ctx.fillRect(0, 0, c.width, c.height);
    // Grid subtle
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    for (let i = 0; i <= BOARD_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, BOARD_SIZE * CELL);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(BOARD_SIZE * CELL, i * CELL);
      ctx.stroke();
    }
    // Food
    ctx.fillStyle = "#22c55e"; // green
    ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
    // Snake
    ctx.fillStyle = "#60a5fa"; // blue
    snake.forEach((s, idx) => {
      const r = idx === 0 ? 3 : 2;
      ctx.fillRect(s.x * CELL + r, s.y * CELL + r, CELL - r * 2, CELL - r * 2);
    });
  }, [snake, food]);

  const restart = useCallback(() => {
    setSnake([
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 },
    ]);
    setDir("right");
    setQueuedDir("right");
    setFood(
      randomFood([
        { x: 9, y: 10 },
        { x: 8, y: 10 },
        { x: 7, y: 10 },
      ]),
    );
    setScore(0);
    setSpeedMs(INITIAL_SPEED_MS);
    setRunning(true);
  }, []);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="flex items-center justify-between border-b border-border/80 px-3 py-2 text-sm">
        <div className="font-medium">Score: {score}</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Arrows / WASD</span>
          <span>•</span>
          <span>Space: Pause</span>
          <button
            type="button"
            className="ml-2 rounded-md border border-border/70 px-2 py-0.5 text-xs hover:bg-foreground/10"
            onClick={restart}
          >
            Restart
          </button>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-3">
        <canvas
          ref={canvasRef}
          width={BOARD_SIZE * CELL}
          height={BOARD_SIZE * CELL}
          className="rounded-lg border border-border/70 shadow-sm"
        />
      </div>
      {!running && (
        <div className="pb-3 text-center text-sm text-muted-foreground">
          Game over. Press Restart to play again.
        </div>
      )}
    </div>
  );
}
