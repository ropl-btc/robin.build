"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { SlidingNumber } from "@/components/ui/sliding-number";

export default function StatusClock() {
  const [now, setNow] = useState<Date>(new Date());

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
      <Badge variant="secondary" className="font-mono tracking-tight">
        {date}
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
    </div>
  );
}
