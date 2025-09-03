import { ComponentType, CSSProperties } from 'react';
import { BaseExtensionConfig } from '../../types';

export type Alignment = 'left' | 'right' | 'center' | 'none';

export interface ImagePayload {
  src?: string;
  alt: string;
  caption?: string;
  alignment?: Alignment;
  className?: string;
  style?: CSSProperties;
  file?: File;
}

export interface ImageComponentProps extends ImagePayload {}

export interface SerializedImageNode {
  type: 'image';
  version: number;
  src: string;
  alt: string;
  caption?: string;
  alignment: Alignment;
  className?: string;
  style?: CSSProperties;
}

export interface ImageExtensionConfig extends BaseExtensionConfig {
  uploadHandler?: (file: File) => Promise<string>; // Returns URL after upload
  defaultAlignment?: Alignment;
  classNames?: Partial<Record<Alignment | 'wrapper' | 'caption', string>>;
  styles?: Partial<Record<Alignment | 'wrapper' | 'caption', CSSProperties>>;
  customRenderer?: ComponentType<ImageComponentProps>;
}

export type ImageCommands = {
  insertImage: (payload: ImagePayload) => void;
  setImageAlignment: (alignment: Alignment) => void;
  setImageCaption: (caption: string) => void;
  setImageClassName: (className: string) => void;
  setImageStyle: (style: CSSProperties) => void;
};

export type ImageStateQueries = {
  imageSelected: () => Promise<boolean>;
  isImageAlignedLeft: () => Promise<boolean>;
  isImageAlignedCenter: () => Promise<boolean>;
  isImageAlignedRight: () => Promise<boolean>;
  isImageAlignedNone: () => Promise<boolean>;
};
