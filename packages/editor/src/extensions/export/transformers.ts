/**
 * Centralized transformers export
 * This file collects all markdown transformers from various extensions
 * for easier importing and better DX
 */

import { HTML_EMBED_MARKDOWN_TRANSFORMER } from "../media/HTMLEmbedExtension";
import { HORIZONTAL_RULE_TRANSFORMER } from "../formatting/HorizontalRuleExtension";
import { UNDERLINE_TRANSFORMER } from "../formatting/UnderlineExtension";
import { TABLE_MARKDOWN_TRANSFORMER } from "../formatting/TableExtension";
import {
  IMAGE_MARKDOWN_TRANSFORMER,
  IMAGE_TEXT_MATCH_TRANSFORMER,
} from "../media/ImageExtension";

/**
 * All markdown transformers collected in one place
 * Import this array to get all available transformers
 *
 * Note: images ship two transformers. The element transformer handles
 * top-level (block) images, while the text-match transformer handles images
 * nested inside other elements (e.g. inside a paragraph after HTML import or
 * when placed inline with text). Both are required for images to survive a
 * markdown export in every position.
 */
export const ALL_MARKDOWN_TRANSFORMERS = [
  HTML_EMBED_MARKDOWN_TRANSFORMER,
  HORIZONTAL_RULE_TRANSFORMER,
  UNDERLINE_TRANSFORMER,
  TABLE_MARKDOWN_TRANSFORMER,
  IMAGE_MARKDOWN_TRANSFORMER,
  IMAGE_TEXT_MATCH_TRANSFORMER,
];

/**
 * Individual transformer exports for selective importing
 */
export {
  HTML_EMBED_MARKDOWN_TRANSFORMER,
  HORIZONTAL_RULE_TRANSFORMER,
  UNDERLINE_TRANSFORMER,
  TABLE_MARKDOWN_TRANSFORMER,
  IMAGE_MARKDOWN_TRANSFORMER,
  IMAGE_TEXT_MATCH_TRANSFORMER,
};
