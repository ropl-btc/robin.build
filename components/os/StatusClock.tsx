"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SlidingNumber } from "@/components/ui/sliding-number";
import { Calendar } from "@/components/ui/calendar";
import { Power } from "lucide-react";

export default function StatusClock() {
  const [now, setNow] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours24 = now.getHours();
  const hours12 = ((hours24 + 11) % 12) + 1; // 1-12
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours24 >= 12 ? "PM" : "AM";

  const date = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
  }).format(now);

  return (
    <div className="pointer-events-none absolute right-3 top-2 z-10 flex items-center gap-2">
      <Badge
        asChild
        variant="secondary"
        className="font-mono tracking-tight pointer-events-auto cursor-pointer select-none"
      >
        <button type="button" onClick={() => setCalendarOpen((v) => !v)}>
          {date}
        </button>
      </Badge>
      <Badge variant="secondary" className="font-mono tracking-tight">
        <span className="flex items-center gap-1 tabular-nums">
          <SlidingNumber value={hours12} padStart />
          <span>:</span>
          <SlidingNumber value={minutes} padStart />
          <span>:</span>
          <SlidingNumber value={seconds} padStart />
          <span className="ml-1 text-muted-foreground">{ampm}</span>
        </span>
      </Badge>
      {/* Power button: hard navigate to landing to reset state */}
      <button
        type="button"
        aria-label="Go to home"
        onClick={() => {
          try {
            window.location.assign("/");
          } catch {
            // Fallback
            window.location.href = "/";
          }
        }}
        className="pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/70 text-foreground shadow-sm transition-colors hover:bg-foreground/10"
      >
        <Power className="h-4 w-4" />
      </button>
      {calendarOpen ? (
        <div
          className="pointer-events-auto fixed inset-0 z-20"
          onClick={() => setCalendarOpen(false)}
        >
          <div
            className="absolute right-2 top-10 rounded-xl border border-border bg-background p-2 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Calendar
              mode="single"
              selected={now}
              initialFocus
              classNames={{
                day_button:
                  "pointer-events-none cursor-default group-data-[selected]:rounded-full hover:rounded-full group-[.range-start]:rounded-full group-[.range-end]:rounded-full group-[.range-middle]:rounded-full",
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
