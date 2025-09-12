'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTheme } from 'next-themes';
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
  draggableBlockExtension
} from '@lexkit/editor/extensions';
import { commandPaletteExtension, floatingToolbarExtension, contextMenuExtension } from '@lexkit/editor/extensions/core';
import { ALL_MARKDOWN_TRANSFORMERS } from '@lexkit/editor/extensions/export/transformers';
import { MyCustomExtension } from '../MyCustomExtension';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

// Import shared commands and components
import { commandsToCommandPaletteItems, registerKeyboardShortcuts } from '../default/commands';
import { ShadcnCommandPalette } from './CommandPalette';
import { shadcnTheme } from './theme';

// SHADCN Components
import { Button } from '@repo/ui/components/button';
import { Toggle } from '@repo/ui/components/toggle';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@repo/ui/components/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/select';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@repo/ui/components/dialog';
import { Separator } from '@repo/ui/components/separator';
import { Label } from '@repo/ui/components/label';
import { Input } from '@repo/ui/components/input';
import { Textarea } from '@repo/ui/components/textarea';
import { Switch } from '@repo/ui/components/switch';

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
  Hash
} from 'lucide-react';

import { createEditorSystem } from '@lexkit/editor';
import type { ExtractCommands, ExtractStateQueries, BaseCommands } from '@lexkit/editor/extensions/types';
import { LexicalEditor } from 'lexical';
import { createPortal } from 'react-dom';
import './shadcn-styles.css';

// Extensions array
const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  strikethroughExtension,
  linkExtension.configure({
    linkSelectedTextOnPaste: true,
    autoLinkText: true,
    autoLinkUrls: true
  }),
  horizontalRuleExtension,
  tableExtension,
  listExtension,
  historyExtension,
  imageExtension,
  blockFormatExtension,
  htmlExtension,
  markdownExtension.configure({
    customTransformers: ALL_MARKDOWN_TRANSFORMERS
  }),
  codeExtension,
  codeFormatExtension,
  htmlEmbedExtension,
  MyCustomExtension,
  floatingToolbarExtension,
  contextMenuExtension,
  commandPaletteExtension,
    draggableBlockExtension.configure({
    styles: {
      handle: {
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        color: 'var(--foreground)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      },
      handleActive: {
        backgroundColor: 'var(--accent)',
        borderColor: 'var(--ring)',
        color: 'var(--accent-foreground)'
      },
      upButton: {
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        color: 'var(--foreground)'
      },
      downButton: {
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        color: 'var(--foreground)'
      },
      buttonStack: {
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }
    }
  }),
] as const;

// Create a typed editor system for these specific extensions
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// Extract the types for our specific extensions
type EditorCommands = BaseCommands & ExtractCommands<typeof extensions>;
type EditorStateQueries = ExtractStateQueries<typeof extensions>;
type ExtensionNames = typeof extensions[number]['name'];

// Editor Mode Types
type EditorMode = 'visual' | 'html' | 'markdown';

// Ref interface for parent control
export interface ShadcnTemplateRef {
  injectMarkdown: (content: string) => void;
  injectHTML: (content: string) => void;
  getMarkdown: () => string;
  getHTML: () => string;
}

// Custom hook for image handling
function useImageHandlers(commands: EditorCommands, editor: LexicalEditor | null) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlers = useMemo(() => ({
    insertImageFromUrl: () => {
      const src = prompt('Enter image URL:');
      if (!src) return;
      const alt = prompt('Enter alt text:') || '';
      const caption = prompt('Enter caption (optional):') || undefined;
      commands.insertImage({ src, alt, caption });
    },

    insertImageFromFile: () => {
      fileInputRef.current?.click();
    },

    handleFileUpload: async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && imageExtension.config.uploadHandler) {
        try {
          const src = await imageExtension.config.uploadHandler(file);
          commands.insertImage({ src, alt: file.name, file });
        } catch (error) {
          alert('Failed to upload image');
        }
      } else if (file) {
        const src = URL.createObjectURL(file);
        commands.insertImage({ src, alt: file.name, file });
      }
      e.target.value = '';
    },

    setImageAlignment: (alignment: 'left' | 'center' | 'right' | 'none') => {
      commands.setImageAlignment(alignment);
    },

    setImageCaption: () => {
      const newCaption = prompt('Enter caption:') || '';
      commands.setImageCaption(newCaption);
    },
  }), [commands]);

  return { handlers, fileInputRef };
}

