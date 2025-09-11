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
import { $getSelection, $isNodeSelection, $isRangeSelection } from 'lexical';
import { ImageNode } from '@lexkit/editor/extensions/media';
import './styles.css';
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
  Link,
  Unlink,
  Minus,
  Code,
  Terminal,
  Table,
  FileCode,
  Eye,
  Pencil,
  Command,
  Type,
  ArrowRight,
  Quote
} from 'lucide-react';
import { Select, Dropdown, Dialog } from './components';
import { createEditorSystem } from '@lexkit/editor';
import type { ExtractCommands, ExtractStateQueries, BaseCommands } from '@lexkit/editor/extensions/types';
import { LexicalEditor } from 'lexical';
import { commandsToCommandPaletteItems, registerKeyboardShortcuts } from './commands';
import { CommandPalette } from './CommandPalette';
import { SelectionRect } from '@lexkit/editor/extensions/core/FloatingToolbarExtension';
import { FloatingToolbarExtension } from '@lexkit/editor/extensions/core/FloatingToolbarExtension';
import { createPortal } from 'react-dom';

// Extensions array
const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  strikethroughExtension,
  linkExtension,
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
  floatingToolbarExtension, // Simple extension without render config
  contextMenuExtension,
  commandPaletteExtension,
  draggableBlockExtension.configure({
    // showMoveButtons:false
  }), // Use with default configuration
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
export interface DefaultTemplateRef {
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

// Floating Toolbar Renderer Component
function FloatingToolbarRenderer() {
  const { commands, activeStates, extensions, hasExtension } = useEditor();
  const [isVisible, setIsVisible] = useState(false);
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);

  // Get the floating toolbar extension instance
  const floatingExtension = extensions.find(ext => ext.name === 'floatingToolbar') as FloatingToolbarExtension | undefined;

  // Poll the extension state
  useEffect(() => {
    if (!floatingExtension) {
      return;
    }

    const checkState = () => {
      const visible = floatingExtension.getIsVisible();
      const rect = floatingExtension.getSelectionRect();
      
      setIsVisible(visible);
      setSelectionRect(rect);
    };

    const interval = setInterval(checkState, 200); // Poll every 200ms
    return () => clearInterval(interval);
  }, [floatingExtension]);

  // Block format handlers
  const handleBlockFormatChange = (format: string) => {
    if (format === 'p') commands.toggleParagraph();
    else if (format === 'h1') commands.toggleHeading('h1');
    else if (format === 'h2') commands.toggleHeading('h2');
    else if (format === 'h3') commands.toggleHeading('h3');
    else if (format === 'quote') commands.toggleQuote();
  };

  // Get current block format for display
  const getCurrentBlockFormat = () => {
    if (activeStates.isH1) return 'H1';
    if (activeStates.isH2) return 'H2';
    if (activeStates.isH3) return 'H3';
    if (activeStates.isQuote) return 'Quote';
    return 'P';
  };

  if (!isVisible || !selectionRect) return null;

