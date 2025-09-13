"use client";

import { cn } from "@/lib/utils";
import { TreeNode, TreeView } from "@/components/ui/tree-view";
import {
  Folder,
  FileText,
  Image as ImageIcon,
  HardDrive,
  Home,
  Download,
  AppWindow,
  Clock,
  Cloud,
} from "lucide-react";

interface FilesAppProps {
  className?: string;
}

const sidebarData: TreeNode[] = [
  { id: "recents", label: "Recents", icon: <Clock className="h-4 w-4" /> },
  {
    id: "favorites",
    label: "Favorites",
    children: [
      { id: "desktop", label: "Desktop", icon: <Home className="h-4 w-4" /> },
      {
        id: "applications",
        label: "Applications",
        icon: <AppWindow className="h-4 w-4" />,
      },
      {
        id: "documents",
        label: "Documents",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        id: "downloads",
        label: "Downloads",
        icon: <Download className="h-4 w-4" />,
      },
      {
        id: "images",
        label: "Images",
        icon: <ImageIcon className="h-4 w-4" />,
      },
      {
        id: "code",
        label: "code",
        icon: <Folder className="h-4 w-4" />,
        children: [
          {
            id: "robin-build",
            label: "robin.build",
            icon: <Folder className="h-4 w-4" />,
          },
        ],
      },
    ],
  },
  {
    id: "locations",
    label: "Locations",
    children: [
      {
        id: "icould",
        label: "iCloud Drive",
        icon: <Cloud className="h-4 w-4" />,
      },
      {
        id: "mac-hd",
        label: "Macintosh HD",
        icon: <HardDrive className="h-4 w-4" />,
      },
    ],
  },
];

export function FilesApp({ className }: FilesAppProps) {
  return (
    <div className={cn("flex min-h-0 flex-1", className)}>
      {/* Sidebar */}
      <div className="w-60 shrink-0 border-r border-border/80 p-2">
        <TreeView
          data={sidebarData}
          className="bg-transparent border-0"
          defaultExpandedIds={["favorites", "locations"]}
          showLines={false}
        />
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border/80 px-3 py-2">
          <div className="text-sm font-medium">Recents</div>
          <div className="text-xs text-muted-foreground">
            Sorted by Date Last Opened
          </div>
        </div>
        {/* List */}
        <div className="flex-1 overflow-auto p-2">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <tr className="text-muted-foreground">
                <th className="py-2 pr-2 text-left font-normal">Name</th>
                <th className="py-2 px-2 text-left font-normal">Kind</th>
                <th className="py-2 pl-2 text-left font-normal">
                  Date Last Opened
                </th>
              </tr>
            </thead>
            <tbody>
              {sampleFiles.map((f) => (
                <tr
                  key={f.name}
                  className="border-t border-border/50 hover:bg-accent/40"
                >
                  <td className="py-2 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-4 w-4 items-center justify-center text-muted-foreground">
                        {f.icon}
                      </span>
                      <span>{f.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-muted-foreground">{f.kind}</td>
                  <td className="py-2 pl-2 text-muted-foreground">{f.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Simple icons not exported by lucide directly in small form factors
// All icons use lucide-react; no custom SVGs.

const sampleFiles = [
  {
    name: "design-notes.md",
    kind: "Markdown Document",
    date: "Sep 12, 2025",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    name: "light.png",
    kind: "PNG image",
    date: "Sep 11, 2025",
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    name: "robin.build",
    kind: "Folder",
    date: "Sep 10, 2025",
    icon: <Folder className="h-4 w-4" />,
  },
];
