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

            // Extract alignment from various possible sources
            let alignment: "left" | "center" | "right" | "none" = "none";

            // Check style attribute
            const computedStyle = img.style;
            if (computedStyle.textAlign) {
              alignment = computedStyle.textAlign as any;
            } else if (computedStyle.float) {
              alignment =
                computedStyle.float === "left"
                  ? "left"
                  : computedStyle.float === "right"
                    ? "right"
                    : "none";
            }

            // Check class names for alignment
            if (img.classList.contains("align-left")) alignment = "left";
            else if (img.classList.contains("align-center"))
              alignment = "center";
            else if (img.classList.contains("align-right")) alignment = "right";

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

            try {
              const node = $createImageNode(
                img.src,
                img.alt || "",
                caption,
                "center", // Figures are typically centered
                figure.className || undefined,
                this.extractStyleObject(figure),
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
