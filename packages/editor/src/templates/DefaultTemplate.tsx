import React from 'react';
import { EditorProvider } from '../core';
import { Extension, ExtensionCategory } from '@repo/editor/extensions';

interface DefaultTemplateProps {
  extensions?: Extension[];
  className?: string;
  enabledCategories?: ExtensionCategory[];
}

export function DefaultTemplate({ extensions = [], className, enabledCategories = [ExtensionCategory.Toolbar] }: DefaultTemplateProps) {
  // Default extensions can be lazy loaded here if not provided
  const defaultExtensions: Extension[] = []; // Add default extensions if needed
  const allExtensions = [...defaultExtensions, ...extensions];

  return (
    <EditorProvider extensions={allExtensions}>
      <div className={className}>
        {/* Toolbar */}
        <div className="toolbar">
          {allExtensions
            .filter(ext => enabledCategories.some(cat => ext.category.includes(cat)))
            .map((ext, i) => {
              const UI = ext.getUI?.();
              return UI ? <UI key={ext.name} /> : null;
            })}
        </div>
        {/* Content will be rendered by RichTextPlugin */}
      </div>
    </EditorProvider>
  );
}
