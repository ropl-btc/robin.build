"use client";

import { cn } from "@/lib/utils";

interface ImageViewerAppProps {
  className?: string;
  fileName: string;
  src: string;
}

export default function ImageViewerApp({
  className,
  fileName,
  src,
}: ImageViewerAppProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <div className="border-b border-border/80 px-3 py-2 text-sm font-medium">
        {fileName}
      </div>
      <div className="flex-1 overflow-auto p-3 grid place-items-center">
        {/* biome-ignore lint/performance/noImgElement: This viewer must render arbitrary image sources at their natural size. */}
        <img
          src={src}
          alt={fileName}
          className="max-w-full h-auto rounded-md border border-border/70 shadow-sm"
        />
      </div>
    </div>
  );
}
