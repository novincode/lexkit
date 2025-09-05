/**
 * LexKit Editor Extensions
 *
 * This module exports all available extensions for the LexKit editor system.
 * Extensions provide specific functionality like text formatting, media insertion,
 * export/import capabilities, and more.
 *
 * @packageDocumentation
 */

// Text Formatting Extensions
export { BoldExtension, boldExtension } from './formatting/BoldExtension';
export { ItalicExtension, italicExtension } from './formatting/ItalicExtension';
export { UnderlineExtension, underlineExtension } from './formatting/UnderlineExtension';
export { StrikethroughExtension, strikethroughExtension } from './formatting/StrikethroughExtension';
export { LinkExtension, linkExtension } from './formatting/LinkExtension';
export { HorizontalRuleExtension, horizontalRuleExtension } from './formatting/HorizontalRuleExtension';
export { TableExtension, tableExtension, type TableConfig } from './formatting/TableExtension';

// Structure Extensions
export { ListExtension, listExtension } from './formatting/ListExtension';
export { CodeExtension, codeExtension } from './formatting/CodeExtension';
export { CodeFormatExtension, codeFormatExtension } from './formatting/CodeFormatExtension';
export { BlockFormatExtension, blockFormatExtension } from './formatting/BlockTypeExtension';

// History & Undo/Redo
export { HistoryExtension, historyExtension } from './core/HistoryExtension';

// Export/Import Extensions
export { HTMLExtension, htmlExtension } from './export/HTMLExtension';
export { MarkdownExtension, markdownExtension } from './export/MarkdownExtension';

// Media Extensions
export { ImageExtension, imageExtension } from './media/ImageExtension';
export { htmlEmbedExtension } from './media/HTMLEmbedExtension';

// Custom Extensions
export { createCustomNodeExtension } from './custom/CustomNodeExtension';

// Base Classes & Types
export { TextFormatExtension } from './base/TextFormatExtension';
export * from './types';
export * from './base/BaseExtension';
