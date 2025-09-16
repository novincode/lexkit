"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  boldExtension,
  italicExtension,
  underlineExtension,
  strikethroughExtension,
  linkExtension,
  horizontalRuleExtension,
  tableExtension,
  type TableConfig,
  listExtension,
  historyExtension,
  imageExtension,
  blockFormatExtension,
  htmlExtension,
  markdownExtension,
  codeExtension,
  codeFormatExtension,
  htmlEmbedExtension,
  DraggableBlockExtension, // We need the class itself, to re-create an instsance (Because we've configured one inside DefaultTemplate and using them both with different configs, will cause problems)
} from "@lexkit/editor/extensions";
import {
  commandPaletteExtension,
  floatingToolbarExtension,
  contextMenuExtension,
} from "@lexkit/editor/extensions/core";
import { ALL_MARKDOWN_TRANSFORMERS } from "@lexkit/editor/extensions/export/transformers";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";

// Import shared commands and components
import {
  commandsToCommandPaletteItems,
  registerKeyboardShortcuts,
} from "./commands";
import { shadcnTheme } from "./theme";

// SHADCN Components
import { Button } from "@repo/ui/components/button";
import { Toggle } from "@repo/ui/components/toggle";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@repo/ui/components/command";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@repo/ui/components/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Separator } from "@repo/ui/components/separator";
import { Label } from "@repo/ui/components/label";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { Switch } from "@repo/ui/components/switch";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@repo/ui/components/drawer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/collapsible";

// Icons
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
  Sun,
  Moon,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  Link as LinkIcon,
  Unlink,
  Minus,
  Code,
  Terminal,
  Table,
  FileCode,
  Eye,
  Type,
  Quote,
  Command,
  FileText,
  Hash,
  X,
  CloudUpload,
  Globe,
  ChevronDown,
} from "lucide-react";

import { createEditorSystem } from "@lexkit/editor";
import type {
  ExtractCommands,
  ExtractStateQueries,
  BaseCommands,
} from "@lexkit/editor/extensions/types";
import { RichText } from "@lexkit/editor/extensions/core/RichTextExtension";
import { LexicalEditor } from "lexical";
import { createPortal } from "react-dom";
import "./shadcn-styles.css";

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
  tableExtension,
  listExtension,
  historyExtension,
  imageExtension,
  blockFormatExtension,
  htmlExtension,
  markdownExtension.configure({
    customTransformers: ALL_MARKDOWN_TRANSFORMERS,
  }),
  codeExtension,
  codeFormatExtension,
  htmlEmbedExtension.configure({
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
  }),
  floatingToolbarExtension,
  contextMenuExtension,
  commandPaletteExtension,
  
  new DraggableBlockExtension({ // Create fresh instance to avoid caching issues when switching templates
    buttonStackPosition: "right",
  }),
] as const;

// Create a typed editor system for these specific extensions
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// Extract the types for our specific extensions
type EditorCommands = BaseCommands & ExtractCommands<typeof extensions>;
type EditorStateQueries = ExtractStateQueries<typeof extensions>;
type ExtensionNames = (typeof extensions)[number]["name"];

// Editor Mode Types
type EditorMode = "visual" | "html" | "markdown";

// Ref interface for parent control
export interface ShadcnTemplateRef {
  injectMarkdown: (content: string) => void;
  injectHTML: (content: string) => void;
  getMarkdown: () => string;
  getHTML: () => string;
}

