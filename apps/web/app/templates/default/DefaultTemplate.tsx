'use client'
import React, { useState, useEffect } from 'react';
import {  boldExtension, italicExtension, listExtension, historyExtension, imageExtension } from '@repo/editor/extensions';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { defaultTheme } from './theme';
import './styles.css';
import { Bold, Italic, List, ListOrdered, Undo, Redo, Sun, Moon, Image, AlignLeft, AlignCenter, AlignRight, Edit, Upload, Link } from 'lucide-react';
import { createEditorSystem } from '@repo/editor';
import type { ExtractCommands, ExtractStateQueries, BaseCommands } from '@repo/editor/extensions/types';

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
const extensions = [boldExtension, italicExtension, listExtension, historyExtension, imageExtension] as const;

// Create a typed editor system for these specific extensions
const { Provider, useEditor } = createEditorSystem<typeof extensions>();

// Extract the types for our specific extensions
type EditorCommands = BaseCommands & ExtractCommands<typeof extensions>;
type EditorStateQueries = ExtractStateQueries<typeof extensions>;

function DecoratorPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    console.log('🛠️ DecoratorPlugin initialized');
    // Log when decorator nodes are rendered
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const nodes = $getRoot().getChildren();
        nodes.forEach(node => {
          if (node.getType() === 'image') {
            console.log('🎨 Found ImageNode in state, should render:', node);
          }
        });
      });
    });
    return unregister;
  }, [editor]);
  return null;
}

