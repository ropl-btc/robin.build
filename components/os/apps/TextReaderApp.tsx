"use client";

import { cn } from "@/lib/utils";

interface TextReaderAppProps {
  className?: string;
  fileName: string;
  content: string;
}

export default function TextReaderApp({
  className,
  fileName,
  content,
}: TextReaderAppProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="border-b border-border/80 px-3 py-2 text-sm font-medium">
        {fileName}
      </div>
      <div className="flex-1 overflow-auto p-3">
        <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-6 text-foreground/90">
          {content}
        </pre>
      </div>
    </div>
  );
}
