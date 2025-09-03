'use client'
import React, { useState, useEffect, act } from 'react';
import {  boldExtension, italicExtension, listExtension, historyExtension, imageExtension } from '@repo/editor/extensions';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { defaultTheme } from './theme';
import './styles.css';
import { Bold, Italic, List, ListOrdered, Undo, Redo, Sun, Moon, Image, AlignLeft, AlignCenter, AlignRight, Edit, Upload, Link } from 'lucide-react';
import { createEditorSystem } from '@repo/editor';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface DefaultTemplateProps {
  className?: string;
}

export function DefaultTemplate({ className }: DefaultTemplateProps) {
  const extensions = [boldExtension, italicExtension, listExtension, historyExtension, imageExtension] as const;
  const { Provider, useEditor } = createEditorSystem<typeof extensions>();
  const [isDark, setIsDark] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showImageMenu && !(event.target as Element).closest('.image-menu-container')) {
        setShowImageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showImageMenu]);

  function Toolbar() {
    const { commands, hasExtension, activeStates } = useEditor();

    const handleInsertImageFromUrl = () => {
      const src = prompt('Enter image URL:');
      if (!src) return;
      const alt = prompt('Enter alt text:') || '';
      const caption = prompt('Enter caption (optional):') || undefined;
      commands.insertImage({ src, alt, caption });
      setShowImageMenu(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && imageExtension.config.uploadHandler) {
        try {
          const src = await imageExtension.config.uploadHandler(file);
          commands.insertImage({ src, alt: file.name, file });
        } catch (error) {
          alert('Failed to upload image');
        }
      } else if (file) {
        // Fallback: create object URL for local preview
        const src = URL.createObjectURL(file);
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
        <button onClick={() => setIsDark(!isDark)} title={isDark ? 'Light Mode' : 'Dark Mode'}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    );
  }

  return (
    <div className={`lexkit-editor-wrapper ${className || ''}`} style={{ width: '100%',  display: 'flex', flexDirection: 'column' }}>
      <Provider extensions={extensions} config={{ theme: defaultTheme }}>
        <div style={{ flex: 1, display: 'flex',maxHeight:'100vh', flexDirection: 'column', position: 'relative' }}>
          <Toolbar />
          <div className={defaultTheme.editor}>
            <RichTextPlugin
              contentEditable={<ContentEditable className={defaultTheme.contentEditable} />}
              placeholder={<div className="lexkit-placeholder">Start typing...</div>}
              ErrorBoundary={ErrorBoundary}
            />
          </div>
        </div>
      </Provider>
    </div>
  );
}
