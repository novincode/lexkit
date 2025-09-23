import React from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalEditor } from "lexical";
import { ReactNode } from "react";
import { BaseExtension } from "../base";
import { BaseExtensionConfig, ExtensionCategory } from "../types";
import { defaultLexKitTheme } from "../../core/theme";

// Base RichText props interface - shared between config and component
export interface BaseRichTextProps {
  contentEditable?: React.ReactElement;
  placeholder?: React.ReactElement | string;
  className?: string;
  classNames?: {
    container?: string;
    contentEditable?: string;
    placeholder?: string;
  };
  styles?: {
    container?: React.CSSProperties;
    contentEditable?: React.CSSProperties;
    placeholder?: React.CSSProperties;
  };
  errorBoundary?: React.ComponentType<{
    children: React.JSX.Element;
    onError: (error: Error) => void;
  }>;
}

export interface RichTextConfig
  extends BaseExtensionConfig,
    BaseRichTextProps {}

// Shared component props - extends base props
interface SharedRichTextProps extends BaseRichTextProps {}

const SharedRichText: React.FC<SharedRichTextProps> = (props) => {
  const {
    contentEditable,
    placeholder,
    className,
    classNames,
    styles,
    errorBoundary,
  } = props;

  // Extract common placeholder props
  const placeholderClassNameFinal =
    classNames?.placeholder ||
    defaultLexKitTheme.richText?.placeholder ||
    "lexkit-placeholder";
  const placeholderStyle = {
    position: "absolute" as const,
    top: 0,
    left: 0,
    pointerEvents: "none" as const,
    color: "#999",
    zIndex: 1,
    ...styles?.placeholder,
  };

  return (
    <div
      className={
        classNames?.container ||
        className ||
        defaultLexKitTheme.container ||
        "lexkit-editor-container"
      }
      style={{
        position: "relative",
        ...styles?.container,
      }}
    >
      <RichTextPlugin
        contentEditable={
          contentEditable || (
            <ContentEditable
              className={
                classNames?.contentEditable ||
                defaultLexKitTheme.richText?.contentEditable ||
                "lexkit-content-editable"
              }
              style={styles?.contentEditable}
            />
          )
        }
        placeholder={
          typeof placeholder === "string" ? (
            <div className={placeholderClassNameFinal} style={placeholderStyle}>
              {placeholder}
            </div>
          ) : (
            placeholder || (
              <div
                className={placeholderClassNameFinal}
                style={placeholderStyle}
              >
                Start writing...
              </div>
            )
          )
        }
        ErrorBoundary={errorBoundary || DefaultErrorBoundary}
      />
    </div>
  );
};

export interface RichTextConfig
  extends BaseExtensionConfig,
    BaseRichTextProps {}

/**
 * RichTextExtension - Provides the core rich text editing functionality
 * Extends BaseExtension for consistency with other extensions
 */
export class RichTextExtension extends BaseExtension<
  "richText",
  RichTextConfig,
  {}, // No commands
  {}, // No state queries
  ReactNode[] // Plugins
> {
  constructor(config: RichTextConfig = {}) {
    super("richText", [ExtensionCategory.Floating]);
    this.config = {
      showInToolbar: false,
      position: "after", // RichText should render after children
      ...config,
    };
  }

  register(editor: LexicalEditor): () => void {
    // No registration needed for RichTextPlugin
    return () => {};
  }

  getPlugins(): ReactNode[] {
    return [<SharedRichText key="rich-text" {...this.config} />];
  }
}

// Pre-configured instance for convenience
export const richTextExtension = new RichTextExtension();

// Standalone RichText Component for flexible usage
export interface RichTextComponentProps extends SharedRichTextProps {}

export const RichText: React.FC<RichTextComponentProps> = (props) => {
  return <SharedRichText {...props} />;
};

// Default Error Boundary for RichTextPlugin
const DefaultErrorBoundary: React.FC<{
  children: React.JSX.Element;
  onError: (error: Error) => void;
}> = ({ children, onError }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("RichTextPlugin Error:", error);
    onError(error as Error);
    return (
      <div className="editor-error-boundary">
        <h3>Editor Error</h3>
        <p>Something went wrong with the editor. Please refresh the page.</p>
      </div>
    );
  }
};
