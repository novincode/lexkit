import {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { ImageNode, $createImageNode } from './index'; // Adjust path if needed

export type SerializedImageNode = Spread<
  {
    type: 'image';
    version: number;
    src: string;
    alt: string;
    caption?: string;
    alignment: 'left' | 'center' | 'right' | 'none';
    className?: string;
    style?: Record<string, string>;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

export class ImageTranslator {
  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: (domNode: HTMLElement): DOMConversionOutput | null => {
          try {
            const img = domNode as HTMLImageElement;
            if (!img || !img.src || img.tagName !== 'IMG') {
              console.warn('🚫 Invalid img element, skipping import', domNode);
              return null;
            }

          // Extract alignment from various possible sources
          let alignment: 'left' | 'center' | 'right' | 'none' = 'none';
          
          // Check style attribute
          const computedStyle = img.style;
          if (computedStyle.textAlign) {
            alignment = computedStyle.textAlign as any;
          } else if (computedStyle.float) {
            alignment = computedStyle.float === 'left' ? 'left' : 
                      computedStyle.float === 'right' ? 'right' : 'none';
          }

          // Check class names for alignment
          if (img.classList.contains('align-left')) alignment = 'left';
          else if (img.classList.contains('align-center')) alignment = 'center';
          else if (img.classList.contains('align-right')) alignment = 'right';

          // Extract caption from figure/figcaption if present
          let caption: string | undefined;
          const figure = img.closest('figure');
          if (figure) {
            const figcaption = figure.querySelector('figcaption');
            if (figcaption) {
              caption = figcaption.textContent || undefined;
            }
          }

          console.log('📥 Importing image:', {
            src: img.src,
            alt: img.alt,
            caption,
            alignment,
            className: img.className
          });

          const node = $createImageNode(
            img.src,
            img.alt || '',
            caption,
            alignment,
            img.className || undefined,
            this.extractStyleObject(img)
          );

          return { node };
          } catch (error) {
            console.error('Error importing img', error);
            return null;
          }
        },
        priority: 0,
      }),
      figure: () => ({
        conversion: (domNode: HTMLElement): DOMConversionOutput | null => {
          try {
            const figure = domNode as HTMLElement;
            const img = figure.querySelector('img');
            
            if (!img || !img.src) {
              return null;
            }

            const figcaption = figure.querySelector('figcaption');
            const caption = figcaption?.textContent || undefined;

            console.log('📥 Importing figure with image:', {
              src: img.src,
              alt: img.alt,
              caption
            });

            const node = $createImageNode(
              img.src,
              img.alt || '',
              caption,
              'center', // Figures are typically centered
              figure.className || undefined,
              this.extractStyleObject(figure)
            );

            return { node };
          } catch (error) {
            console.error('Error importing figure', error);
            return null;
          }
        },
        priority: 1, // Higher priority than img to handle figure first
      }),
    };
  }

  static exportDOM(node: ImageNode): DOMExportOutput {
    const { element, after } = this.createImageElement(node);
    
    console.log('📤 Exporting ImageNode to DOM:', {
      src: node.__src,
      alt: node.__alt,
      caption: node.__caption,
      alignment: node.__alignment
    });

    return { element, after };
  }

  static exportJSON(node: ImageNode): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: node.__src,
      alt: node.__alt,
      caption: node.__caption,
      alignment: node.__alignment,
      className: node.__className,
      style: node.__style ? this.styleObjectToRecord(node.__style) : undefined,
      width: node.__width,
      height: node.__height,
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, alt, caption, alignment, className, style, width, height } = serializedNode;
    
    console.log('📥 Importing ImageNode from JSON:', serializedNode);
    
    return $createImageNode(
      src,
      alt,
      caption,
      alignment,
      className,
      style ? this.recordToStyleObject(style) : undefined,
      width,
      height
    );
  }

  private static createImageElement(node: ImageNode): { element: HTMLElement; after?: (el: HTMLElement | DocumentFragment | Text | null | undefined) => HTMLElement | DocumentFragment | Text | null | undefined } {
    const element = document.createElement('figure');
    const img = document.createElement('img');
    
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
      case 'left':
        element.style.textAlign = 'left';
        break;
      case 'center':
        element.style.textAlign = 'center';
        break;
      case 'right':
        element.style.textAlign = 'right';
        break;
      default:
        element.style.textAlign = 'left';
    }

    // Basic figure styling
    element.style.margin = '1rem 0';
    element.style.display = 'block';

    // Add image to figure
    element.appendChild(img);

    // Add caption if present
    if (node.__caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.textContent = node.__caption;
      figcaption.style.fontSize = '0.9em';
      figcaption.style.color = '#666';
      figcaption.style.fontStyle = 'italic';
      figcaption.style.marginTop = '0.5rem';
      figcaption.style.textAlign = 'center';
      element.appendChild(figcaption);
    }

    // Return the element - no need for complex after callback
    return { 
      element,
      after: (el: HTMLElement | DocumentFragment | Text | null | undefined) => {
        console.log('✅ Image element created and inserted:', el);
        return el; // Return the element as expected
      }
    };
  }

  private static extractStyleObject(element: HTMLElement): Record<string, any> | undefined {
    if (!element.style.length) return undefined;

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
      console.warn('⚠️ Could not extract styles from element:', error);
      return undefined;
    }
  }

  private static styleObjectToRecord(style: Record<string, any>): Record<string, string> {
    const record: Record<string, string> = {};
    for (const [key, value] of Object.entries(style)) {
      record[key] = String(value);
    }
    return record;
  }

  private static recordToStyleObject(record: Record<string, string>): Record<string, any> {
    return { ...record };
  }
}

// Export methods for use in ImageNode
export const {
  importDOM: importImageDOM,
  exportDOM: exportImageDOM,
  importJSON: importImageJSON,
  exportJSON: exportImageJSON
} = ImageTranslator;
