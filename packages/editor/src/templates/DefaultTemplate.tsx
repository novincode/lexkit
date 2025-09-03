import React from 'react';
import { useEditor } from '../core';
import { Extension, ExtensionCategory } from '@repo/editor/extensions';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => <>{children}</>;

interface DefaultTemplateProps {
  extensions?: Extension[];
  className?: string;
  enabledCategories?: ExtensionCategory[];
}

export function DefaultTemplate({ extensions: propExtensions = [], className, enabledCategories = [ExtensionCategory.Toolbar] }: DefaultTemplateProps) {
  const { extensions: contextExtensions, commands, t, editor, plugins, hasPlugin } = useEditor();
  const allExtensions = propExtensions.length > 0 ? propExtensions : contextExtensions;

  const toggleBold = () => commands.formatText('bold');
  const toggleItalic = () => commands.formatText('italic');
  const toggleUnorderedList = () => commands.toggleUnorderedList();
  const toggleOrderedList = () => commands.toggleOrderedList();
  const undo = () => commands.undo();

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="toolbar flex gap-2 mb-2">
        {hasPlugin('bold') && (
          <button onClick={toggleBold} className={`px-2 py-1 border rounded ${commands.isActive('bold') ? 'bg-blue-500 text-white' : ''}`}>
            {t('bold.label')}
          </button>
        )}
        {hasPlugin('italic') && (
          <button onClick={toggleItalic} className={`px-2 py-1 border rounded ${commands.isActive('italic') ? 'bg-blue-500 text-white' : ''}`}>
            {t('italic.label')}
          </button>
        )}
        {hasPlugin('list') && (
          <>
            <button onClick={toggleUnorderedList} className="px-2 py-1 border rounded">
              {t('list.bulleted')}
            </button>
            <button onClick={toggleOrderedList} className="px-2 py-1 border rounded">
              {t('list.numbered')}
            </button>
          </>
        )}
        <button onClick={undo} className="px-2 py-1 border rounded">
          Undo
        </button>
        {/* Add more buttons as needed */}
      </div>
      {/* Editor Content */}
      <div className="editor-content">
        <RichTextPlugin
          contentEditable={<ContentEditable className="min-h-32 p-2 border rounded" />}
          placeholder={<div className="text-gray-500">Start typing...</div>}
          ErrorBoundary={ErrorBoundary}
        />
      </div>
      <HistoryPlugin />
      {plugins}
      
    </div>
  );
}
