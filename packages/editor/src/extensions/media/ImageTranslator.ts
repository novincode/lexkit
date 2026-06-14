import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ImageNode, $createImageNode } from "./index"; // Adjust path if needed

/**
 * Serialized representation of an ImageNode for persistence and data exchange
 */
export type SerializedImageNode = Spread<
  {
    /** Node type identifier */
    type: "image";
    /** Version for migration support */
    version: number;
    /** Image source URL */
    src: string;
    /** Alt text for accessibility */
    alt: string;
    /** Optional caption text */
    caption?: string;
    /** Image alignment */
    alignment: "left" | "center" | "right" | "none";
    /** CSS class name */
    className?: string;
    /** Inline CSS styles as string record */
    style?: Record<string, string>;
    /** Image width in pixels */
    width?: number;
    /** Image height in pixels */
    height?: number;
    /** Whether the image is currently uploading */
    uploading?: boolean;
  },
  SerializedLexicalNode
>;

/**
 * ImageTranslator - Handles conversion between ImageNodes and various formats
 *
 * This utility class provides methods for importing and exporting ImageNodes
 * to/from DOM elements, JSON serialization, and HTML. It handles alignment
 * extraction, caption processing, and style management.
 *
 * @example
 * ```typescript
 * // Import from DOM
 * const conversionMap = ImageTranslator.importDOM();
 *
 * // Export to DOM
 * const { element } = ImageTranslator.exportDOM(imageNode);
 *
 * // Serialize to JSON
 * const json = ImageTranslator.exportJSON(imageNode);
 *
 * // Deserialize from JSON
 * const node = ImageTranslator.importJSON(json);
 * ```
 */
