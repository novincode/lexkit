"use client";

import { useMemo, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { Button } from "@repo/ui/components/button";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { cn } from "@repo/ui/lib/utils";
import { getRawCode, getHighlightedCode } from "@/lib/generated/code-registry";
import { Copy, Check } from "lucide-react";

interface DynamicCodeExampleProps {
  codes: string[];
  title?: string;
  description?: string;
  preview: React.ReactNode;
  className?: string;
  tabs?: string[]; // Optional: array of tab IDs to show (e.g., ['preview', 'component', 'css'])
}

// CopyButton component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      size="sm"
      variant="outline"
      className="absolute top-2 right-2 z-10 !border-foreground/20 !border-2"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copy
        </>
      )}
    </Button>
  );
}

export function DynamicCodeExample({
  codes,
  title,
  description,
  preview,
  className,
  tabs,
}: DynamicCodeExampleProps) {
  const codeData = useMemo(() => {
    const data: Record<string, { raw: string; highlighted: string }> = {};
    codes.forEach((code) => {
      const raw = getRawCode(code);
      const highlighted = getHighlightedCode(code);
      if (raw && highlighted) {
        data[code] = { raw, highlighted };
      }
    });
    return data;
  }, [codes]);

  const filteredTabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
  }> = [];

  // Always add preview tab
  const previewTab = {
    id: "preview",
    label: "Preview",
    content: (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-background p-8">
        <div>{preview}</div>
      </div>
    ),
    alwaysShow: true,
  };

  if (!tabs || tabs.includes("preview")) {
    filteredTabs.push(previewTab);
  }

  // Add code tabs
  codes.forEach((code, index) => {
    const codeInfo = codeData[code];
    if (codeInfo) {
      // Use custom tab label if provided, otherwise extract filename
      const fileName = code.split("/").pop() || code;
      const customLabel = tabs && tabs[index + 1] ? tabs[index + 1] : null;
      const label = customLabel || fileName;

      const tab = {
        id: code, // use the code path as id
        label,
        content: (
          <ScrollArea className="relative h-[80vh] overflow-hidden rounded-lg">
            <div className="">
              <CopyButton text={codeInfo.raw} />
              <div
                className="w-full "
                dangerouslySetInnerHTML={{ __html: codeInfo.highlighted }}
              />
            </div>
          </ScrollArea>
        ),
        alwaysShow: true,
      };

      const customTabName =
        tabs && index + 1 < tabs.length ? tabs[index + 1] : null;
      const shouldShowTab =
        !tabs ||
        tabs.includes(code) ||
        tabs.includes(label.toLowerCase()) ||
        (customTabName && tabs.includes(customTabName));

      if (shouldShowTab) {
        filteredTabs.push(tab);
      }
    }
  });

  return (
    <div className={cn("not-prose my-6", className)}>
      {title && <h4 className="mb-2 text-lg font-semibold">{title}</h4>}

      {description && (
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      )}

      <Tabs defaultValue="preview">
        <TabsList className="inline-flex self-baseline h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-auto overflow-x-auto">
          {filteredTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {filteredTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
