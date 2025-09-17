"use client";

import React, { useState, useEffect, useMemo, useRef, forwardRef, useCallback, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import {
  boldExtension,
  italicExtension,
  underlineExtension,
  strikethroughExtension,
  linkExtension,
  horizontalRuleExtension,
  TableExtension,
  listExtension,
  historyExtension,
  imageExtension,
  blockFormatExtension,
  htmlExtension,
  MarkdownExtension,
  codeExtension,
  codeFormatExtension,
} from "@lexkit/editor/extensions";
import {
  commandPaletteExtension,
  floatingToolbarExtension,
  contextMenuExtension,
  DraggableBlockExtension,
} from "@lexkit/editor/extensions/core";
import { HTMLEmbedExtension } from "@lexkit/editor/extensions/media";
import { ALL_MARKDOWN_TRANSFORMERS } from "@lexkit/editor/extensions/export/transformers";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalEditor } from "lexical";
import { createEditorSystem } from "@lexkit/editor";
import type {
  ExtractCommands,
  ExtractStateQueries,
  BaseCommands,
} from "@lexkit/editor/extensions/types";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Link as LinkIcon,
  Unlink,
  Minus,
  Code,
  Terminal,
  Table as TableIcon,
  FileCode,
  Eye,
  Pencil,
  Command as CommandIcon,
  Type,
  Quote,
  FileText,
  Hash,
  X,
  CloudUpload,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { Toggle } from "@repo/ui/components/toggle";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@repo/ui/components/command";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@repo/ui/components/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/select";
import { Separator } from "@repo/ui/components/separator";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/components/dropdown-menu";
import { Switch } from "@repo/ui/components/switch";
import { Dialog as ShadcnDialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@repo/ui/components/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@repo/ui/components/collapsible";
import { Textarea } from "@repo/ui/components/textarea";
import {
  commandsToCommandPaletteItems,
  registerKeyboardShortcuts,
} from "./commands";
import { shadcnTheme } from "./theme";
import { cn } from "@repo/ui/lib/utils";
import "./shadcn-styles.css";

// Editor Mode Types
type EditorMode = "visual" | "html" | "markdown";

// Table Config Type
type TableConfig = {
  rows: number;
  columns: number;
  includeHeaders: boolean;
};

// Ref interface for parent control
export interface ShadcnTemplateRef {
  injectMarkdown: (content: string) => void;
  injectHTML: (content: string) => void;
  getMarkdown: () => string;
  getHTML: () => string;
}

// Custom Shadcn-styled context menu renderer
function ShadcnContextMenuRenderer(props: {
  items: any[];
  position: { x: number; y: number };
  onClose: () => void;
  className: string;
  style?: React.CSSProperties;
  itemClassName: string;
  itemStyle?: React.CSSProperties;
  disabledItemClassName: string;
  disabledItemStyle?: React.CSSProperties;
}) {
  const { items, position, onClose } = props;

  return createPortal(
    <div
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        props.className
      )}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
        ...props.style,
      }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item: any, index: number) => (
        <div
          key={index}
          className={cn(
            "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            item.disabled ? props.disabledItemClassName : props.itemClassName
          )}
          style={item.disabled ? props.disabledItemStyle : props.itemStyle}
          onClick={() => {
            if (!item.disabled && item.action) {
              item.action();
              onClose();
            }
          }}
        >
          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
          {item.label}
        </div>
      ))}
    </div>,
    document.body
  );
}

// Create custom Shadcn context menu extension
const shadcnContextMenuExtension = contextMenuExtension.configure({
  defaultRenderer: ShadcnContextMenuRenderer,
  preventDefault: true, // Explicitly prevent default browser context menu
  theme: {
    container: "lexkit-context-menu z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
    item: "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
    itemDisabled: "opacity-50 cursor-not-allowed pointer-events-none"
  }
});

// Create markdown extension instance for this template
const markdownExt = new MarkdownExtension().configure({
  customTransformers: ALL_MARKDOWN_TRANSFORMERS,
});

// Create table extension instance
const tableExt = new TableExtension().configure({
  enableContextMenu: true,
  contextMenuExtension: shadcnContextMenuExtension,
  markdownExtension: markdownExt,
});

