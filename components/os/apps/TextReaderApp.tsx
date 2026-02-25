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
      <div className="border-b border-border/80 px-2.5 py-1.5 text-xs font-medium md:px-3 md:py-2 md:text-sm">
        {fileName}
      </div>
      <div className="flex-1 overflow-auto p-2 md:p-3">
        <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-foreground/90 md:text-sm md:leading-6">
          {content}
        </pre>
      </div>
    </div>
  );
}
