import { ComponentType, CSSProperties } from "react";
import { BaseExtensionConfig } from "@lexkit/editor/extensions/types";

/**
 * Supported alignment options for media elements
 */
export type Alignment = "left" | "right" | "center" | "none";

/**
 * Payload interface for image insertion and manipulation
 */
export interface ImagePayload {
  /** Image source URL */
  src?: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional caption text */
  caption?: string;
  /** Image alignment */
  alignment?: Alignment;
  /** CSS class name */
  className?: string;
  /** Inline CSS styles */
  style?: CSSProperties;
  /** File object for uploads */
  file?: File;
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
}

/**
 * Props interface for the Image component
 */
export interface ImageComponentProps extends ImagePayload {
  /** Unique key for the Lexical node */
  nodeKey?: string;
  /** Whether the image should be resizable */
  resizable?: boolean;
  /** Whether the image is currently uploading */
  uploading?: boolean;
}

/**
 * Serialized representation of an ImageNode for persistence
 */
export interface SerializedImageNode {
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
  alignment: Alignment;
  /** CSS class name */
  className?: string;
  /** Inline CSS styles as string record */
  style?: Record<string, string>;
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
}

/**
 * Configuration options for the ImageExtension
 */
export interface ImageExtensionConfig extends BaseExtensionConfig {
  /** Handler for file uploads, returns the uploaded image URL */
  uploadHandler?: (file: File) => Promise<string>;
  /** Default alignment for new images */
  defaultAlignment?: Alignment;
  /** CSS class names for different alignments and elements */
  classNames?: Partial<Record<Alignment | "wrapper" | "caption", string>>;
  /** CSS styles for different alignments and elements */
  styles?: Partial<Record<Alignment | "wrapper" | "caption", CSSProperties>>;
  /** Custom component for rendering images */
  customRenderer?: ComponentType<ImageComponentProps>;
  /** Enable/disable image resizing (default: true) */
  resizable?: boolean;
  /** Configuration for paste behavior */
  pasteListener?: {
    /** Insert new image on paste when no image is selected */
    insert: boolean;
    /** Replace selected image's src on paste */
    replace: boolean;
  };
  /** Enable debug logging */
  debug?: boolean;
  /** Force upload even for internet URLs (default: false) */
  forceUpload?: boolean;
}

/**
 * Commands provided by the ImageExtension
 */
export type ImageCommands = {
  /** Insert a new image into the editor */
  insertImage: (payload: ImagePayload) => void;
  /** Set the alignment of the selected image */
  setImageAlignment: (alignment: Alignment) => void;
  /** Set the caption of the selected image */
  setImageCaption: (caption: string) => void;
  /** Set the CSS class name of the selected image */
  setImageClassName: (className: string) => void;
  /** Set the inline styles of the selected image */
  setImageStyle: (style: CSSProperties) => void;
};

/**
 * State queries provided by the ImageExtension
 */
export type ImageStateQueries = {
  /** Check if an image is currently selected */
  imageSelected: () => Promise<boolean>;
  /** Check if the selected image is left-aligned */
  isImageAlignedLeft: () => Promise<boolean>;
  /** Check if the selected image is center-aligned */
  isImageAlignedCenter: () => Promise<boolean>;
  /** Check if the selected image is right-aligned */
  isImageAlignedRight: () => Promise<boolean>;
  /** Check if the selected image has no special alignment */
  isImageAlignedNone: () => Promise<boolean>;
};