// Extensions array
export const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  strikethroughExtension,
  linkExtension.configure({
    linkSelectedTextOnPaste: true,
    autoLinkText: true,
    autoLinkUrls: true,
  }),
  horizontalRuleExtension,
  tableExt,
  listExtension,
  historyExtension,
  imageExtension,
  blockFormatExtension,
  htmlExtension,
  markdownExt,
  codeExtension,
  codeFormatExtension,
  new HTMLEmbedExtension().configure({
    toggleRenderer: ({ isPreview, onClick, className, style }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        style={style}
      >
        {isPreview ? (
          <>
            <FileCode className="w-4 h-4 mr-2" />
            Edit HTML
          </>
        ) : (
          <>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </>
        )}
      </Button>
    ),
    markdownExtension: markdownExt,
  }),
  floatingToolbarExtension,
  commandPaletteExtension,
  shadcnContextMenuExtension,
  new DraggableBlockExtension().configure({ // Create fresh instance to avoid caching issues when switching templates
    buttonStackPosition: "right",
  }),
] as const;

// Create a typed editor system for these specific extensions
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// Extract the types for our specific extensions
type EditorCommands = BaseCommands & ExtractCommands<typeof extensions>;
type EditorStateQueries = ExtractStateQueries<typeof extensions>;
type ExtensionNames = (typeof extensions)[number]["name"];

// Custom hook for image handling
function useImageHandlers(commands: EditorCommands, editor: LexicalEditor | null) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlers = useMemo(
    () => ({
      insertImageFromUrl: (url: string, alt = "", caption?: string) => {
        commands.insertImage({ src: url, alt, caption });
      },

      insertImageFromFile: async (file: File, alt = "", caption?: string) => {
        if (imageExtension.config.uploadHandler) {
          try {
            const src = await imageExtension.config.uploadHandler(file);
            commands.insertImage({ src, alt: alt || file.name, caption, file });
          } catch (error) {
            console.error("Failed to upload image:", error);
            // Fallback to object URL
            const src = URL.createObjectURL(file);
            commands.insertImage({ src, alt: alt || file.name, caption, file });
          }
        } else {
          const src = URL.createObjectURL(file);
          commands.insertImage({ src, alt: alt || file.name, caption, file });
        }
      },

      setImageAlignment: (alignment: "left" | "center" | "right" | "none") => {
        commands.setImageAlignment(alignment);
      },

      setImageCaption: (caption: string) => {
        commands.setImageCaption(caption);
      },
    }),
    [commands],
  );

  return { handlers, fileInputRef };
}

// Link Dialog Component
function LinkDialog({
  isOpen,
  onOpenChange,
  initialUrl = "",
  onSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialUrl?: string;
  onSubmit: (data: { url: string }) => void;
}) {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
    }
  }, [isOpen, initialUrl]);

  const handleSubmit = () => {
    if (url.trim()) {
      onSubmit({ url: url.trim() });
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <ShadcnDialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            <DialogTitle>Insert Link</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!url.trim()}>
              Insert Link
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </ShadcnDialog>
  );
}

