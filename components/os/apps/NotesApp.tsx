"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Toolbar } from "@/components/ui/toolbar";

interface NotesAppProps {
  className?: string;
}

export default function NotesApp({ className }: NotesAppProps) {
  const [title, setTitle] = useState("Untitled");
  const [body, setBody] = useState("");
  const editorRef = useRef<HTMLTextAreaElement | null>(null);

  // Load / Save to localStorage (simple single-note persistence)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("notesApp.note");
      if (raw) {
        const parsed = JSON.parse(raw);
        setTitle(parsed.title ?? "Untitled");
        setBody(parsed.body ?? "");
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("notesApp.note", JSON.stringify({ title, body }));
    } catch {}
  }, [title, body]);

  return (
    <div className={cn("flex h-full min-h-0", className)}>
      {/* Sidebar (placeholder for future multi-note list) */}
      <div className="w-56 shrink-0 border-r border-border/80 p-3 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={cn(
            "w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm font-medium",
            "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20",
          )}
        />
        <div className="text-xs text-muted-foreground">
          A simple single note. More coming soon.
        </div>
      </div>

      {/* Editor */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Toolbar pinned at top */}
        <div className="relative border-b border-border/80 py-2">
          <div className="relative h-12">
            <Toolbar />
          </div>
        </div>
        {/* Textarea */}
        <div className="flex-1 overflow-auto p-3">
          <Textarea
            ref={editorRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your note..."
            className="min-h-[400px] h-full resize-none text-base leading-6"
          />
        </div>
      </div>
    </div>
  );
}
