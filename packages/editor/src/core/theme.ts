import { EditorThemeClasses } from "lexical";
import React from "react";

/**
 * Enhanced theme type that extends Lexical's EditorThemeClasses
 * with better TypeScript support and additional properties
 */
export interface LexKitTheme extends EditorThemeClasses {
  // Custom properties for LexKit
  toolbar?: {
    button?: string;
    buttonActive?: string;
    buttonDisabled?: string;
    group?: string;
  };
  container?: string;
  wrapper?: string;
  contextMenu?: {
    container?: string;
    item?: string;
    itemDisabled?: string;
  };
  draggable?: {
    handle?: string;
    handleActive?: string;
    handleHover?: string;
    handleDragging?: string;
    blockDragging?: string;
    dropIndicator?: string;
    upButton?: string;
    downButton?: string;
    blockIsDragging?: string;
    buttonStack?: string;
    styles?: {
      handle?: React.CSSProperties;
      handleActive?: React.CSSProperties;
      handleHover?: React.CSSProperties;
      handleDragging?: React.CSSProperties;
      blockDragging?: React.CSSProperties;
      dropIndicator?: React.CSSProperties;
      upButton?: React.CSSProperties;
      downButton?: React.CSSProperties;
      blockIsDragging?: React.CSSProperties;
      buttonStack?: React.CSSProperties;
    };
  };
  floatingToolbar?: {
    container?: string;
    button?: string;
    buttonActive?: string;
    styles?: {
      container?: React.CSSProperties;
      button?: React.CSSProperties;
      buttonActive?: React.CSSProperties;
    };
  };
  htmlEmbed?: {
    container?: string;
    preview?: string;
    editor?: string;
    textarea?: string;
    toggle?: string;
    content?: string;
    styles?: {
      container?: React.CSSProperties;
      preview?: React.CSSProperties;
      editor?: React.CSSProperties;
      textarea?: React.CSSProperties;
      toggle?: React.CSSProperties;
      content?: React.CSSProperties;
    };
  };
  // Styles for inline CSS properties
  styles?: {
    toolbar?: {
      button?: React.CSSProperties;
      buttonActive?: React.CSSProperties;
      buttonDisabled?: React.CSSProperties;
      group?: React.CSSProperties;
    };
    container?: React.CSSProperties;
    wrapper?: React.CSSProperties;
    draggable?: {
      handle?: React.CSSProperties;
      handleHover?: React.CSSProperties;
      handleDragging?: React.CSSProperties;
      blockDragging?: React.CSSProperties;
      dropIndicator?: React.CSSProperties;
      upButton?: React.CSSProperties;
      downButton?: React.CSSProperties;
      blockIsDragging?: React.CSSProperties;
      buttonStack?: React.CSSProperties;
    };
    floatingToolbar?: {
      container?: React.CSSProperties;
      button?: React.CSSProperties;
      buttonActive?: React.CSSProperties;
    };
    htmlEmbed?: {
      container?: React.CSSProperties;
      preview?: React.CSSProperties;
      editor?: React.CSSProperties;
      textarea?: React.CSSProperties;
      toggle?: React.CSSProperties;
      content?: React.CSSProperties;
    };
  };
}

/**
 * Default LexKit theme with sensible defaults
 */