// Image Dialog Component
function ImageDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    activeTab: "upload" | "url";
    url: string;
    alt: string;
    caption: string;
    file: File | null;
  }) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab("upload");
      setUrl("");
      setAlt("");
      setCaption("");
      setFile(null);
      setDragOver(false);
      setShowAdvanced(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    onSubmit({ activeTab, url, alt, caption, file });
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (activeTab === "url" ? url.trim() : file)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0]) {
      setFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      setFile(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Check if we have valid content to show advanced options
  const hasValidContent = activeTab === "upload" ? !!file : !!url.trim();

  return (
    <ShadcnDialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            <DialogTitle>Insert Image</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "upload" | "url")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Upload Image</Label>
                {!file ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                      dragOver
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CloudUpload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop an image here, or click to select
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: JPG, PNG, GIF, WebP (max 10MB)
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded border overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </TabsContent>

            {/* Advanced Options - only show when we have valid content */}
            {hasValidContent && (
              <Collapsible
                open={showAdvanced}
                onOpenChange={setShowAdvanced}
                className="mt-4"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-between p-2 h-auto"
                  >
                    <span className="text-sm font-medium">Advanced Options</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showAdvanced ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-alt">Alt Text (optional)</Label>
                    <Input
                      id="image-alt"
                      placeholder="Describe the image for accessibility"
                      value={alt}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAlt(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-caption">Caption (optional)</Label>
                    <Input
                      id="image-caption"
                      placeholder="Image caption"
                      value={caption}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCaption(e.target.value)}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </Tabs>
        </div>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={activeTab === "upload" ? !file : !url.trim()}
            >
              Insert Image
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </ShadcnDialog>
  );
}

// Floating Toolbar Component
function FloatingToolbarRenderer({
  openLinkDialog,
}: {
  openLinkDialog: (options?: { initialUrl?: string }) => void;
}) {
  const { commands, activeStates, extensions, hasExtension } = useEditor();
  const [isVisible, setIsVisible] = useState(false);
  const [selectionRect, setSelectionRect] = useState<any>(null);

  const floatingExtension = extensions.find(
    (ext) => ext.name === "floatingToolbar",
  ) as any;

  useEffect(() => {
    if (!floatingExtension) return;

    const checkState = () => {
      const visible = floatingExtension.getIsVisible();
      const rect = floatingExtension.getSelectionRect();
      setIsVisible(visible);
      setSelectionRect(rect);
    };

    const interval = setInterval(checkState, 200);
    return () => clearInterval(interval);
  }, [floatingExtension]);

  if (!isVisible || !selectionRect) return null;

  const isImageSelected = activeStates.imageSelected;

  return createPortal(
    <TooltipProvider>
      <div
        className="flex items-center gap-1 p-2 bg-background border border-border rounded-lg shadow-lg"
        style={{
          position: "absolute",
          top: selectionRect.y,
          ...(selectionRect.positionFromRight
            ? { right: 10, left: "auto" }
            : { left: selectionRect.x, right: "auto" }),
          zIndex: 50,
          pointerEvents: "auto",
        }}
      >
        {isImageSelected ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.isImageAlignedLeft ? "pressed" : "default"}
                  pressed={activeStates.isImageAlignedLeft}
                  onPressedChange={() => commands.setImageAlignment("left")}
                >
                  <AlignLeft className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Align Left</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.isImageAlignedCenter ? "pressed" : "default"}
                  pressed={activeStates.isImageAlignedCenter}
                  onPressedChange={() => commands.setImageAlignment("center")}
                >
                  <AlignCenter className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Align Center</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.isImageAlignedRight ? "pressed" : "default"}
                  pressed={activeStates.isImageAlignedRight}
                  onPressedChange={() => commands.setImageAlignment("right")}
                >
                  <AlignRight className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Align Right</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    const caption = prompt("Enter caption:") || "";
                    commands.setImageCaption(caption);
                  }}
                >
                  <Type className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Caption</TooltipContent>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.bold ? "pressed" : "default"}
                  pressed={activeStates.bold}
                  onPressedChange={() => commands.toggleBold()}
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.italic ? "pressed" : "default"}
                  pressed={activeStates.italic}
                  onPressedChange={() => commands.toggleItalic()}
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.underline ? "pressed" : "default"}
                  pressed={activeStates.underline}
                  onPressedChange={() => commands.toggleUnderline()}
                >
                  <Underline className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Underline</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.strikethrough ? "pressed" : "default"}
                  pressed={activeStates.strikethrough}
                  onPressedChange={() => commands.toggleStrikethrough()}
                >
                  <Strikethrough className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Strikethrough</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.code ? "pressed" : "default"}
                  pressed={activeStates.code}
                  onPressedChange={() => commands.formatText("code")}
                >
                  <Code className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Inline Code</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.isLink ? "pressed" : "default"}
                  pressed={activeStates.isLink}
                  disabled={!activeStates.isTextSelected && !activeStates.isLink}
                  onPressedChange={() => {
                    if (activeStates.isLink) {
                      commands.removeLink();
                    } else if (activeStates.isTextSelected) {
                      openLinkDialog({});
                    }
                  }}
                >
                  {activeStates.isLink ? (
                    <Unlink className="h-4 w-4" />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                {activeStates.isLink ? "Remove Link" : "Add Link"}
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            {hasExtension("list") && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      size="sm"
                      pressed={activeStates.unorderedList}
                      onPressedChange={() => commands.toggleUnorderedList()}
                    >
                      <List className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Bullet List</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      size="sm"
                      pressed={activeStates.orderedList}
                      onPressedChange={() => commands.toggleOrderedList()}
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Toggle>
                  </TooltipTrigger>
                  <TooltipContent>Numbered List</TooltipContent>
                </Tooltip>
              </>
            )}
          </>
        )}
      </div>
    </TooltipProvider>,
    document.body
  );
}

