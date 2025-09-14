import React from "react";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { Extension, BaseExtensionConfig, ExtensionCategory } from "../types";
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

export const richTextExtension = (config: RichTextConfig = {}): Extension => ({
  name: "richText",
  category: [ExtensionCategory.Floating],
  config: {
    showInToolbar: false,
    position: "after", // RichText should render after children
    ...config,
  },
  register: () => () => {}, // No registration needed for RichTextPlugin
  getPlugins: () => [<SharedRichText key="rich-text" {...config} />],
  getCommands: () => ({}),
  getStateQueries: () => ({}),
});

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
