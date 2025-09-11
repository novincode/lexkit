import { RegisteredCodeSnippet } from '../../lib/types'

// Styling examples
export const STYLING_EXAMPLES: RegisteredCodeSnippet[] = [
  {
    id: 'custom-styling',
    code: `.my-editor {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.my-editor .editor-content {
  padding: 16px;
  min-height: 200px;
  font-size: 16px;
  line-height: 1.6;
}`,
    language: 'css',
    title: 'Custom CSS Styling',
    description: 'Style your editor with custom CSS',
    highlightLines: [1, 2, 3, 4, 7, 8, 9, 10, 11]
  },
  {
    id: 'tailwind-styling',
    code: `<div className="border-2 border-gray-200 rounded-lg overflow-hidden">
  <div className="p-4 min-h-[200px] prose prose-sm max-w-none">
    {/* Editor content */}
  </div>
</div>`,
    language: 'tsx',
    title: 'Tailwind CSS Classes',
    description: 'Style with Tailwind utility classes',
    highlightLines: [1, 2, 3, 4]
  },
  {
    id: 'theme-integration',
    code: `function ThemedEditor() {
  const [theme, setTheme] = useState('light')

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <DefaultTemplate
        className={theme === 'dark' ? 'dark-theme' : 'light-theme'}
      />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  )
}`,
    language: 'tsx',
    title: 'Theme Integration',
    description: 'Implement light/dark theme switching',
    highlightLines: [3, 5, 6, 7, 10, 11, 12]
  }
]

// Combine all examples for default export
export default STYLING_EXAMPLES
