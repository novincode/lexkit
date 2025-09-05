'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  htmlEmbedExtension
} from '@lexkit/editor/extensions';
import { commandPaletteExtension, floatingToolbarExtension } from '@lexkit/editor/extensions/core';
import { ALL_MARKDOWN_TRANSFORMERS } from '@lexkit/editor/extensions/export/transformers';
import { MyCustomExtension } from '../MyCustomExtension';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { $getSelection, $isNodeSelection, $getRoot } from 'lexical';
import { ImageNode } from '@lexkit/editor/extensions/media';
import { defaultTheme } from './theme';
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
  Type,
  FileCode,
  Eye,
  Pencil,
  Table
} from 'lucide-react';
import { Select, Dropdown, Dialog } from './components';
import { createEditorSystem } from '@lexkit/editor';
import type { ExtractCommands, ExtractStateQueries, BaseCommands } from '@lexkit/editor/extensions/types';
import { LexicalEditor } from 'lexical';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('🚨 Editor Error Boundary caught error:', error);
    return (
      <div style={{
        color: 'red',
        border: '1px solid red',
        padding: '20px',
        backgroundColor: '#ffe6e6',
        borderRadius: '4px',
        margin: '10px 0'
      }}>
        <h3>Editor Error</h3>
        <p>{String(error)}</p>
        <p>Please refresh the page and try again.</p>
      </div>
    );
  }
};

// Define the extensions array as a const to maintain literal types
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
  codeExtension,
  codeFormatExtension,
  htmlExtension,
  markdownExtension.configure({
    customTransformers: ALL_MARKDOWN_TRANSFORMERS
  }),
  htmlEmbedExtension,
  MyCustomExtension
] as const;

// Create a typed editor system for these specific extensions
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// Extract the types for our specific extensions
type EditorCommands = BaseCommands & ExtractCommands<typeof extensions>;
type EditorStateQueries = ExtractStateQueries<typeof extensions>;
type ExtensionNames = typeof extensions[number]['name'];

// Editor Mode Types
type EditorMode = 'visual' | 'html' | 'markdown';

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

// Toolbar Component
function Toolbar({ 
  commands, 
  hasExtension, 
  activeStates, 
  isDark, 
  toggleTheme 
}: {
  commands: EditorCommands;
  hasExtension: (name: ExtensionNames) => boolean;
  activeStates: EditorStateQueries;
  isDark: boolean;
  toggleTheme: () => void;
}) {
  const { commands: editorCommands, lexical: editor } = useEditor();
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

// Main Editor Content Component
function EditorContent({ 
  className, 
  isDark, 
  toggleTheme 
}: { 
  className?: string; 
  isDark: boolean; 
  toggleTheme: () => void; 
}) {
  const { commands, hasExtension, activeStates, lexical: editor } = useEditor();
  const [mode, setMode] = useState<EditorMode>('visual');
  const [content, setContent] = useState({ html: '', markdown: '' });

  // Register command palette commands and keyboard shortcuts
  useEffect(() => {
    if (!editor) return;

    return () => {
      // Cleanup
    };
  }, [editor]);

  // Update theme dynamically
  useEffect(() => {
    if (editor) {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, editor]);

  // Sync content when editor changes (only for non-markdown modes)
  useEffect(() => {
    if (!editor || mode === 'markdown') return;

    const syncContent = () => {
      if (hasExtension('html')) {
        try {
          const html = commands.exportToHTML();
          setContent(prev => ({ ...prev, html }));
        } catch (error) {
          console.error('Failed to export HTML:', error);
        }
      }
      if (hasExtension('markdown')) {
        try {
          const markdown = commands.exportToMarkdown();
          setContent(prev => ({ ...prev, markdown }));
        } catch (error) {
          console.error('Failed to export Markdown:', error);
        }
      }
    };

    const unregister = editor.registerUpdateListener(() => syncContent());
    syncContent(); // Initial sync

    return unregister;
  }, [editor, hasExtension, commands, mode]);

  // Simple handlers - no debouncing needed
  const handleHtmlChange = (html: string) => {
    setContent(prev => ({ ...prev, html }));
    if (editor && hasExtension('html')) {
      try {
        commands.importFromHTML(html);
      } catch (error) {
        console.error('Failed to import HTML:', error);
      }
    }
  };

  const handleMarkdownChange = (markdown: string) => {
    setContent(prev => ({ ...prev, markdown }));
    if (editor && hasExtension('markdown')) {
      try {
        commands.importFromMarkdown(markdown);
      } catch (error) {
        console.error('Failed to import Markdown:', error);
      }
    }
  };

  // Handle mode changes
  const handleModeChange = (newMode: EditorMode) => {
    // If leaving markdown mode, sync the markdown content first
    if (mode === 'markdown' && newMode !== 'markdown' && editor && hasExtension('markdown')) {
      try {
        const markdown = commands.exportToMarkdown();
        setContent(prev => ({ ...prev, markdown }));
      } catch (error) {
        console.error('Failed to export Markdown:', error);
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
          />
        )}
      </div>
      
      <div className="lexkit-editor">
        {mode === 'visual' ? (
          <RichTextPlugin
            contentEditable={<ContentEditable className="lexkit-content-editable" />}
            placeholder={<div className="lexkit-placeholder">Start typing...</div>}
            ErrorBoundary={ErrorBoundary}
          />
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
        <HistoryPlugin />
      </div>
    </>
  );
}

// Main Template Component
interface DefaultTemplateProps {
  className?: string;
}

export function DefaultTemplate({ className }: DefaultTemplateProps) {
  const [isDark, setIsDark] = useState(false);

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
    setIsDark(!isDark);
  };

  return (
    <div className={`lexkit-editor-wrapper ${className || ''}`}>
      <Provider extensions={extensions} config={{ theme: defaultTheme }}>
        <EditorContent className={className} isDark={isDark} toggleTheme={toggleTheme} />
      </Provider>
    </div>
  );
}