// Toolbar Component
function Toolbar({
  commands,
  hasExtension,
  activeStates,
  onCommandPaletteOpen,
  openLinkDialog,
  openImageDialog,
}: {
  commands: EditorCommands;
  hasExtension: (name: ExtensionNames) => boolean;
  activeStates: EditorStateQueries;
  onCommandPaletteOpen: () => void;
  openLinkDialog: (options?: { initialUrl?: string }) => void;
  openImageDialog: () => void;
}) {
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [tableConfig, setTableConfig] = useState<TableConfig>({
    rows: 3,
    columns: 3,
    includeHeaders: false,
  });

  const blockFormatOptions = [
    { value: "p", label: "Paragraph", icon: <FileText className="h-4 w-4" /> },
    { value: "h1", label: "Heading 1", icon: <Hash className="h-4 w-4" /> },
    { value: "h2", label: "Heading 2", icon: <Hash className="h-4 w-4" /> },
    { value: "h3", label: "Heading 3", icon: <Hash className="h-4 w-4" /> },
    { value: "quote", label: "Quote", icon: <Quote className="h-4 w-4" /> },
  ];

  const currentBlockFormat = activeStates.isH1
    ? "h1"
    : activeStates.isH2
      ? "h2"
      : activeStates.isH3
        ? "h3"
        : activeStates.isQuote
          ? "quote"
          : "p";

  const handleBlockFormatChange = (value: string) => {
    if (value === "p") commands.toggleParagraph();
    else if (value.startsWith("h")) commands.toggleHeading(value as "h1" | "h2" | "h3");
    else if (value === "quote") commands.toggleQuote();
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2 p-2 bg-transparent">
        {/* Text Formatting Section */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                variant={activeStates.bold ? "pressed" : "default"}
                pressed={activeStates.bold}
                onPressedChange={() => commands.toggleBold()}
              >
                <Bold className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold (Ctrl+B)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                variant={activeStates.italic ? "pressed" : "default"}
                pressed={activeStates.italic}
                onPressedChange={() => commands.toggleItalic()}
              >
                <Italic className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic (Ctrl+I)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                variant={activeStates.underline ? "pressed" : "default"}
                pressed={activeStates.underline}
                onPressedChange={() => commands.toggleUnderline()}
              >
                <Underline className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Underline (Ctrl+U)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                variant={activeStates.strikethrough ? "pressed" : "default"}
                pressed={activeStates.strikethrough}
                onPressedChange={() => commands.toggleStrikethrough()}
              >
                <Strikethrough className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strikethrough</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                variant={activeStates.code ? "pressed" : "default"}
                pressed={activeStates.code}
                onPressedChange={() => commands.formatText("code")}
              >
                <Code className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Inline Code</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                variant={activeStates.isLink ? "pressed" : "default"}
                pressed={activeStates.isLink}
                disabled={!activeStates.isTextSelected && !activeStates.isLink}
                onPressedChange={() => {
                  if (activeStates.isLink) {
                    commands.removeLink();
                  } else {
                    openLinkDialog({});
                  }
                }}
              >
                {activeStates.isLink ? (
                  <Unlink className="h-4 w-4" />
                ) : (
                  <LinkIcon className="h-4 w-4" />
                )}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              {activeStates.isLink ? "Remove Link" : "Insert Link"}
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Block Format Section */}
        {hasExtension("blockFormat") && (
          <div className="flex items-center gap-1">
            <Select
              value={currentBlockFormat}
              onValueChange={handleBlockFormatChange}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                </TooltipTrigger>
                <TooltipContent>Text Format</TooltipContent>
              </Tooltip>
              <SelectContent>
                {blockFormatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* Lists Section */}
        {hasExtension("list") && (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.unorderedList ? "pressed" : "default"}
                  pressed={activeStates.unorderedList}
                  onPressedChange={() => commands.toggleUnorderedList()}
                >
                  <List className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.orderedList ? "pressed" : "default"}
                  pressed={activeStates.orderedList}
                  onPressedChange={() => commands.toggleOrderedList()}
                >
                  <ListOrdered className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>
          </div>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* Media & Content Section */}
        <div className="flex items-center gap-1">
          {/* Image Insert */}
          {hasExtension("image") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="ghost" onClick={openImageDialog}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Image</TooltipContent>
            </Tooltip>
          )}

          {/* Table Insert */}
          {hasExtension("table") && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="ghost" onClick={() => setShowTableDialog(true)}>
                    <TableIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Table</TooltipContent>
              </Tooltip>

              <ShadcnDialog open={showTableDialog} onOpenChange={setShowTableDialog}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Insert Table</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rows">Rows</Label>
                        <Input
                          id="rows"
                          type="number"
                          min="1"
                          max="20"
                          value={tableConfig.rows}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setTableConfig((prev: TableConfig) => ({
                              ...prev,
                              rows: parseInt(e.target.value) || 1,
                            }))
                          }
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              commands.insertTable(tableConfig);
                              setShowTableDialog(false);
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="columns">Columns</Label>
                        <Input
                          id="columns"
                          type="number"
                          min="1"
                          max="20"
                          value={tableConfig.columns}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setTableConfig((prev: TableConfig) => ({
                              ...prev,
                              columns: parseInt(e.target.value) || 1,
                            }))
                          }
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              commands.insertTable(tableConfig);
                              setShowTableDialog(false);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="headers"
                        checked={tableConfig.includeHeaders || false}
                        onCheckedChange={(checked: boolean) =>
                          setTableConfig((prev: TableConfig) => ({
                            ...prev,
                            includeHeaders: checked,
                          }))
                        }
                      />
                      <Label htmlFor="headers">Include headers</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowTableDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          commands.insertTable(tableConfig);
                          setShowTableDialog(false);
                        }}
                      >
                        Insert Table
                      </Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </ShadcnDialog>
            </>
          )}

          {/* Horizontal Rule */}
          {hasExtension("horizontalRule") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => commands.insertHorizontalRule()}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Horizontal Rule</TooltipContent>
            </Tooltip>
          )}

          {/* HTML Embed */}
          {hasExtension("htmlEmbed") && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.isHTMLEmbedSelected ? "pressed" : "default"}
                  pressed={activeStates.isHTMLEmbedSelected}
                  onPressedChange={() => commands.insertHTMLEmbed()}
                >
                  <FileCode className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>HTML Embed</TooltipContent>
            </Tooltip>
          )}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* History Section */}
        {hasExtension("history") && (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!activeStates.canUndo}
                  onClick={() => commands.undo()}
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!activeStates.canRedo}
                  onClick={() => commands.redo()}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </div>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* Utility Section */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost" onClick={onCommandPaletteOpen}>
                <CommandIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Command Palette (Ctrl+K)</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Mode Tabs Component