// Custom hook for image handling
function useImageHandlers(
  commands: EditorCommands,
  editor: LexicalEditor | null,
) {
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

// Link Dialog Component - Uses Drawer only
function LinkDialog({
  isOpen,
  onOpenChange,
  initialUrl = "",
  initialText = "",
  initialIsEdit = false,
  onSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialUrl?: string;
  initialText?: string;
  initialIsEdit?: boolean;
  onSubmit: (data: { url: string; text: string }) => void;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [isEdit, setIsEdit] = useState(initialIsEdit);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setIsEdit(initialIsEdit);
    }
  }, [isOpen, initialUrl, initialText, initialIsEdit]);

  const handleSubmit = () => {
    if (url.trim()) {
      onSubmit({ url: url.trim(), text: text.trim() });
      onOpenChange(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="flex flex-col max-h-[80vh]">
        <DrawerHeader>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            <DrawerTitle>
              {isEdit ? "Edit Link" : "Insert Link"}
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-text">Link Text</Label>
            <Input
              id="link-text"
              placeholder="Link text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        <DrawerFooter>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!url.trim()}>
              {isEdit ? "Update Link" : "Insert Link"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Image Dialog Component - Uses Drawer only
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
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="flex flex-col max-h-[80vh]">
        <DrawerHeader>
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            <DrawerTitle>
              Insert Image
            </DrawerTitle>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upload" | "url")}>
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
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
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
                  onChange={(e) => setUrl(e.target.value)}
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
                      onChange={(e) => setAlt(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-caption">Caption (optional)</Label>
                    <Input
                      id="image-caption"
                      placeholder="Image caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </Tabs>
        </div>

        <DrawerFooter>
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Modern Floating Toolbar with SHADCN components
function ModernFloatingToolbar({
  openLinkDialog,
}: {
  openLinkDialog: (
    initialUrl?: string,
    initialText?: string,
    initialIsEdit?: boolean,
  ) => void;
}) {
  const { commands, activeStates, extensions, hasExtension, config } =
    useEditor();
  const [isVisible, setIsVisible] = useState(false);
  const [selectionRect, setSelectionRect] = useState<any>(null);

  // Get the floating toolbar extension instance
  const floatingExtension = extensions.find(
    (ext) => ext.name === "floatingToolbar",
  ) as any;

  // Poll the extension state
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

  // Get theme classes from global theme
  const theme = config?.theme?.floatingToolbar || {};

  return createPortal(
    <TooltipProvider>
      <div
        className={
          theme.container ||
          "flex items-center gap-1 p-2 bg-background border border-border rounded-lg shadow-lg"
        }
        style={{
          position: "absolute",
          top: selectionRect.y,
          ...(selectionRect.positionFromRight
            ? // Stick to right edge with margin
              { right: 10, left: "auto" }
            : // Use calculated position (either centered or left-aligned)
              { left: selectionRect.x, right: "auto" }),
          zIndex: 50,
          pointerEvents: "auto",
          ...theme.styles?.container,
        }}
      >
        {isImageSelected ? (
          // Image-specific toolbar
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={
                    activeStates.isImageAlignedLeft ? "pressed" : "default"
                  }
                  className={
                    activeStates.isImageAlignedLeft
                      ? theme.buttonActive
                      : theme.button
                  }
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
                  variant={
                    activeStates.isImageAlignedCenter ? "pressed" : "default"
                  }
                  className={
                    activeStates.isImageAlignedCenter
                      ? theme.buttonActive
                      : theme.button
                  }
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
                  variant={
                    activeStates.isImageAlignedRight ? "pressed" : "default"
                  }
                  className={
                    activeStates.isImageAlignedRight
                      ? theme.buttonActive
                      : theme.button
                  }
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
                  className={theme.button}
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
          // Text formatting toolbar
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant={activeStates.bold ? "pressed" : "default"}
                  className={
                    activeStates.bold ? theme.buttonActive : theme.button
                  }
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
                  className={
                    activeStates.italic ? theme.buttonActive : theme.button
                  }
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
                  className={
                    activeStates.underline ? theme.buttonActive : theme.button
                  }
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
                  className={
                    activeStates.strikethrough
                      ? theme.buttonActive
                      : theme.button
                  }
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
                  className={
                    activeStates.code ? theme.buttonActive : theme.button
                  }
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
                  className={
                    activeStates.isLink ? theme.buttonActive : theme.button
                  }
                  pressed={activeStates.isLink}
                  onPressedChange={() => {
                    if (activeStates.isLink) {
                      // Text is already linked - remove the link
                      commands.removeLink();
                    } else if (activeStates.isTextSelected) {
                      // Text is selected - only ask for URL
                      openLinkDialog("", "", false);
                    } else {
                      // No text selected - use the full dialog
                      openLinkDialog("", "", false);
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

            {/* Lists Section in Floating Toolbar */}
            {hasExtension("list") && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Toggle
                      size="sm"
                      variant={
                        activeStates.unorderedList ? "pressed" : "default"
                      }
                      className={
                        activeStates.unorderedList
                          ? theme.buttonActive
                          : theme.button
                      }
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
                      className={
                        activeStates.orderedList
                          ? theme.buttonActive
                          : theme.button
                      }
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
    document.body,
  );
}

// Modern Toolbar Component with SHADCN - Simplified, no Card wrapper
function ModernToolbar({
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
  openLinkDialog: (
    initialUrl?: string,
    initialText?: string,
    initialIsEdit?: boolean,
  ) => void;
  openImageDialog: () => void;
}) {
  const { lexical: editor } = useEditor();
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [tableConfig, setTableConfig] = useState<TableConfig>({
    rows: 3,
    columns: 3,
    includeHeaders: false,
  });

  // Block format options
  const blockFormatOptions = [
    { value: "p", label: "Paragraph", icon: <FileText className="h-4 w-4" /> },
    { value: "h1", label: "Heading 1", icon: <Hash className="h-4 w-4" /> },
    { value: "h2", label: "Heading 2", icon: <Hash className="h-4 w-4" /> },
    { value: "h3", label: "Heading 3", icon: <Hash className="h-4 w-4" /> },
    { value: "quote", label: "Quote", icon: <Quote className="h-4 w-4" /> },
  ];

  // Get current block format
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
    else if (value === "h1") commands.toggleHeading("h1");
    else if (value === "h2") commands.toggleHeading("h2");
    else if (value === "h3") commands.toggleHeading("h3");
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
                onPressedChange={() => {
                  if (activeStates.isLink) {
                    // Text is already linked - remove the link
                    commands.removeLink();
                  } else if (activeStates.isTextSelected) {
                    // Text is selected - only ask for URL
                    openLinkDialog("", "", false);
                  } else {
                    // No text selected - use the full dialog
                    openLinkDialog("", "", false);
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
                  <Image className="h-4 w-4" />
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
                    <Table className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Insert Table</TooltipContent>
              </Tooltip>

              <Drawer open={showTableDialog} onOpenChange={setShowTableDialog}>
                <DrawerContent className="flex flex-col max-h-[80vh]">
                  <DrawerHeader>
                    <DrawerTitle>Insert Table</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex-1 overflow-y-auto p-4">
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
                            onChange={(e) =>
                              setTableConfig((prev) => ({
                                ...prev,
                                rows: parseInt(e.target.value) || 1,
                              }))
                            }
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
                            onChange={(e) =>
                              setTableConfig((prev) => ({
                                ...prev,
                                columns: parseInt(e.target.value) || 1,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="headers"
                          checked={tableConfig.includeHeaders || false}
                          onCheckedChange={(checked) =>
                            setTableConfig((prev) => ({
                              ...prev,
                              includeHeaders: checked,
                            }))
                          }
                        />
                        <Label htmlFor="headers">Include headers</Label>
                      </div>
                    </div>
                  </div>
                  <DrawerFooter>
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
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
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
                  variant={
                    activeStates.isHTMLEmbedSelected ? "pressed" : "default"
                  }
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
                <Command className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Command Palette (Ctrl+K)</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Modern Mode Tabs with SHADCN Tabs - Clean
function ModernModeTabs({
  mode,
  onModeChange,
}: {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
}) {
  return (
    <Tabs
      value={mode}
      onValueChange={(value) => onModeChange(value as EditorMode)}
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

// Modern Source Views - Clean and full width
function ModernHTMLSourceView({
  htmlContent,
  onHtmlChange,
}: {
  htmlContent: string;
  onHtmlChange: (html: string) => void;
}) {
  return (
    <textarea
      className="lexkit-html-view"
      value={htmlContent}
      onChange={(e) => onHtmlChange(e.target.value)}
      placeholder="Enter HTML content..."
      spellCheck={false}
    />
  );
}

function ModernMarkdownSourceView({
  markdownContent,
  onMarkdownChange,
}: {
  markdownContent: string;
  onMarkdownChange: (markdown: string) => void;
}) {
  return (
    <textarea
      className="lexkit-html-view"
      value={markdownContent}
      onChange={(e) => onMarkdownChange(e.target.value)}
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
  const [linkInitial, setLinkInitial] = useState({
    url: "",
    text: "",
    isEdit: false,
  });

  // Use ref to store latest commands to avoid dependency issues
  const commandsRef = React.useRef(commands);

  // Generate command palette items
  const paletteCommands = React.useMemo(
    () => commandsToCommandPaletteItems(commands),
    [commands],
  );

  // Update ref when commands change
  React.useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  // Create methods object that uses the ref
  const methods = React.useMemo(
    () => ({
      injectMarkdown: (content: string) => {
        commandsRef.current.importFromMarkdown(content);
      },
      injectHTML: (content: string) => {
        commandsRef.current.importFromHTML(content);
      },
      getMarkdown: () => {
        return commandsRef.current.exportToMarkdown();
      },
      getHTML: () => {
        return commandsRef.current.exportToHTML();
      },
    }),
    [],
  );

  // Image handlers
  const { handlers: imageHandlers } = useImageHandlers(commands, editor);

  // Handle link dialog open with initial values
  const openLinkDialog = useCallback(
    (initialUrl = "", initialText = "", initialIsEdit = false) => {
      setLinkInitial({ url: initialUrl, text: initialText, isEdit: initialIsEdit });
      setLinkDialogOpen(true);
    },
    [],
  );

  // Handle link submit
  const handleLinkSubmit = useCallback(
    ({ url, text }: { url: string; text: string }) => {
      commands.insertLink(url, text);
    },
    [commands],
  );

  // Handle image submit
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

  // Register command palette commands and keyboard shortcuts
  useEffect(() => {
    if (editor && methods) {
      // Register keyboard shortcuts
      const unregister = registerKeyboardShortcuts(commands);

      // Override showCommandPalette command
      const originalShowCommand = commands.showCommandPalette;
      (commands as any).showCommandPalette = () => setCommandPaletteOpen(true);

      // Call onReady with methods when editor is ready
      if (onReady) {
        onReady(methods);
      }

      return () => {
        unregister();
        (commands as any).showCommandPalette = originalShowCommand;
      };
    }
  }, [editor, methods, onReady, commands]);

  // Cmd+K keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle mode changes
  const handleModeChange = (newMode: EditorMode) => {
    // If leaving markdown mode, import the markdown content
    if (
      mode === "markdown" &&
      newMode !== "markdown" &&
      editor &&
      hasExtension("markdown")
    ) {
      try {
        commands.importFromMarkdown(content.markdown, true);
      } catch (error) {
        console.error("Failed to import Markdown:", error);
      }
    }

    // If leaving HTML mode, import the HTML content
    if (
      mode === "html" &&
      newMode !== "html" &&
      editor &&
      hasExtension("html")
    ) {
      try {
        commands.importFromHTML(content.html);
      } catch (error) {
        console.error("Failed to import HTML:", error);
      }
    }

    // If entering markdown mode, sync current content
    if (
      newMode === "markdown" &&
      mode !== "markdown" &&
      editor &&
      hasExtension("markdown")
    ) {
      try {
        const markdown = commands.exportToMarkdown();
        setContent((prev) => ({ ...prev, markdown }));
      } catch (error) {
        console.error("Failed to export Markdown:", error);
      }
    }

    // If entering HTML mode, sync current content
    if (
      newMode === "html" &&
      mode !== "html" &&
      editor &&
      hasExtension("html")
    ) {
      try {
        const html = commands.exportToHTML();
        setContent((prev) => ({ ...prev, html }));
      } catch (error) {
        console.error("Failed to export HTML:", error);
      }
    }

    setMode(newMode);
  };

  const handleHtmlChange = (html: string) => {
    setContent((prev) => ({ ...prev, html }));
  };

  const handleMarkdownChange = (markdown: string) => {
    setContent((prev) => ({ ...prev, markdown }));
  };

  return (
    <div className="flex flex-col min-h-[500px]">
      {/* Mode Tabs at top */}
      <div className="px-4 py-3 border-b border-border">
        <ModernModeTabs mode={mode} onModeChange={handleModeChange} />
      </div>

      {/* Sticky Toolbar Header - only show in visual mode */}
      {mode === "visual" && (
        <div className=" z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="px-4 py-3">
            <ModernToolbar
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

      <div className="relative p-4">
        {/* Editor Content - Full width, no card wrapper */}
        {mode === "visual" ? (
          <div className="min-h-[600px] prose prose-lg max-w-none">
            <RichText
              className={shadcnTheme.contentEditable}
              placeholder="Start writing..."
              classNames={{
                contentEditable: `${shadcnTheme.contentEditable} min-h-[600px] focus:outline-none`,
                placeholder:
                  "shadcn-placeholder absolute top-8 left-4 text-muted-foreground pointer-events-none",
              }}
            />
            <ModernFloatingToolbar openLinkDialog={openLinkDialog} />
          </div>
        ) : mode === "html" ? (
          <ModernHTMLSourceView
            htmlContent={content.html}
            onHtmlChange={handleHtmlChange}
          />
        ) : (
          <ModernMarkdownSourceView
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
        initialText={linkInitial.text}
        initialIsEdit={linkInitial.isEdit}
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
            paletteCommands.reduce(
              (groups, cmd) => {
                const category = cmd.category || "Other";
                if (!groups[category]) groups[category] = [];
                groups[category].push(cmd);
                return groups;
              },
              {} as Record<string, typeof paletteCommands>,
            ),
          ).map(([category, categoryCommands]) => (
            <CommandGroup key={category} heading={category}>
              {categoryCommands.map((cmd) => (
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

export const ShadcnTemplate = React.forwardRef<
  ShadcnTemplateRef,
  ShadcnTemplateProps
>(({ className, onReady }, ref) => {
  const [editorMethods, setEditorMethods] = useState<ShadcnTemplateRef | null>(
    null,
  );

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
  const handleEditorReady = React.useCallback(
    (methods: ShadcnTemplateRef) => {
      setEditorMethods(methods);

      if (onReady) {
        onReady(methods);
      }
    },
    [onReady],
  );

  // Expose methods via ref
  React.useImperativeHandle(
    ref,
    () => ({
      injectMarkdown: (content: string) => {
        if (editorMethods) {
          editorMethods.injectMarkdown(content);
        }
      },
      injectHTML: (content: string) => {
        if (editorMethods) {
          editorMethods.injectHTML(content);
        }
      },
      getMarkdown: () => {
        return editorMethods ? editorMethods.getMarkdown() : "";
      },
      getHTML: () => {
        return editorMethods ? editorMethods.getHTML() : "";
      },
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
});

ShadcnTemplate.displayName = "ShadcnTemplate";