  // Render as portal to document body for proper positioning
  return createPortal(
    <div
      className="lexkit-floating-toolbar"
      style={{
        position: 'absolute',
        top: selectionRect.y,
        left: selectionRect.x,
        transform: 'translateX(-50%)',
        zIndex: 9999,
        pointerEvents: 'auto'
      }}
    >
      {/* Text Formatting */}
      <button
        onClick={() => commands.toggleBold?.()}
        className={`lexkit-toolbar-button ${activeStates.bold ? 'active' : ''}`}
        title="Bold"
      >
        <Bold size={14} />
      </button>
      <button
        onClick={() => commands.toggleItalic?.()}
        className={`lexkit-toolbar-button ${activeStates.italic ? 'active' : ''}`}
        title="Italic"
      >
        <Italic size={14} />
      </button>
      <button
        onClick={() => commands.toggleUnderline?.()}
        className={`lexkit-toolbar-button ${activeStates.underline ? 'active' : ''}`}
        title="Underline"
      >
        <Underline size={14} />
      </button>
      <button
        onClick={() => commands.toggleStrikethrough?.()}
        className={`lexkit-toolbar-button ${activeStates.strikethrough ? 'active' : ''}`}
        title="Strikethrough"
      >
        <Strikethrough size={14} />
      </button>

      {/* Separator */}
      <div className="lexkit-floating-toolbar-separator" />

      {/* Block Format - Compact buttons for common formats */}
      {hasExtension('blockFormat') && (
        <>
          <button
            onClick={() => handleBlockFormatChange('p')}
            className={`lexkit-toolbar-button ${!activeStates.isH1 && !activeStates.isH2 && !activeStates.isH3 && !activeStates.isQuote && !activeStates.unorderedList && !activeStates.orderedList && !activeStates.isInCodeBlock ? 'active' : ''}`}
            title="Paragraph"
          >
            P
          </button>
          <button
            onClick={() => handleBlockFormatChange('h1')}
            className={`lexkit-toolbar-button ${activeStates.isH1 ? 'active' : ''}`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => handleBlockFormatChange('h2')}
            className={`lexkit-toolbar-button ${activeStates.isH2 ? 'active' : ''}`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            onClick={() => handleBlockFormatChange('h3')}
            className={`lexkit-toolbar-button ${activeStates.isH3 ? 'active' : ''}`}
            title="Heading 3"
          >
            H3
          </button>
          <button
            onClick={() => handleBlockFormatChange('quote')}
            className={`lexkit-toolbar-button ${activeStates.isQuote ? 'active' : ''}`}
            title="Quote"
          >
            <Quote size={14} />
          </button>

          {/* Code Block */}
          {hasExtension('code') && (
            <button
              onClick={() => commands.toggleCodeBlock()}
              className={`lexkit-toolbar-button ${activeStates.isInCodeBlock ? 'active' : ''}`}
              title="Code Block"
            >
              <Terminal size={14} />
            </button>
          )}

          {/* Separator */}
          <div className="lexkit-floating-toolbar-separator" />
        </>
      )}

      {/* Lists */}
      {hasExtension('list') && (
        <>
          <button
            onClick={() => commands.toggleUnorderedList()}
            className={`lexkit-toolbar-button ${activeStates.unorderedList ? 'active' : ''}`}
            title="Bullet List"
          >
            <List size={14} />
          </button>
          <button
            onClick={() => commands.toggleOrderedList()}
            className={`lexkit-toolbar-button ${activeStates.orderedList ? 'active' : ''}`}
            title="Numbered List"
          >
            <ListOrdered size={14} />
          </button>
        </>
      )}
    </div>,
    document.body
  );
}

// Toolbar Component
function Toolbar({
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

  const [showImageDropdown, setShowImageDropdown] = useState(false);
  const [showAlignDropdown, setShowAlignDropdown] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [tableConfig, setTableConfig] = useState<TableConfig>({
    rows: 3,
    columns: 3,
    includeHeaders: false
  });

  // Block format options
  const blockFormatOptions = [
    { value: 'p', label: 'Paragraph' },
    { value: 'h1', label: 'Heading 1' },
    { value: 'h2', label: 'Heading 2' },
    { value: 'h3', label: 'Heading 3' },
    { value: 'h4', label: 'Heading 4' },
    { value: 'h5', label: 'Heading 5' },
    { value: 'h6', label: 'Heading 6' },
    { value: 'quote', label: 'Quote' },
  ];

  // Get current block format
  const currentBlockFormat = activeStates.isH1 ? 'h1'
    : activeStates.isH2 ? 'h2'
    : activeStates.isH3 ? 'h3'
    : activeStates.isH4 ? 'h4'
    : activeStates.isH5 ? 'h5'
    : activeStates.isH6 ? 'h6'
    : activeStates.isQuote ? 'quote'
    : 'p';

  const handleBlockFormatChange = (value: string) => {
    if (value === 'p') commands.toggleParagraph();
    else if (value === 'h1') commands.toggleHeading('h1');
    else if (value === 'h2') commands.toggleHeading('h2');
    else if (value === 'h3') commands.toggleHeading('h3');
    else if (value === 'h4') commands.toggleHeading('h4');
    else if (value === 'h5') commands.toggleHeading('h5');
    else if (value === 'h6') commands.toggleHeading('h6');
    else if (value === 'quote') commands.toggleQuote();
  };

  const toolbar = (
    <div className="lexkit-toolbar">
      {/* Text Formatting Section */}
      <div className="lexkit-toolbar-section">
        {hasExtension('bold') && (
          <button
            onClick={() => commands.toggleBold()}
            className={`lexkit-toolbar-button ${activeStates.bold ? 'active' : ''}`}
            title="Bold (Ctrl+B)"
          >
            <Bold size={16} />
          </button>
        )}
        {hasExtension('italic') && (
          <button
            onClick={() => commands.toggleItalic()}
            className={`lexkit-toolbar-button ${activeStates.italic ? 'active' : ''}`}
            title="Italic (Ctrl+I)"
          >
            <Italic size={16} />
          </button>
        )}
        {hasExtension('underline') && (
          <button
            onClick={() => commands.toggleUnderline()}
            className={`lexkit-toolbar-button ${activeStates.underline ? 'active' : ''}`}
            title="Underline (Ctrl+U)"
          >
            <Underline size={16} />
          </button>
        )}
        {hasExtension('strikethrough') && (
          <button
            onClick={() => commands.toggleStrikethrough()}
            className={`lexkit-toolbar-button ${activeStates.strikethrough ? 'active' : ''}`}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
        )}
        <button
          onClick={() => commands.formatText('code')}
          className={`lexkit-toolbar-button ${activeStates.code ? 'active' : ''}`}
          title="Inline Code"
        >
          <Code size={16} />
        </button>
        {hasExtension('link') && (
          <button
            onClick={() => activeStates.isLink ? commands.removeLink() : commands.insertLink()}
            className={`lexkit-toolbar-button ${activeStates.isLink ? 'active' : ''}`}
            title={activeStates.isLink ? "Remove Link" : "Insert Link"}
          >
            {activeStates.isLink ? <Unlink size={16} /> : <Link size={16} />}
          </button>
        )}
      </div>

      {/* Block Format Section */}
      {hasExtension('blockFormat') && (
        <div className="lexkit-toolbar-section">
          <Select
            value={currentBlockFormat}
            onValueChange={handleBlockFormatChange}
            options={blockFormatOptions}
            placeholder="Format"
          />
          {hasExtension('code') && (
            <button
              onClick={() => commands.toggleCodeBlock()}
              className={`lexkit-toolbar-button ${activeStates.isInCodeBlock ? 'active' : ''}`}
              title="Code Block"
            >
              <Terminal size={16} />
            </button>
          )}
        </div>
      )}

      {/* List Section */}
      {hasExtension('list') && (
        <div className="lexkit-toolbar-section">
          <button
            onClick={() => commands.toggleUnorderedList()}
            className={`lexkit-toolbar-button ${activeStates.unorderedList ? 'active' : ''}`}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => commands.toggleOrderedList()}
            className={`lexkit-toolbar-button ${activeStates.orderedList ? 'active' : ''}`}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
        </div>
      )}

      {/* Horizontal Rule Section */}
      {hasExtension('horizontalRule') && (
        <div className="lexkit-toolbar-section">
          <button
            onClick={() => commands.insertHorizontalRule()}
            className="lexkit-toolbar-button"
            title="Insert Horizontal Rule"
          >
            <Minus size={16} />
          </button>
        </div>
      )}

      {/* Table Section */}
      {hasExtension('table') && (
        <div className="lexkit-toolbar-section">
          <button
            onClick={() => setShowTableDialog(true)}
            className="lexkit-toolbar-button"
            title="Insert Table (Ctrl+Shift+T)"
          >
            <Table size={16} />
          </button>
        </div>
      )}

      {/* Media Section */}
      {hasExtension('image') && (
        <div className="lexkit-toolbar-section">
          <Dropdown
            trigger={
              <button
                className={`lexkit-toolbar-button ${activeStates.imageSelected ? 'active' : ''}`}
                title="Insert Image"
              >
                <Image size={16} />
              </button>
            }
            isOpen={showImageDropdown}
            onOpenChange={setShowImageDropdown}
          >
            <button
              className="lexkit-dropdown-item"
              onClick={() => {
                handlers.insertImageFromUrl();
                setShowImageDropdown(false);
              }}
            >
              <Link size={16} />
              From URL
            </button>
            <button
              className="lexkit-dropdown-item"
              onClick={() => {
                handlers.insertImageFromFile();
                setShowImageDropdown(false);
              }}
            >
              <Upload size={16} />
              Upload File
            </button>
          </Dropdown>

          {/* Image Alignment when image is selected */}
          {activeStates.imageSelected && (
            <Dropdown
              trigger={
                <button className="lexkit-toolbar-button" title="Align Image">
                  <AlignCenter size={16} />
                </button>
              }
              isOpen={showAlignDropdown}
              onOpenChange={setShowAlignDropdown}
            >
              <button
                className="lexkit-dropdown-item"
                onClick={() => {
                  handlers.setImageAlignment('left');
                  setShowAlignDropdown(false);
                }}
              >
                <AlignLeft size={16} />
                Align Left
              </button>
              <button
                className="lexkit-dropdown-item"
                onClick={() => {
                  handlers.setImageAlignment('center');
                  setShowAlignDropdown(false);
                }}
              >
                <AlignCenter size={16} />
                Align Center
              </button>
              <button
                className="lexkit-dropdown-item"
                onClick={() => {
                  handlers.setImageAlignment('right');
                  setShowAlignDropdown(false);
                }}
              >
                <AlignRight size={16} />
                Align Right
              </button>
              <button
                className="lexkit-dropdown-item"
                onClick={() => {
                  handlers.setImageCaption();
                  setShowAlignDropdown(false);
                }}
              >
                <Type size={16} />
                Set Caption
              </button>
            </Dropdown>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlers.handleFileUpload}
            className="lexkit-file-input"
          />
        </div>
      )}

      {/* HTML Embed Section */}
      {hasExtension('htmlEmbed') && (
        <div className="lexkit-toolbar-section">
          <button
            onClick={() => commands.insertHTMLEmbed()}
            className={`lexkit-toolbar-button ${activeStates.isHTMLEmbedSelected ? 'active' : ''}`}
            title="Insert HTML Embed"
          >
            <FileCode size={16} />
          </button>
          {activeStates.isHTMLEmbedSelected && (
            <button
              onClick={() => commands.toggleHTMLPreview()}
              className="lexkit-toolbar-button"
              title="Toggle Preview/Edit"
            >
              {activeStates.isHTMLPreviewMode ? <Eye size={16} /> : <Pencil size={16} />}
            </button>
          )}
        </div>
      )}

      {/* History Section */}
      {hasExtension('history') && (
        <div className="lexkit-toolbar-section">
          <button
            onClick={() => commands.undo()}
            disabled={!activeStates.canUndo}
            className="lexkit-toolbar-button"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={16} />
          </button>
          <button
            onClick={() => commands.redo()}
            disabled={!activeStates.canRedo}
            className="lexkit-toolbar-button"
            title="Redo (Ctrl+Y)"
          >
            <Redo size={16} />
          </button>
        </div>
      )}

      {/* Custom Extension */}
      {hasExtension('myBlock') && commands.insertMyBlock && (
        <div className="lexkit-toolbar-section">
          <button
            onClick={() => commands.insertMyBlock({ text: 'Custom Block', color: 'red' })}
            className="lexkit-toolbar-button"
            title="Insert Custom Block"
            style={{ width: 'auto', padding: '0 8px', fontSize: '12px' }}
          >
            Custom
          </button>
        </div>
      )}

      {/* Command Palette */}
      <div className="lexkit-toolbar-section">
        <button
          onClick={onCommandPaletteOpen}
          className="lexkit-toolbar-button"
          title="Command Palette (Ctrl+K)"
        >
          <Command size={16} />
        </button>
      </div>

      {/* Theme Toggle */}
      <div className="lexkit-toolbar-section">
        <button
          onClick={toggleTheme}
          className="lexkit-toolbar-button"
          title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {toolbar}

      {/* Table Dialog */}
      <Dialog
        isOpen={showTableDialog}
        onClose={() => setShowTableDialog(false)}
        title="Insert Table"
      >
        <div className="lexkit-table-dialog">
          <div className="lexkit-form-group">
            <label htmlFor="table-rows">Rows:</label>
            <input
              id="table-rows"
              type="number"
              min="1"
              max="20"
              value={tableConfig.rows}
              onChange={(e) => setTableConfig(prev => ({ ...prev, rows: parseInt(e.target.value) || 1 }))}
              className="lexkit-input"
            />
          </div>
          <div className="lexkit-form-group">
            <label htmlFor="table-columns">Columns:</label>
            <input
              id="table-columns"
              type="number"
              min="1"
              max="20"
              value={tableConfig.columns}
              onChange={(e) => setTableConfig(prev => ({ ...prev, columns: parseInt(e.target.value) || 1 }))}
              className="lexkit-input"
            />
          </div>
          <div className="lexkit-form-group">
            <label className="lexkit-checkbox-label">
              <input
                type="checkbox"
                checked={tableConfig.includeHeaders || false}
                onChange={(e) => setTableConfig(prev => ({ ...prev, includeHeaders: e.target.checked }))}
                className="lexkit-checkbox"
              />
              Include headers
            </label>
          </div>
          <div className="lexkit-dialog-actions">
            <button
              onClick={() => setShowTableDialog(false)}
              className="lexkit-button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                commands.insertTable(tableConfig);
                setShowTableDialog(false);
              }}
              className="lexkit-button-primary"
            >
              Insert Table
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

// Mode Tabs Component
function ModeTabs({
  mode,
  onModeChange
}: {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
}) {
  return (
    <div className="lexkit-mode-tabs">
      <button
        className={`lexkit-mode-tab ${mode === 'visual' ? 'active' : ''}`}
        onClick={() => onModeChange('visual')}
      >
        Visual
      </button>
      <button
        className={`lexkit-mode-tab ${mode === 'html' ? 'active' : ''}`}
        onClick={() => onModeChange('html')}
      >
        HTML
      </button>
      <button
        className={`lexkit-mode-tab ${mode === 'markdown' ? 'active' : ''}`}
        onClick={() => onModeChange('markdown')}
      >
        Markdown
      </button>
    </div>
  );
}

// HTML Source View Component
function HTMLSourceView({
  htmlContent,
  onHtmlChange
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

// Markdown Source View Component
function MarkdownSourceView({
  markdownContent,
  onMarkdownChange
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
  isDark,
  toggleTheme,
  onReady
}: {
  className?: string;
  isDark: boolean;
  toggleTheme: () => void;
  onReady?: (methods: DefaultTemplateRef) => void;
}) {
  const { commands, hasExtension, activeStates, lexical: editor, stateQueries } = useEditor();
  const [mode, setMode] = useState<EditorMode>('visual');
  const [content, setContent] = useState({ html: '', markdown: '' });
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Use ref to store latest commands to avoid dependency issues
  const commandsRef = React.useRef(commands);

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
  }), []); // Empty dependency array - only create once

  // Register command palette commands and keyboard shortcuts
  useEffect(() => {
    if (!editor) return;

    // Register commands in the command palette
    const paletteCommands = commandsToCommandPaletteItems(commands);
    console.log('🎯 Registering command palette commands:', paletteCommands.length);
    paletteCommands.forEach(cmd => {
      commands.registerCommand(cmd);
    });

    // Override the command palette show command to use our local state
    const originalShowCommand = commands.showCommandPalette;
    (commands as any).showCommandPalette = () => setCommandPaletteOpen(true);

    // Register keyboard shortcuts
    const unregisterShortcuts = registerKeyboardShortcuts(commands, document.body);

    // Add Ctrl+K / Cmd+K shortcut for command palette
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Call onReady with methods immediately when editor is ready
    if (onReady) {
      console.log('🎉 Editor ready - calling onReady with methods');
      onReady(methods);
    }

    return () => {
      unregisterShortcuts();
      document.removeEventListener('keydown', handleKeyDown);
      // Restore original command
      (commands as any).showCommandPalette = originalShowCommand;
    };
  }, [editor, methods, onReady]);

  // Simple handlers - no debouncing needed
  const handleHtmlChange = (html: string) => {
    setContent(prev => ({ ...prev, html }));
  };

  const handleMarkdownChange = (markdown: string) => {
    setContent(prev => ({ ...prev, markdown }));
  };

  // Handle mode changes
  const handleModeChange = (newMode: EditorMode) => {
    // If leaving markdown mode, import the markdown content into the editor immediately
    if (mode === 'markdown' && newMode !== 'markdown' && editor && hasExtension('markdown')) {
      try {
        commands.importFromMarkdown(content.markdown, true);
      } catch (error) {
        console.error('Failed to import Markdown:', error);
      }
    }

    // If leaving HTML mode, import the HTML content into the editor
    if (mode === 'html' && newMode !== 'html' && editor && hasExtension('html')) {
      try {
        commands.importFromHTML(content.html);
      } catch (error) {
        console.error('Failed to import HTML:', error);
      }
    }

    // If entering markdown mode, sync the current editor content to markdown
    if (newMode === 'markdown' && mode !== 'markdown' && editor && hasExtension('markdown')) {
      try {
        const markdown = commands.exportToMarkdown();
        setContent(prev => ({ ...prev, markdown }));
      } catch (error) {
        console.error('Failed to export Markdown:', error);
      }
    }

    // If entering HTML mode, sync the current editor content to HTML
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



  return (
    <>
      <div className="lexkit-editor-header">
        <ModeTabs mode={mode} onModeChange={handleModeChange} />
        {mode === 'visual' && (
          <Toolbar
            commands={commands}
            hasExtension={hasExtension}
            activeStates={activeStates}
            isDark={isDark}
            toggleTheme={toggleTheme}
            onCommandPaletteOpen={() => setCommandPaletteOpen(true)}
          />
        )}
      </div>

      <div className="lexkit-editor">
        {mode === 'visual' ? (
          <>
            <RichTextPlugin
              contentEditable={<ContentEditable className="lexkit-content-editable" />}
              placeholder={<div className="lexkit-placeholder">Start typing...</div>}
              ErrorBoundary={ErrorBoundary}
            />
            <FloatingToolbarRenderer />
          </>
        ) : mode === 'html' ? (
          <HTMLSourceView
            htmlContent={content.html}
            onHtmlChange={handleHtmlChange}
          />
        ) : mode === 'markdown' ? (
          <MarkdownSourceView
            markdownContent={content.markdown}
            onMarkdownChange={handleMarkdownChange}
          />
        ) : null}
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        commands={commandsToCommandPaletteItems(commands)}
      />
    </>
  );
}

// Main Template Component - Truly Headless
interface DefaultTemplateProps {
  className?: string;
  onReady?: (methods: DefaultTemplateRef) => void; // Callback when editor is ready with methods
}

export const DefaultTemplate = React.forwardRef<DefaultTemplateRef, DefaultTemplateProps>(
  ({ className, onReady }, ref) => {
    const { theme: globalTheme } = useTheme();
    const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');
    const [editorMethods, setEditorMethods] = useState<DefaultTemplateRef | null>(null);

    // Initialize editor theme from global theme on mount
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
          // For testing, create object URL
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

    // Handle when editor is ready - store methods and expose via ref
    const handleEditorReady = React.useCallback((methods: DefaultTemplateRef) => {
      console.log('🎯 Editor ready - storing methods');
      setEditorMethods(methods);
      
      // Call parent callback with methods
      if (onReady) {
        console.log('📞 Calling parent onReady with methods');
        onReady(methods);
      }
    }, [onReady]);

    // Expose methods to parent via ref
    React.useImperativeHandle(ref, () => ({
      injectMarkdown: (content: string) => {
        if (editorMethods) {
          console.log('💉 Injecting markdown content via ref:', content.substring(0, 50) + '...');
          editorMethods.injectMarkdown(content);
        } else {
          console.log('❌ Cannot inject via ref - editor methods not available');
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
      <div className={`lexkit-editor-wrapper ${className || ''}`} data-editor-theme={editorTheme}>
        <Provider extensions={extensions}  >
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