function ModeTabs({
  mode,
  onModeChange,
}: {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
}) {
  return (
    <Tabs
      value={mode}
      onValueChange={(value: string) => onModeChange(value as EditorMode)}
    >
      <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50">
        <TabsTrigger value="visual" className="flex items-center gap-2 text-sm">
          <Eye className="h-4 w-4" />
          Visual
        </TabsTrigger>
        <TabsTrigger value="html" className="flex items-center gap-2 text-sm">
          <FileCode className="h-4 w-4" />
          HTML
        </TabsTrigger>
        <TabsTrigger
          value="markdown"
          className="flex items-center gap-2 text-sm"
        >
          <FileText className="h-4 w-4" />
          Markdown
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

// HTML Source View Component
function HTMLSourceView({
  htmlContent,
  onHtmlChange,
}: {
  htmlContent: string;
  onHtmlChange: (html: string) => void;
}) {
  return (
    <Textarea
      className={shadcnTheme.sourceView?.textarea || "w-full h-full min-h-[600px] p-4 bg-background border-none rounded-none font-mono text-sm resize-none focus:outline-none focus:ring-0"}
      value={htmlContent}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onHtmlChange(e.target.value)}
      placeholder="Enter HTML content..."
      spellCheck={false}
    />
  );
}

// Markdown Source View Component
function MarkdownSourceView({
  markdownContent,
  onMarkdownChange,
}: {
  markdownContent: string;
  onMarkdownChange: (markdown: string) => void;
}) {
  return (
    <Textarea
      className={shadcnTheme.sourceView?.textarea || "w-full h-full min-h-[600px] p-4 bg-background border-none rounded-none font-mono text-sm resize-none focus:outline-none focus:ring-0"}
      value={markdownContent}
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onMarkdownChange(e.target.value)}
      placeholder="Enter Markdown content..."
      spellCheck={false}
    />
  );
}

