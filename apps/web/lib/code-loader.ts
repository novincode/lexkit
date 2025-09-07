import fs from 'fs'
import path from 'path'
import { codeToHtml } from 'shiki'

interface CodeFile {
  path: string
  language: string
  title?: string
  highlightLines?: number[]
}

interface ExampleConfig {
  name: string
  component: string
  css?: string
  description?: string
}

/**
 * Dynamic code loader that automatically discovers example files
 * This system is completely headless and plug-and-play
 */
export class DynamicCodeLoader {
  private static instance: DynamicCodeLoader
  private cache: Map<string, string> = new Map()
  private examplesDir: string
  private discoveredExamples: Map<string, ExampleConfig> = new Map()

  constructor() {
    this.examplesDir = path.resolve(process.cwd(), 'app/docs/(docs)/introduction/examples')
    this.discoverExamples()
  }

  static getInstance(): DynamicCodeLoader {
    if (!DynamicCodeLoader.instance) {
      DynamicCodeLoader.instance = new DynamicCodeLoader()
    }
    return DynamicCodeLoader.instance
  }

  /**
   * Automatically discover example files in the examples directory
   */
  private discoverExamples(): void {
    try {
      const files = fs.readdirSync(this.examplesDir)
      const examples = new Map<string, { component?: string; css?: string }>()

      // Group files by example name
      files.forEach(file => {
        const ext = path.extname(file)
        const name = path.basename(file, ext)

        if (!examples.has(name)) {
          examples.set(name, {})
        }

        const example = examples.get(name)!
        if (ext === '.tsx') {
          example.component = file
        } else if (ext === '.css') {
          example.css = file
        }
      })

      // Create example configs
      examples.forEach((files, name) => {
        if (files.component) {
          this.discoveredExamples.set(name, {
            name: this.formatExampleName(name),
            component: files.component,
            css: files.css,
            description: this.getExampleDescription(name)
          })
        }
      })

      console.log(`Discovered ${this.discoveredExamples.size} examples:`, Array.from(this.discoveredExamples.keys()))
    } catch (error) {
      console.error('Failed to discover examples:', error)
    }
  }

  /**
   * Format example name for display
   */
  private formatExampleName(filename: string): string {
    return filename
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  /**
   * Get description for example
   */
  private getExampleDescription(name: string): string {
    const descriptions: Record<string, string> = {
      'BasicEditorExample': 'Simple editor with basic formatting features',
      'AdvancedFeaturesExample': 'Editor with advanced formatting and custom extensions',
      'ThemedEditorExample': 'Editor with custom theming and dark mode support'
    }
    return descriptions[name] || `${name} example`
  }

  /**
   * Load and process a code file with Shiki
   */
  async loadCode(file: CodeFile): Promise<string> {
    const cacheKey = `${file.path}:${file.language}:${JSON.stringify(file.highlightLines)}`

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    try {
      const filePath = path.resolve(this.examplesDir, file.path)
      const content = fs.readFileSync(filePath, 'utf-8')

      const html = await codeToHtml(content, {
        lang: file.language,
        theme: 'github-dark',
        transformers: file.highlightLines ? [
          {
            line(node, line) {
              if (file.highlightLines!.includes(line)) {
                node.properties.class = 'highlighted'
              }
            }
          }
        ] : []
      })

      this.cache.set(cacheKey, html)
      return html
    } catch (error) {
      console.error(`Failed to load code file: ${file.path}`, error)
      return `<pre><code>// Error loading file: ${file.path}</code></pre>`
    }
  }

  /**
   * Get all discovered examples
   */
  getExamples(): ExampleConfig[] {
    return Array.from(this.discoveredExamples.values())
  }

  /**
   * Get a specific example by name
   */
  getExample(name: string): ExampleConfig | undefined {
    return this.discoveredExamples.get(name)
  }

  /**
   * Load code for a specific example
   */
  async loadExampleCode(exampleName: string): Promise<{ component?: string; css?: string }> {
    const example = this.discoveredExamples.get(exampleName)
    if (!example) {
      return {}
    }

    const result: { component?: string; css?: string } = {}

    if (example.component) {
      result.component = await this.loadCode({
        path: example.component,
        language: 'tsx',
        title: example.component
      })
    }

    if (example.css) {
      result.css = await this.loadCode({
        path: example.css,
        language: 'css',
        title: example.css
      })
    }

    return result
  }

  /**
   * Preload all example codes
   */
  async preloadAllExamples(): Promise<void> {
    console.log('🔍 Discovering and preloading example files...')

    const files: CodeFile[] = []

    this.discoveredExamples.forEach(example => {
      if (example.component) {
        files.push({
          path: example.component,
          language: 'tsx',
          title: example.component
        })
      }
      if (example.css) {
        files.push({
          path: example.css,
          language: 'css',
          title: example.css
        })
      }
    })

    console.log(`📁 Found ${files.length} files to preload`)
    await Promise.all(files.map(file => this.loadCode(file)))
    console.log('✅ All example files preloaded successfully')
  }

  /**
   * Get cached content
   */
  getCachedContent(filePath: string, language: string, highlightLines?: number[]): string | undefined {
    const cacheKey = `${filePath}:${language}:${JSON.stringify(highlightLines)}`
    return this.cache.get(cacheKey)
  }
}

// Singleton instance
const loader = DynamicCodeLoader.getInstance()

/**
 * Preload all examples during build time
 */
export async function preloadCodeFiles(): Promise<void> {
  await loader.preloadAllExamples()
}

/**
 * Get all examples
 */
export function getExamples(): ExampleConfig[] {
  return loader.getExamples()
}

/**
 * Get a specific example
 */
export function getExample(name: string): ExampleConfig | undefined {
  return loader.getExample(name)
}

/**
 * Load code for a specific example
 */
export async function loadExampleCode(exampleName: string): Promise<{ component?: string; css?: string }> {
  return loader.loadExampleCode(exampleName)
}

/**
 * Get cached content
 */
export function getCachedContent(filePath: string, language: string, highlightLines?: number[]): string | undefined {
  return loader.getCachedContent(filePath, language, highlightLines)
}