// Modern Floating Toolbar with SHADCN components
function ModernFloatingToolbar() {
  const { commands, activeStates, extensions, hasExtension } = useEditor();
  const [isVisible, setIsVisible] = useState(false);
  const [selectionRect, setSelectionRect] = useState<any>(null);

  // Get the floating toolbar extension instance
  const floatingExtension = extensions.find(ext => ext.name === 'floatingToolbar') as any;

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

  return createPortal(
    <TooltipProvider>
      <div
        className="flex items-center gap-1 p-2 bg-background border border-border rounded-lg shadow-lg"
        style={{
          position: 'absolute',
          top: selectionRect.y - 60,
          left: selectionRect.x,
          transform: 'translateX(-50%)',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}
      >
        {isImageSelected ? (
          // Image-specific toolbar
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={activeStates.isImageAlignedLeft}
                  onPressedChange={() => commands.setImageAlignment('left')}
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
                  pressed={activeStates.isImageAlignedCenter}
                  onPressedChange={() => commands.setImageAlignment('center')}
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
                  pressed={activeStates.isImageAlignedRight}
                  onPressedChange={() => commands.setImageAlignment('right')}
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
                    const caption = prompt('Enter caption:') || '';
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
                  pressed={activeStates.code}
                  onPressedChange={() => commands.formatText('code')}
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
                  pressed={activeStates.isLink}
                  onPressedChange={() => activeStates.isLink ? commands.removeLink() : commands.insertLink()}
                >
                  {activeStates.isLink ? <Unlink className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>{activeStates.isLink ? 'Remove Link' : 'Add Link'}</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            {/* Lists Section in Floating Toolbar */}
            {hasExtension('list') && (
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

// Modern Toolbar Component with SHADCN - Simplified, no Card wrapper
function ModernToolbar({
  commands,
  hasExtension,
  activeStates,
  isDark,
  toggleTheme,
  onCommandPaletteOpen
}: {
  commands: EditorCommands;
  hasExtension: (name: ExtensionNames) => boolean;
  activeStates: EditorStateQueries;
  isDark: boolean;
  toggleTheme: () => void;
  onCommandPaletteOpen: () => void;
}) {
  const { lexical: editor } = useEditor();
  const { handlers, fileInputRef } = useImageHandlers(commands, editor);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [tableConfig, setTableConfig] = useState<TableConfig>({
    rows: 3,
    columns: 3,
    includeHeaders: false
  });

  // Block format options
  const blockFormatOptions = [
    { value: 'p', label: 'Paragraph', icon: <FileText className="h-4 w-4" /> },
    { value: 'h1', label: 'Heading 1', icon: <Hash className="h-4 w-4" /> },
    { value: 'h2', label: 'Heading 2', icon: <Hash className="h-4 w-4" /> },
    { value: 'h3', label: 'Heading 3', icon: <Hash className="h-4 w-4" /> },
    { value: 'quote', label: 'Quote', icon: <Quote className="h-4 w-4" /> },
  ];

  // Get current block format
  const currentBlockFormat = activeStates.isH1 ? 'h1'
    : activeStates.isH2 ? 'h2'
    : activeStates.isH3 ? 'h3'
    : activeStates.isQuote ? 'quote'
    : 'p';

  const handleBlockFormatChange = (value: string) => {
    if (value === 'p') commands.toggleParagraph();
    else if (value === 'h1') commands.toggleHeading('h1');
    else if (value === 'h2') commands.toggleHeading('h2');
    else if (value === 'h3') commands.toggleHeading('h3');
    else if (value === 'quote') commands.toggleQuote();
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2 p-3 bg-background border border-border rounded-lg shadow-sm">
        {/* Text Formatting Section */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
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
                pressed={activeStates.code}
                onPressedChange={() => commands.formatText('code')}
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
                pressed={activeStates.isLink}
                onPressedChange={() => activeStates.isLink ? commands.removeLink() : commands.insertLink()}
              >
                {activeStates.isLink ? <Unlink className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>{activeStates.isLink ? 'Remove Link' : 'Insert Link'}</TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Block Format Section */}
        {hasExtension('blockFormat') && (
          <div className="flex items-center gap-1">
            <Select value={currentBlockFormat} onValueChange={handleBlockFormatChange}>
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

            {hasExtension('code') && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle
                    size="sm"
                    pressed={activeStates.isInCodeBlock}
                    onPressedChange={() => commands.toggleCodeBlock()}
                  >
                    <Terminal className="h-4 w-4" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>Code Block</TooltipContent>
              </Tooltip>
            )}
          </div>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* Lists Section */}
        {hasExtension('list') && (
          <div className="flex items-center gap-1">
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
          </div>
        )}

        <Separator orientation="vertical" className="h-6" />

        {/* Media & Content Section */}
        <div className="flex items-center gap-1">
          {/* Image Insert */}
          {hasExtension('image') && (
            <Popover>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <Image className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>Insert Image</TooltipContent>
              </Tooltip>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handlers.insertImageFromUrl}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    From URL
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handlers.insertImageFromFile}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Table Insert */}
          {hasExtension('table') && (
            <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="ghost">
                      <Table className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Insert Table</TooltipContent>
              </Tooltip>
              <DialogContent>
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
                        onChange={(e) => setTableConfig(prev => ({ ...prev, rows: parseInt(e.target.value) || 1 }))}
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
                        onChange={(e) => setTableConfig(prev => ({ ...prev, columns: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="headers"
                      checked={tableConfig.includeHeaders || false}
                      onCheckedChange={(checked) => setTableConfig(prev => ({ ...prev, includeHeaders: checked }))}
                    />
                    <Label htmlFor="headers">Include headers</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowTableDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      commands.insertTable(tableConfig);
                      setShowTableDialog(false);
                    }}>
                      Insert Table
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Horizontal Rule */}
          {hasExtension('horizontalRule') && (
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
          {hasExtension('htmlEmbed') && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
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
        {hasExtension('history') && (
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
              <Button
                size="sm"
                variant="ghost"
                onClick={onCommandPaletteOpen}
              >
                <Command className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Command Palette (Ctrl+K)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleTheme}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isDark ? 'Light Mode' : 'Dark Mode'}</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlers.handleFileUpload}
        className="hidden"
      />
    </TooltipProvider>
  );
}

// Modern Mode Tabs with SHADCN Tabs
function ModernModeTabs({
  mode,
  onModeChange
}: {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
}) {
  return (
    <Tabs value={mode} onValueChange={(value) => onModeChange(value as EditorMode)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="visual" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Visual
        </TabsTrigger>
        <TabsTrigger value="html" className="flex items-center gap-2">
          <FileCode className="h-4 w-4" />
          HTML
        </TabsTrigger>
        <TabsTrigger value="markdown" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Markdown
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

// Modern Source Views
function ModernHTMLSourceView({
  htmlContent,
  onHtmlChange
}: {
  htmlContent: string;
  onHtmlChange: (html: string) => void;
}) {
  return (
    <div className="flex-1">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <FileCode className="h-4 w-4" />
        HTML Source
      </div>
      <Textarea
        className="min-h-[400px] font-mono text-sm"
        value={htmlContent}
        onChange={(e) => onHtmlChange(e.target.value)}
        placeholder="Enter HTML content..."
        spellCheck={false}
      />
    </div>
  );
}

function ModernMarkdownSourceView({
  markdownContent,
  onMarkdownChange
}: {
  markdownContent: string;
  onMarkdownChange: (markdown: string) => void;
}) {
  return (
    <div className="flex-1">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <FileText className="h-4 w-4" />
        Markdown Source
      </div>
      <Textarea
        className="min-h-[400px] font-mono text-sm"
        value={markdownContent}
        onChange={(e) => onMarkdownChange(e.target.value)}
        placeholder="Enter Markdown content..."
        spellCheck={false}
      />
    </div>
  );
}

// Error Boundary Component
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Main Editor Content Component
function EditorContent({
  className,
  isDark,
  toggleTheme,
  onReady
}: {
  className?: string;
  isDark: boolean;
  toggleTheme: () => void;
  onReady?: (methods: ShadcnTemplateRef) => void;
}) {
  const { commands, hasExtension, activeStates, lexical: editor } = useEditor();
  const [mode, setMode] = useState<EditorMode>('visual');
  const [content, setContent] = useState({ html: '', markdown: '' });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Use ref to store latest commands to avoid dependency issues
  const commandsRef = React.useRef(commands);

  // Generate command palette items
  const paletteCommands = React.useMemo(() => commandsToCommandPaletteItems(commands), [commands]);

  // Update ref when commands change
  React.useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);

  // Create methods object that uses the ref
  const methods = React.useMemo(() => ({
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
    }
  }), []);

  // Register command palette commands and keyboard shortcuts
  useEffect(() => {
    if (editor && methods) {
      // Set the editor theme attribute for CSS
      editor.getRootElement()?.setAttribute('data-editor-theme', isDark ? 'dark' : 'light');

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
  }, [editor, methods, onReady, commands, isDark]);

  // Handle mode changes
  const handleModeChange = (newMode: EditorMode) => {
    // If leaving markdown mode, import the markdown content
    if (mode === 'markdown' && newMode !== 'markdown' && editor && hasExtension('markdown')) {
      try {
        commands.importFromMarkdown(content.markdown, true);
      } catch (error) {
        console.error('Failed to import Markdown:', error);
      }
    }

    // If leaving HTML mode, import the HTML content
    if (mode === 'html' && newMode !== 'html' && editor && hasExtension('html')) {
      try {
        commands.importFromHTML(content.html);
      } catch (error) {
        console.error('Failed to import HTML:', error);
      }
    }

    // If entering markdown mode, sync current content
    if (newMode === 'markdown' && mode !== 'markdown' && editor && hasExtension('markdown')) {
      try {
        const markdown = commands.exportToMarkdown();
        setContent(prev => ({ ...prev, markdown }));
      } catch (error) {
        console.error('Failed to export Markdown:', error);
      }
    }

    // If entering HTML mode, sync current content
    if (newMode === 'html' && mode !== 'html' && editor && hasExtension('html')) {
      try {
        const html = commands.exportToHTML();
        setContent(prev => ({ ...prev, html }));
      } catch (error) {
        console.error('Failed to export HTML:', error);
      }
    }

    setMode(newMode);
  };

  const handleHtmlChange = (html: string) => {
    setContent(prev => ({ ...prev, html }));
  };

  const handleMarkdownChange = (markdown: string) => {
    setContent(prev => ({ ...prev, markdown }));
  };

  return (
    <div className="space-y-4">
      {/* Header with Mode Tabs */}
      <div className="space-y-4">
        <ModernModeTabs mode={mode} onModeChange={handleModeChange} />

        {/* Toolbar - only show in visual mode */}
        {mode === 'visual' && (
          <ModernToolbar
            commands={commands}
            hasExtension={hasExtension}
            activeStates={activeStates}
            isDark={isDark}
            toggleTheme={toggleTheme}
            onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
          />
        )}
      </div>

      {/* Editor Content */}
      <div className="min-h-[500px] border border-border rounded-lg bg-background p-6">
        {mode === 'visual' ? (
          <div className="min-h-[500px]">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="shadcn-content-editable min-h-[500px] focus:outline-none" />
              }
              placeholder={
                <div className="shadcn-placeholder absolute top-6 left-6 text-muted-foreground pointer-events-none">
                  Start writing...
                </div>
              }
              ErrorBoundary={ErrorBoundary}
            />
            <ModernFloatingToolbar />
          </div>
        ) : mode === 'html' ? (
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

      {/* Command Palette */}
      <ShadcnCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={paletteCommands}
      />
    </div>
  );
}

// Main Template Component
interface ShadcnTemplateProps {
  className?: string;
  onReady?: (methods: ShadcnTemplateRef) => void;
}

export const ShadcnTemplate = React.forwardRef<ShadcnTemplateRef, ShadcnTemplateProps>(
  ({ className, onReady }, ref) => {
    const { theme: globalTheme } = useTheme();
    const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');
    const [editorMethods, setEditorMethods] = useState<ShadcnTemplateRef | null>(null);

    // Initialize editor theme from global theme
    useEffect(() => {
      if (globalTheme === 'dark' || globalTheme === 'light') {
        setEditorTheme(globalTheme);
      }
    }, [globalTheme]);

    const isDark = editorTheme === 'dark';

    // Configure image extension
    useEffect(() => {
      imageExtension.configure({
        uploadHandler: async (file: File) => {
          const objectUrl = URL.createObjectURL(file);
          return objectUrl;
        },
        defaultAlignment: 'center',
        resizable: true,
        pasteListener: { insert: true, replace: true },
        debug: false,
      });
    }, []);

    const toggleTheme = () => {
      setEditorTheme(isDark ? 'light' : 'dark');
    };

    // Handle when editor is ready
    const handleEditorReady = React.useCallback((methods: ShadcnTemplateRef) => {
      setEditorMethods(methods);

      if (onReady) {
        onReady(methods);
      }
    }, [onReady]);

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
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
        return editorMethods ? editorMethods.getMarkdown() : '';
      },
      getHTML: () => {
        return editorMethods ? editorMethods.getHTML() : '';
      }
    }), [editorMethods]);

    return (
      <div className={`shadcn-editor-wrapper ${className || ''}`} data-theme={editorTheme} data-editor-theme={editorTheme}>
        <Provider extensions={extensions}>
          <EditorContent
            className={className}
            isDark={isDark}
            toggleTheme={toggleTheme}
            onReady={handleEditorReady}
          />
        </Provider>
      </div>
    );
  }
);

ShadcnTemplate.displayName = 'ShadcnTemplate';