export const defaultLexKitTheme: LexKitTheme = {
  // Lexical's built-in theme properties
  text: {
    bold: "lexkit-text-bold",
    italic: "lexkit-text-italic",
    underline: "lexkit-text-underline",
    strikethrough: "lexkit-text-strikethrough",
    code: "lexkit-text-code",
  },
  list: {
    ul: "lexkit-list-ul",
    ol: "lexkit-list-ol",
    listitem: "lexkit-list-li",
    nested: {
      list: "lexkit-list-nested",
      listitem: "lexkit-list-nested-item",
    },
  },
  quote: "lexkit-quote",
  heading: {
    h1: "lexkit-heading-h1",
    h2: "lexkit-heading-h2",
    h3: "lexkit-heading-h3",
    h4: "lexkit-heading-h4",
    h5: "lexkit-heading-h5",
    h6: "lexkit-heading-h6",
  },
  paragraph: "lexkit-paragraph",
  link: "lexkit-link",
  image: "lexical-image",
  hr: "lexkit-hr",
  table: "lexkit-table",
  tableRow: "lexkit-table-row",
  tableCell: "lexkit-table-cell",
  tableCellHeader: "lexkit-table-cell-header",
  code: "lexkit-code-block",
  codeHighlight: {
    atrule: "lexkit-code-atrule",
    attr: "lexkit-code-attr",
    boolean: "lexkit-code-boolean",
    builtin: "lexkit-code-builtin",
    cdata: "lexkit-code-cdata",
    char: "lexkit-code-char",
    class: "lexkit-code-class",
    "class-name": "lexkit-code-class-name",
    comment: "lexkit-code-comment",
    constant: "lexkit-code-constant",
    deleted: "lexkit-code-deleted",
    doctype: "lexkit-code-doctype",
    entity: "lexkit-code-entity",
    function: "lexkit-code-function",
    important: "lexkit-code-important",
    inserted: "lexkit-code-inserted",
    keyword: "lexkit-code-keyword",
    namespace: "lexkit-code-namespace",
    number: "lexkit-code-number",
    operator: "lexkit-code-operator",
    prolog: "lexkit-code-prolog",
    property: "lexkit-code-property",
    punctuation: "lexkit-code-punctuation",
    regex: "lexkit-code-regex",
    selector: "lexkit-code-selector",
    string: "lexkit-code-string",
    symbol: "lexkit-code-symbol",
    tag: "lexkit-code-tag",
    url: "lexkit-code-url",
    variable: "lexkit-code-variable",
  },

  // Custom LexKit properties
  toolbar: {
    button: "lexkit-toolbar-button",
    buttonActive: "lexkit-toolbar-button-active",
    buttonDisabled: "lexkit-toolbar-button-disabled",
    group: "lexkit-toolbar-group",
  },
  container: "lexkit-editor-container",
  wrapper: "lexkit-editor-wrapper",
  editor: "lexkit-editor",
  contentEditable: "lexkit-content-editable",
  contextMenu: {
    container: "lexkit-context-menu",
    item: "lexkit-context-menu-item",
    itemDisabled: "lexkit-context-menu-item-disabled",
  },
  draggable: {
    handle: "lexkit-draggable-handle",
    handleActive: "lexkit-draggable-handle-active",
    handleHover: "lexkit-draggable-handle-hover",
    handleDragging: "lexkit-draggable-handle-dragging",
    blockDragging:
      "lexkit-draggable-block-dragging opacity-50 transition-opacity duration-200",
    dropIndicator: "lexkit-draggable-drop-indicator",
    upButton: "lexkit-draggable-up-button",
    downButton: "lexkit-draggable-down-button",
    blockIsDragging: "lexkit-draggable-block-is-dragging",
    buttonStack: "lexkit-draggable-button-stack",
  },
  floatingToolbar: {
    container: "lexkit-floating-toolbar",
    button: "lexkit-floating-toolbar-button",
    buttonActive: "lexkit-floating-toolbar-button-active",
  },
  htmlEmbed: {
    container: "lexkit-html-embed-container",
    preview: "lexkit-html-embed-preview",
    editor: "lexkit-html-embed-editor",
    textarea: "lexkit-html-embed-textarea",
    toggle: "lexkit-html-embed-toggle",
    content: "lexkit-html-embed-content",
  },
  richText: {
    contentEditable: "lexkit-content-editable",
    placeholder: "lexkit-placeholder",
  },
};

/**
 * Helper function to merge themes
 */
export function mergeThemes(
  baseTheme: LexKitTheme,
  overrideTheme: Partial<LexKitTheme>,
): LexKitTheme {
  return {
    ...baseTheme,
    ...overrideTheme,
    text: {
      ...baseTheme.text,
      ...overrideTheme.text,
    },
    list: {
      ...baseTheme.list,
      ...overrideTheme.list,
      nested: {
        ...baseTheme.list?.nested,
        ...overrideTheme.list?.nested,
      },
    },
    heading: {
      ...baseTheme.heading,
      ...overrideTheme.heading,
    },
    codeHighlight: {
      ...baseTheme.codeHighlight,
      ...overrideTheme.codeHighlight,
    },
    toolbar: {
      ...baseTheme.toolbar,
      ...overrideTheme.toolbar,
    },
    draggable: {
      ...baseTheme.draggable,
      ...overrideTheme.draggable,
      styles: {
        ...baseTheme.draggable?.styles,
        ...overrideTheme.draggable?.styles,
      },
    },
    floatingToolbar: {
      ...baseTheme.floatingToolbar,
      ...overrideTheme.floatingToolbar,
      styles: {
        ...baseTheme.floatingToolbar?.styles,
        ...overrideTheme.floatingToolbar?.styles,
      },
    },
    htmlEmbed: {
      ...baseTheme.htmlEmbed,
      ...overrideTheme.htmlEmbed,
      styles: {
        ...baseTheme.htmlEmbed?.styles,
        ...overrideTheme.htmlEmbed?.styles,
      },
    },
    richText: {
      ...baseTheme.richText,
      ...overrideTheme.richText,
    },
    styles: {
      toolbar: {
        ...baseTheme.styles?.toolbar,
        ...overrideTheme.styles?.toolbar,
      },
      draggable: {
        ...baseTheme.styles?.draggable,
        ...overrideTheme.styles?.draggable,
      },
      floatingToolbar: {
        ...baseTheme.styles?.floatingToolbar,
        ...overrideTheme.styles?.floatingToolbar,
      },
      htmlEmbed: {
        ...baseTheme.styles?.htmlEmbed,
        ...overrideTheme.styles?.htmlEmbed,
      },
      ...overrideTheme.styles,
    },
  };
}

/**
 * Type guard to check if a theme is a LexKitTheme
 */
export function isLexKitTheme(theme: any): theme is LexKitTheme {
  return theme && typeof theme === "object";
}
