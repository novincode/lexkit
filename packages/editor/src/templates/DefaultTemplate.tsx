import React from 'react';
import { useEditor } from '../core';
import { Extension, ExtensionCategory } from '@repo/editor/extensions';

interface DefaultTemplateProps {
  extensions?: Extension[];
  className?: string;
  enabledCategories?: ExtensionCategory[];
}

export function DefaultTemplate({ extensions: propExtensions = [], className, enabledCategories = [ExtensionCategory.Toolbar] }: DefaultTemplateProps) {
  const { extensions: contextExtensions } = useEditor();
  const allExtensions = propExtensions.length > 0 ? propExtensions : contextExtensions;

  return (
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
  );
}