function EditorContent({ className, isDark, toggleTheme }: { className?: string; isDark: boolean; toggleTheme: () => void }) {
  const { commands, hasExtension, activeStates, lexical: editor } = useEditor();

  // Update theme dynamically without resetting editor
  useEffect(() => {
    if (editor) {
      // Update the document theme attribute
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }, [isDark, editor]);

  // Catch global errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const [showImageMenu, setShowImageMenu] = useState(false);

  const handleInsertImageFromUrl = () => {
    const src = prompt('Enter image URL:');
    if (!src) return;
    const alt = prompt('Enter alt text:') || '';
    const caption = prompt('Enter caption (optional):') || undefined;
    console.log('Inserting image from URL:', { src, alt, caption });
    commands.insertImage({ src, alt, caption });
    setShowImageMenu(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && imageExtension.config.uploadHandler) {
      try {
        const src = await imageExtension.config.uploadHandler(file);
        console.log('Inserting uploaded image:', { src, alt: file.name });
        commands.insertImage({ src, alt: file.name, file });
      } catch (error) {
        alert('Failed to upload image');
      }
    } else if (file) {
      // Fallback: create object URL for local preview
      const src = URL.createObjectURL(file);
      console.log('Inserting local image:', { src, alt: file.name });
      commands.insertImage({ src, alt: file.name, file });
    }
    setShowImageMenu(false);
    // Reset file input
    e.target.value = '';
  };

  const handleSetCaption = () => {
    if (activeStates.imageSelected) {
      const newCaption = prompt('Enter new caption:') || '';
      commands.setImageCaption(newCaption);
    }
  };

  return (
    <>
      <Toolbar 
        commands={commands} 
        hasExtension={hasExtension} 
        activeStates={activeStates} 
        isDark={isDark} 
        toggleTheme={toggleTheme}
        showImageMenu={showImageMenu}
        setShowImageMenu={setShowImageMenu}
        handleInsertImageFromUrl={handleInsertImageFromUrl}
        handleFileUpload={handleFileUpload}
        handleSetCaption={handleSetCaption}
      />
      <div className={defaultTheme.editor}>
        <RichTextPlugin
          contentEditable={<ContentEditable className={defaultTheme.contentEditable} />}
          placeholder={<div className="lexkit-placeholder">Start typing...</div>}
          ErrorBoundary={ErrorBoundary}
        />
        <HistoryPlugin />
        <DecoratorPlugin />
      </div>
    </>
  );
}

function Toolbar({ 
  commands, 
  hasExtension, 
  activeStates, 
  isDark, 
  toggleTheme, 
  showImageMenu, 
  setShowImageMenu, 
  handleInsertImageFromUrl, 
  handleFileUpload, 
  handleSetCaption 
}: {
  commands: EditorCommands;
  hasExtension: (name: "bold" | "italic" | "list" | "history" | "image") => boolean;
  activeStates: EditorStateQueries;
  isDark: boolean;
  toggleTheme: () => void;
  showImageMenu: boolean;
  setShowImageMenu: (show: boolean) => void;
  handleInsertImageFromUrl: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSetCaption: () => void;
}) {

  return (
    <div className={defaultTheme.toolbar}>
      {hasExtension('bold') && (
        <button onClick={() => commands.toggleBold()} className={activeStates.bold ? 'active' : ''} title="Bold">
          <Bold size={20} />
        </button>
      )}
      {hasExtension('italic') && (
        <button onClick={() => commands.toggleItalic()} className={activeStates.italic ? 'active' : ''} title="Italic">
          <Italic size={20} />
        </button>
      )}
      {hasExtension('list') && (
        <>
          <button onClick={() => commands.toggleUnorderedList()} className={activeStates.unorderedList ? 'active' : ''} title="Bulleted List">
            <List size={20} />
          </button>
          <button onClick={() => commands.toggleOrderedList()} className={activeStates.orderedList ? 'active' : ''} title="Numbered List">
            <ListOrdered size={20} />
          </button>
        </>
      )}
      {hasExtension('image') && (
        <div className="image-menu-container">
          <button 
            onClick={() => setShowImageMenu(!showImageMenu)} 
            className={activeStates.imageSelected ? 'active' : ''} 
            title="Insert Image"
          >
            <Image size={20} />
          </button>
          {showImageMenu && (
            <div className="image-dropdown">
              <button onClick={handleInsertImageFromUrl} title="Insert from URL">
                <Link size={16} />
                <span>From URL</span>
              </button>
              <label className="file-upload-button" title="Upload from computer">
                <Upload size={16} />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}
          {activeStates.imageSelected && (
            <>
              <button
                onClick={() => commands.setImageAlignment('left')}
                className={activeStates.isImageAlignedLeft ? 'active' : ''}
                title="Align Left"
              >
                <AlignLeft size={20} />
              </button>
              <button
                onClick={() => commands.setImageAlignment('center')}
                className={activeStates.isImageAlignedCenter ? 'active' : ''}
                title="Align Center"
              >
                <AlignCenter size={20} />
              </button>
              <button
                onClick={() => commands.setImageAlignment('right')}
                className={activeStates.isImageAlignedRight ? 'active' : ''}
                title="Align Right"
              >
                <AlignRight size={20} />
              </button>
              <button onClick={handleSetCaption} title="Edit Caption">
                <Edit size={20} />
              </button>
            </>
          )}
        </div>
      )}
      {hasExtension('history') && (
        <>
          <button onClick={() => commands.undo()} disabled={!activeStates.canUndo} className={activeStates.canUndo ? '' : 'disabled'} title="Undo">
            <Undo size={20} />
          </button>
          <button onClick={() => commands.redo()} disabled={!activeStates.canRedo} className={activeStates.canRedo ? '' : 'disabled'} title="Redo">
            <Redo size={20} />
          </button>
        </>
      )}
      <button onClick={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'}>
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  );
}

interface DefaultTemplateProps {
  className?: string;
}

export function DefaultTemplate({ className }: DefaultTemplateProps) {
  const [isDark, setIsDark] = useState(false);

  // Configure image extension with upload handler
  useEffect(() => {
    console.log('🔧 Configuring image extension...');
    imageExtension.configure({
      uploadHandler: async (file: File) => {
        console.log('📤 Upload handler called with file:', file.name, 'size:', file.size);
        // For testing, create object URL
        const objectUrl = URL.createObjectURL(file);
        console.log('🔗 Created object URL:', objectUrl);
        return objectUrl;
      },
      defaultAlignment: 'center'
    });
    console.log('✅ Image extension configured');
  }, []);

  // Handle theme change without causing re-renders that affect the editor
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={`lexkit-editor-wrapper ${className || ''}`} style={{ width: '100%',  display: 'flex', flexDirection: 'column' }}>
      <Provider extensions={extensions} config={{ theme: defaultTheme }}>
        <div style={{ flex: 1, display: 'flex',maxHeight:'100vh', flexDirection: 'column', position: 'relative' }}>
          <EditorContent className={className} isDark={isDark} toggleTheme={toggleTheme} />
        </div>
      </Provider>
    </div>
  );
}