// Error Boundary Component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Main Editor Content Component
function EditorContent({
  className,
  onReady,
}: {
  className?: string;
  onReady?: (methods: ShadcnTemplateRef) => void;
}) {
  const { commands, hasExtension, activeStates, lexical: editor } = useEditor();
  const [mode, setMode] = useState<EditorMode>("visual");
  const [content, setContent] = useState({ html: "", markdown: "" });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [linkInitial, setLinkInitial] = useState({ url: "" });
  const commandsRef = useRef<EditorCommands>(commands);

  // Store onReady in ref to avoid infinite loops
  const onReadyRef = useRef(onReady);
  const readyCalledRef = useRef(false);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  const methods = useMemo<ShadcnTemplateRef>(
    () => ({
      injectMarkdown: (content: string) => {
        if (editor) {
          editor.update(() => {
            commandsRef.current.importFromMarkdown(content, { immediate: true });
          });
        }
      },
      injectHTML: (content: string) => {
        if (editor) {
          editor.update(() => {
            commandsRef.current.importFromHTML(content);
          });
        }
      },
      getMarkdown: () => commandsRef.current.exportToMarkdown(),
      getHTML: () => commandsRef.current.exportToHTML(),
    }),
    [], // No dependencies to prevent recreation
  );

  const { handlers: imageHandlers } = useImageHandlers(commands, editor);

  const openLinkDialog = useCallback(
    (options: { initialUrl?: string } = {}) => {
      const { initialUrl = "" } = options;
      setLinkInitial({ url: initialUrl });
      setLinkDialogOpen(true);
    },
    [],
  );

  const handleLinkSubmit = useCallback(
    ({ url }: { url: string }) => {
      commands.insertLink(url);
    },
    [commands],
  );

  const handleImageSubmit = useCallback(
    ({ activeTab, url, alt, caption, file }: {
      activeTab: "upload" | "url";
      url: string;
      alt: string;
      caption: string;
      file: File | null;
    }) => {
      if (activeTab === "upload" && file) {
        imageHandlers.insertImageFromFile(file, alt, caption);
      } else if (activeTab === "url" && url.trim()) {
        imageHandlers.insertImageFromUrl(url.trim(), alt, caption);
      }
    },
    [imageHandlers],
  );

  useEffect(() => {
    if (!editor || !commands || readyCalledRef.current) return;

    const paletteCommands = commandsToCommandPaletteItems(commands);
    paletteCommands.forEach((cmd) => commands.registerCommand(cmd));

    const originalShowCommand = commands.showCommandPalette;
    (commands as any).showCommandPalette = () => setCommandPaletteOpen(true);

    const unregisterShortcuts = registerKeyboardShortcuts(commands, document.body);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Call onReady only once
    readyCalledRef.current = true;
    onReadyRef.current?.(methods);

    return () => {
      unregisterShortcuts();
      document.removeEventListener("keydown", handleKeyDown);
      (commands as any).showCommandPalette = originalShowCommand;
    };
  }, [editor, commands, methods]); // Only depend on editor and commands

  const handleModeChange = (newMode: EditorMode) => {
    if (mode === "markdown" && newMode !== "markdown" && hasExtension("markdown")) {
      commands.importFromMarkdown(content.markdown, { immediate: true });
    }
    if (mode === "html" && newMode !== "html" && hasExtension("html")) {
      commands.importFromHTML(content.html);
    }
    if (newMode === "markdown" && mode !== "markdown" && hasExtension("markdown")) {
      setContent((prev) => ({ ...prev, markdown: commands.exportToMarkdown() }));
    }
    if (newMode === "html" && mode !== "html" && hasExtension("html")) {
      setContent((prev) => ({ ...prev, html: commands.exportToHTML() }));
    }
    setMode(newMode);
    if (newMode === "visual") {
      setTimeout(() => editor?.focus(), 100);
    }
  };

  const handleHtmlChange = (html: string) => setContent((prev) => ({ ...prev, html }));

  const handleMarkdownChange = (markdown: string) => setContent((prev) => ({ ...prev, markdown }));

  return (
    <div className="flex flex-col min-h-[500px]">
      {/* Mode Tabs at top */}
      <div className="px-4 py-3 border-b border-border">
        <ModeTabs mode={mode} onModeChange={handleModeChange} />
      </div>

      {/* Sticky Toolbar Header - only show in visual mode */}
      {mode === "visual" && (
        <div className="z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="px-4 py-3">
            <Toolbar
              commands={commands}
              hasExtension={hasExtension}
              activeStates={activeStates}
              onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
              openLinkDialog={openLinkDialog}
              openImageDialog={() => setImageDialogOpen(true)}
            />
          </div>
        </div>
      )}

      <div className="relative ">
        {/* Editor Content - Always render RichText but control visibility */}
        <div 
          className="min-h-[600px] prose prose-lg max-w-none p-4"
          style={{ display: mode === "visual" ? "block" : "none" }}
        >
          <RichTextPlugin
            contentEditable={<ContentEditable className={shadcnTheme.contentEditable} />}
            placeholder={<div className={shadcnTheme.placeholder}>Start typing...</div>}
            ErrorBoundary={ErrorBoundary}
          />
          <FloatingToolbarRenderer openLinkDialog={openLinkDialog} />
        </div>

        {mode === "html" && (
          <HTMLSourceView
            htmlContent={content.html}
            onHtmlChange={handleHtmlChange}
          />
        )}

        {mode === "markdown" && (
          <MarkdownSourceView
            markdownContent={content.markdown}
            onMarkdownChange={handleMarkdownChange}
          />
        )}
      </div>

      {/* Dialogs */}
      <LinkDialog
        isOpen={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        initialUrl={linkInitial.url}
        onSubmit={handleLinkSubmit}
      />

      <ImageDialog
        isOpen={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onSubmit={handleImageSubmit}
      />

      {/* Command Palette */}
      <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(
            commandsToCommandPaletteItems(commands).reduce(
              (groups, cmd) => {
                const category = cmd.category || "Other";
                if (!groups[category]) groups[category] = [];
                groups[category].push(cmd);
                return groups;
              },
              {} as Record<string, ReturnType<typeof commandsToCommandPaletteItems>>,
            ),
          ).map(([category, categoryCommands]) => (
            <CommandGroup key={category} heading={category}>
              {categoryCommands.map((cmd: any) => (
                <CommandItem
                  key={cmd.id}
                  onSelect={() => {
                    cmd.action();
                    setCommandPaletteOpen(false);
                  }}
                >
                  {cmd.label}
                  {cmd.shortcut && <CommandShortcut>{cmd.shortcut}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </div>
  );
}

// Main Template Component
interface ShadcnTemplateProps {
  className?: string;
  onReady?: (methods: ShadcnTemplateRef) => void;
}

export const ShadcnTemplate = forwardRef<ShadcnTemplateRef, ShadcnTemplateProps>(
  ({ className, onReady }, ref) => {
    const [editorMethods, setEditorMethods] = useState<ShadcnTemplateRef | null>(null);

    // Configure image extension
    useEffect(() => {
      imageExtension.configure({
        uploadHandler: async (file: File) => {
          const objectUrl = URL.createObjectURL(file);
          return objectUrl;
        },
        defaultAlignment: "center",
        resizable: true,
        pasteListener: { insert: true, replace: true },
        debug: false,
      });
    }, []);

    // Handle when editor is ready
    const handleEditorReady = useCallback(
      (methods: ShadcnTemplateRef) => {
        setEditorMethods(methods);
        onReady?.(methods);
      },
      [onReady],
    );

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        injectMarkdown: (content: string) => editorMethods?.injectMarkdown(content),
        injectHTML: (content: string) => editorMethods?.injectHTML(content),
        getMarkdown: () => editorMethods?.getMarkdown() || "",
        getHTML: () => editorMethods?.getHTML() || "",
      }),
      [editorMethods],
    );

    return (
      <div className={`shadcn-editor-wrapper ${className || ""}`}>
        <Provider extensions={extensions} config={{ theme: shadcnTheme }}>
          <EditorContent className={className} onReady={handleEditorReady} />
        </Provider>
      </div>
    );
  },
);

ShadcnTemplate.displayName = "ShadcnTemplate";
