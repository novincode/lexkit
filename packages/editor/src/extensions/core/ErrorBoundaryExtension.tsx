import React from 'react'
import { Extension, BaseExtensionConfig, ExtensionCategory } from '../types'

export interface ErrorBoundaryConfig extends BaseExtensionConfig {
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export const errorBoundaryExtension = (config: ErrorBoundaryConfig = {}): Extension => ({
  name: 'errorBoundary',
  category: [ExtensionCategory.Floating],
  config: {
    showInToolbar: false,
    ...config
  },
  register: () => () => {}, // No registration needed for ErrorBoundary
  getPlugins: () => [
    <ErrorBoundaryWrapper
      key="error-boundary"
      fallback={config.fallback}
      onError={config.onError}
    />
  ],
  getCommands: () => ({}),
  getStateQueries: () => ({})
})

// Error Boundary Wrapper Component
interface ErrorBoundaryWrapperProps {
  children?: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class ErrorBoundaryWrapper extends React.Component<ErrorBoundaryWrapperProps, { hasError: boolean; error: Error | null }> {
  constructor(props: ErrorBoundaryWrapperProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Editor Error Boundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return (
        <div className="editor-error-boundary">
          <h3>Editor Error</h3>
          <p>Something went wrong with the editor.</p>
          <button onClick={this.resetError} className="editor-error-reset">
            Try Again
          </button>
        </div>
      )
    }

    return <>{this.props.children}</>
  }
}
