import React from 'react';
import { useEditor } from '../core';
import { Extension, ExtensionCategory } from '@repo/editor/extensions';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';

interface DefaultTemplateProps {
  extensions?: Extension[];
  className?: string;
  enabledCategories?: ExtensionCategory[];
}

export function DefaultTemplate({ extensions: propExtensions = [], className, enabledCategories = [ExtensionCategory.Toolbar] }: DefaultTemplateProps) {
  const { extensions: contextExtensions, commands, t, editor } = useEditor();
  const allExtensions = propExtensions.length > 0 ? propExtensions : contextExtensions;

  const toggleBold = () => commands.formatText('bold');
  const toggleItalic = () => commands.formatText('italic');
  const undo = () => commands.undo();

  const insertUnorderedList = () => {
    editor?.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const insertOrderedList = () => {
    editor?.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="toolbar flex gap-2 mb-2">
        <button onClick={toggleBold} className={`px-2 py-1 border rounded ${commands.isActive('bold') ? 'bg-blue-500 text-white' : ''}`}>
          {t('bold.label')}
        </button>
        <button onClick={toggleItalic} className={`px-2 py-1 border rounded ${commands.isActive('italic') ? 'bg-blue-500 text-white' : ''}`}>
          {t('italic.label')}
        </button>
        <button onClick={insertUnorderedList} className="px-2 py-1 border rounded">
          {t('list.bulleted')}
        </button>
        <button onClick={insertOrderedList} className="px-2 py-1 border rounded">
          {t('list.numbered')}
        </button>
        <button onClick={undo} className="px-2 py-1 border rounded">
          Undo
        </button>
        {/* Add more buttons as needed */}
      </div>
      {/* Content will be rendered by RichTextPlugin */}
    </div>
  );
}