export class ImageTranslator {
  /**
   * Create DOM conversion map for importing images from HTML
   * @returns Conversion map for img and figure elements
   */
  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (domNode: HTMLElement): DOMConversionOutput | null => {
          try {
            if (
              !domNode ||
              !(domNode instanceof HTMLImageElement) ||
              !domNode.src
            ) {
              return null;
            }
            const img = domNode;

            // Extract alignment from style, float, or class names
            const alignment = this.extractAlignment(img);

            // Extract intrinsic dimensions (attribute or inline style)
            const width = this.extractDimension(img, "width");
            const height = this.extractDimension(img, "height");

            // Extract caption from figure/figcaption if present
            let caption: string | undefined;
            const figure = img.closest("figure");
            if (figure) {
              const figcaption = figure.querySelector("figcaption");
              if (figcaption) {
                caption = figcaption.textContent || undefined;
              }
            }

            try {
              const node = $createImageNode(
                img.src,
                img.alt || "",
                caption,
                alignment,
                img.className || undefined,
                this.extractStyleObject(img),
                width,
                height,
              );

              return { node };
            } catch (error) {
              return null;
            }
          } catch (error) {
            return null;
          }
        },
        priority: 0,
      }),
      figure: () => ({
        conversion: (domNode: HTMLElement): DOMConversionOutput | null => {
          try {
            if (
              !domNode ||
              !(domNode instanceof HTMLElement) ||
              domNode.tagName !== "FIGURE"
            ) {
              return null;
            }
            const figure = domNode;
            const img = figure.querySelector("img");

            if (!img || !img.src) {
              return null;
            }

            const figcaption = figure.querySelector("figcaption");
            const caption = figcaption?.textContent || undefined;

            // Preserve the figure's alignment instead of assuming "center".
            // The editor exports alignment as an `align-*` class / text-align
            // style on the figure, so a round-trip must read it back. (#11)
            const alignment = this.extractAlignment(figure);

            // Dimensions and presentation live on the inner <img>. (#10)
            const width = this.extractDimension(img, "width");
            const height = this.extractDimension(img, "height");

            try {
              const node = $createImageNode(
                img.src,
                img.alt || "",
                caption,
                alignment,
                img.className || undefined,
                this.extractStyleObject(img),
                width,
                height,
              );

              return { node };
            } catch (error) {
              return null;
            }
          } catch (error) {
            return null;
          }
        },
        priority: 1, // Higher priority than img to handle figure first
      }),
    };
  }

  /**
   * Extract the alignment of an image-bearing element.
   * Class names (`align-left|center|right|none`) take precedence, then the
   * `text-align` style, then `float`. Defaults to "none".
   * @param element - The DOM element to read alignment from
   */
  private static extractAlignment(
    element: HTMLElement,
  ): "left" | "center" | "right" | "none" {
    try {
      if (element.classList) {
        if (element.classList.contains("align-left")) return "left";
        if (element.classList.contains("align-center")) return "center";
        if (element.classList.contains("align-right")) return "right";
        if (element.classList.contains("align-none")) return "none";
      }

      const style = element.style;
      if (style) {
        const textAlign = style.textAlign;
        if (
          textAlign === "left" ||
          textAlign === "center" ||
          textAlign === "right"
        ) {
          return textAlign;
        }
        if (style.float === "left") return "left";
        if (style.float === "right") return "right";
      }
    } catch (error) {
      // fall through to default
    }
    return "none";
  }

  /**
   * Extract a pixel dimension (width/height) from a DOM element.
   * Reads the HTML attribute first (e.g. `width="300"`), then a `px` inline
   * style (e.g. `style="width: 300px"`). Percentage / auto values are ignored
   * since they cannot be represented as a numeric pixel size.
   * @param element - The DOM element to read from
   * @param dimension - Which dimension to read
   */
  private static extractDimension(
    element: HTMLElement,
    dimension: "width" | "height",
  ): number | undefined {
    try {
      // Attribute form: width="300" or width="300px"
      const attr = element.getAttribute(dimension);
      if (attr && /^\d+(?:px)?$/.test(attr.trim())) {
        const value = parseInt(attr, 10);
        if (!isNaN(value) && value > 0) return value;
      }

      // Inline style form: style="width: 300px"
      const styleValue =
        dimension === "width" ? element.style?.width : element.style?.height;
      if (styleValue && /^\d+(?:\.\d+)?px$/.test(styleValue.trim())) {
        const value = parseInt(styleValue, 10);
        if (!isNaN(value) && value > 0) return value;
      }
    } catch (error) {
      // ignore and fall through
    }
    return undefined;
  }

  /**
   * Export an ImageNode to DOM elements
   * @param node - The ImageNode to export
   * @returns DOM export output with element and after callback
   */
  static exportDOM(node: ImageNode): DOMExportOutput {
    const { element, after } = this.createImageElement(node);
    return { element, after };
  }

  /**
   * Export an ImageNode to JSON format
   * @param node - The ImageNode to export
   * @returns Serialized ImageNode data
   */
  static exportJSON(node: ImageNode): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: node.__src,
      alt: node.__alt,
      caption: node.__caption,
      alignment: node.__alignment,
      className: node.__className,
      style: node.__style ? this.styleObjectToRecord(node.__style) : undefined,
      width: node.__width,
      height: node.__height,
      uploading: node.__uploading,
    };
  }

  /**
   * Import an ImageNode from JSON format
   * @param serializedNode - The serialized ImageNode data
   * @returns New ImageNode instance
   * @throws Error if src is empty
   */
  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const {
      src,
      alt,
      caption,
      alignment,
      className,
      style,
      width,
      height,
      uploading,
    } = serializedNode;

    if (!src || src.length === 0) {
      throw new Error("Cannot import ImageNode with empty src");
    }

    return $createImageNode(
      src,
      alt,
      caption,
      alignment,
      className,
      style ? this.recordToStyleObject(style) : undefined,
      width,
      height,
      uploading,
    );
  }

  /**
   * Create DOM elements for an ImageNode
   * @param node - The ImageNode to convert
   * @returns Object with element and after callback
   */
  private static createImageElement(node: ImageNode): {
    element: HTMLElement;
    after?: (
      el: HTMLElement | DocumentFragment | Text | null | undefined,
    ) => HTMLElement | DocumentFragment | Text | null | undefined;
  } {
    const element = document.createElement("figure");
    const img = document.createElement("img");

    // Set basic image attributes
    img.src = node.__src;
    img.alt = node.__alt;

    // Apply width and height if present
    if (node.__width) img.width = node.__width;
    if (node.__height) img.height = node.__height;

    // Apply className if present
    if (node.__className) {
      img.className = node.__className;
    }

    // Apply inline styles if present
    if (node.__style) {
      Object.assign(img.style, node.__style);
    }

    // Handle alignment
    element.className = `lexical-image align-${node.__alignment}`;

    // Apply alignment styles
    switch (node.__alignment) {
      case "left":
        element.style.textAlign = "left";
        break;
      case "center":
        element.style.textAlign = "center";
        break;
      case "right":
        element.style.textAlign = "right";
        break;
      default:
        element.style.textAlign = "left";
    }

    // Basic figure styling
    element.style.margin = "1rem 0";
    element.style.display = "block";

    // Add image to figure
    element.appendChild(img);

    // Add caption if present
    if (node.__caption) {
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = node.__caption;
      figcaption.style.fontSize = "0.9em";
      figcaption.style.color = "#666";
      figcaption.style.fontStyle = "italic";
      figcaption.style.marginTop = "0.5rem";
      figcaption.style.textAlign = "center";
      element.appendChild(figcaption);
    }

    // Return the element - no need for complex after callback
    return {
      element,
      after: (el: HTMLElement | DocumentFragment | Text | null | undefined) => {
        return el; // Return the element as expected
      },
    };
  }

  /**
   * Extract inline styles from a DOM element
   * @param element - The DOM element to extract styles from
   * @returns Style object or undefined if no styles
   */
  private static extractStyleObject(
    element: HTMLElement,
  ): Record<string, any> | undefined {
    if (
      !element ||
      !(element instanceof HTMLElement) ||
      !element.style ||
      !element.style.length
    )
      return undefined;

    const styleObj: Record<string, any> = {};

    // Safely extract styles without throwing errors
    try {
      for (let i = 0; i < element.style.length; i++) {
        const property = element.style.item(i);
        if (property) {
          styleObj[property] = element.style.getPropertyValue(property);
        }
      }
      return Object.keys(styleObj).length > 0 ? styleObj : undefined;
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Convert a style object to a string record
   * @param style - Style object to convert
   * @returns String record of styles
   */
  private static styleObjectToRecord(
    style: Record<string, any>,
  ): Record<string, string> {
    const record: Record<string, string> = {};
    for (const [key, value] of Object.entries(style)) {
      record[key] = String(value);
    }
    return record;
  }

  /**
   * Convert a string record to a style object
   * @param record - String record to convert
   * @returns Style object
   */
  private static recordToStyleObject(
    record: Record<string, string>,
  ): Record<string, any> {
    return { ...record };
  }
}

// Export methods for use in ImageNode
export const {
  importDOM: importImageDOM,
  exportDOM: exportImageDOM,
  importJSON: importImageJSON,
  exportJSON: exportImageJSON,
} = ImageTranslator;
