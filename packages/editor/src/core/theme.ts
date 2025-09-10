import { EditorThemeClasses } from 'lexical'

/**
 * Enhanced theme type that extends Lexical's EditorThemeClasses
 * with better TypeScript support and additional properties
 */
export interface LexKitTheme extends EditorThemeClasses {
  // Custom properties for LexKit
  toolbar?: {
    button?: string
    buttonActive?: string
    buttonDisabled?: string
    group?: string
  }
  container?: string
  wrapper?: string
  draggable?: {
    handle?: string
    handleHover?: string
    handleDragging?: string
    blockDragging?: string
    dropIndicator?: string
    upButton?: string
    downButton?: string
    blockIsDragging?: string
  }
}

/**
 * Default LexKit theme with sensible defaults
 */
export const defaultLexKitTheme: LexKitTheme = {
  // Lexical's built-in theme properties
  text: {
    bold: 'lexkit-text-bold',
    italic: 'lexkit-text-italic',
    underline: 'lexkit-text-underline',
    strikethrough: 'lexkit-text-strikethrough',
    underlineStrikethrough: 'lexkit-text-underline-strikethrough',
    code: 'lexkit-text-code',
  },
  list: {
    ul: 'lexkit-list-ul',
    ol: 'lexkit-list-ol',
    listitem: 'lexkit-list-item',
    nested: {
      list: 'lexkit-list-nested',
      listitem: 'lexkit-list-nested-item',
    },
  },
  quote: 'lexkit-quote',
  heading: {
    h1: 'lexkit-heading-h1',
    h2: 'lexkit-heading-h2',
    h3: 'lexkit-heading-h3',
    h4: 'lexkit-heading-h4',
    h5: 'lexkit-heading-h5',
    h6: 'lexkit-heading-h6',
  },
  paragraph: 'lexkit-paragraph',
  link: 'lexkit-link',
  image: 'lexkit-image',
  hr: 'lexkit-hr',
  table: 'lexkit-table',
  tableRow: 'lexkit-table-row',
  tableCell: 'lexkit-table-cell',
  tableCellHeader: 'lexkit-table-cell-header',
  code: "lexkit-code-block",

  // Custom LexKit properties
  toolbar: {
    button: 'lexkit-toolbar-button',
    buttonActive: 'lexkit-toolbar-button-active',
    buttonDisabled: 'lexkit-toolbar-button-disabled',
    group: 'lexkit-toolbar-group'
  },
  container: 'lexkit-editor-container',
  wrapper: 'lexkit-editor-wrapper',
  draggable: {
    handle: 'lexkit-draggable-handle',
    handleHover: 'lexkit-draggable-handle-hover',
    handleDragging: 'lexkit-draggable-handle-dragging',
    blockDragging: 'lexkit-draggable-block-dragging opacity-50 transition-opacity duration-200',
    dropIndicator: 'lexkit-draggable-drop-indicator',
    upButton: 'lexkit-draggable-up-button',
    downButton: 'lexkit-draggable-down-button',
    blockIsDragging: 'lexkit-draggable-block-is-dragging',
  },
  richText: {
    contentEditable: 'lexkit-content-editable',
    placeholder: 'lexkit-placeholder',
  },
}

/**
 * Helper function to merge themes
 */
export function mergeThemes(baseTheme: LexKitTheme, overrideTheme: Partial<LexKitTheme>): LexKitTheme {
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
    toolbar: {
      ...baseTheme.toolbar,
      ...overrideTheme.toolbar,
    },
    draggable: {
      ...baseTheme.draggable,
      ...overrideTheme.draggable,
    },
    richText: {
      ...baseTheme.richText,
      ...overrideTheme.richText,
    },
  }
}

/**
 * Type guard to check if a theme is a LexKitTheme
 */
export function isLexKitTheme(theme: any): theme is LexKitTheme {
  return theme && typeof theme === 'object'
}
