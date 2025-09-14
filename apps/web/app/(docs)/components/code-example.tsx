"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { cn } from "@repo/ui/lib/utils";

interface CodeExampleTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface CodeExampleProps {
  title?: string;
  preview: React.ReactNode;
  tabs?: CodeExampleTab[];
  className?: string;
}

export function CodeExample({
  title,
  preview,
  tabs = [],
  className,
}: CodeExampleProps) {
  // Default tabs
  const defaultTabs: CodeExampleTab[] = [
    {
      id: "preview",
      label: "Preview",
      content: (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-background p-8">
          {preview}
        </div>
      ),
    },
  ];

  // Combine default tabs with custom tabs
  const allTabs = [...defaultTabs, ...tabs];

  return (
    <div className={cn("not-prose my-6", className)}>
      {title && <h4 className="mb-4 text-lg font-semibold">{title}</h4>}

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-auto overflow-x-auto">
          {allTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {allTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
