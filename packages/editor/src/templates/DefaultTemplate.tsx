import React from 'react';
import { EditorProvider } from '../core';
import { BoldExtension } from '../extensions';

interface DefaultTemplateProps {
  extensions?: any[];
  className?: string;
}

export function DefaultTemplate({ extensions = [], className }: DefaultTemplateProps) {
  const allExtensions = [BoldExtension, ...extensions];

  return (
    <EditorProvider extensions={allExtensions}>
      <div className={className}>
        {/* Toolbar */}
        <div className="toolbar">
          {allExtensions.map((ext, i) => (
            <React.Fragment key={i}>
              {ext.UI && <ext.UI />}
            </React.Fragment>
          ))}
        </div>
        {/* Content will be rendered by RichTextPlugin */}
      </div>
    </EditorProvider>
  );
}
