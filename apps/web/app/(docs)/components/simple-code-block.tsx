"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Copy, Check, Maximize } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface SimpleCodeBlockProps {
  html: string;
  raw: string;
  title?: string;
  className?: string;
  height?: string;
  showCopy?: boolean;
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
      className=" !border-foreground/20 !border-2 bg-background/95 backdrop-blur-sm"
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

// ExpandButton component
function ExpandButton({ onExpand }: { onExpand: () => void }) {
  return (
    <Button
      onClick={onExpand}
      size="sm"
      variant="outline"
      className=" z-10 !border-foreground/20 !border-2 bg-background/95 backdrop-blur-sm"
      title="Expand to full size"
    >
      <Maximize className="h-3 w-3" />
    </Button>
  );
}

export function SimpleCodeBlock({
  html,
  raw,
  title,
  className,
  height = "min-h-64",
  showCopy = true,
}: SimpleCodeBlockProps) {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(true);
  };

  return (
    <div className={cn("not-prose  max-w-full dark", className)}>
      {title && (
        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
          {title}
        </h4>
      )}

      <ScrollArea
        className={cn(
          "relative overflow-hidden rounded-lg ",
          expanded ? "h-auto max-h-screen" : height,
        )}
      >
        <div className="absolute top-2 right-2 flex gap-2">
          {!expanded && <ExpandButton onExpand={handleExpand} />}
          {showCopy && <CopyButton text={raw} />}
        </div>
        <div className="w-full" dangerouslySetInnerHTML={{ __html: html }} />
      </ScrollArea>
    </div>
  );
}
