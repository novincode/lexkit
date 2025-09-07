import React from 'react'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { Extension, BaseExtensionConfig, ExtensionCategory } from '../types'

export interface RichTextConfig extends BaseExtensionConfig {
  contentEditable?: React.ReactElement
  placeholder?: React.ReactElement | string
  className?: string
  contentEditableClassName?: string
  placeholderClassName?: string
  errorBoundary?: React.ComponentType<{ children: React.JSX.Element; onError: (error: Error) => void }>
}

export const richTextExtension = (config: RichTextConfig = {}): Extension => ({
  name: 'richText',
  category: [ExtensionCategory.Floating],
  config: {
    showInToolbar: false,
    position: 'after', // RichText should render after children
    ...config
  },
  register: () => () => {}, // No registration needed for RichTextPlugin
  getPlugins: () => [
    <RichTextPlugin
      key="rich-text"
      contentEditable={
        config.contentEditable || (
          <ContentEditable
            className={config.contentEditableClassName || 'editor-input'}
          />
        )
      }
      placeholder={
        typeof config.placeholder === 'string' ? (
          <div className={config.placeholderClassName || 'editor-placeholder'}>
            {config.placeholder}
          </div>
        ) : (
          config.placeholder || (
            <div className={config.placeholderClassName || 'editor-placeholder'}>
              Start writing...
            </div>
          )
        )
      }
      ErrorBoundary={
        config.errorBoundary || DefaultErrorBoundary
      }
    />
  ],
  getCommands: () => ({}),
  getStateQueries: () => ({})
})

// Default Error Boundary for RichTextPlugin
const DefaultErrorBoundary: React.FC<{ children: React.JSX.Element; onError: (error: Error) => void }> = ({ children, onError }) => {
  try {
    return <>{children}</>
  } catch (error) {
    console.error('RichTextPlugin Error:', error)
    onError(error as Error)
    return (
      <div className="editor-error-boundary">
        <h3>Editor Error</h3>
        <p>Something went wrong with the editor. Please refresh the page.</p>
      </div>
    )
  }
}
