#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { codeToHtml } from 'shiki'
import { RegisteredCodeSnippet, GeneratedRegistry } from '../app/(docs)/lib/types'

/**
 * Simple code registry generator
 * Scans docs/**\/codes.tsx files, docs/**\/examples/** files, and components/templates/** files and generates highlighted code registry
 */
class CodeRegistryGenerator {
  private docsDir: string
  private templatesDir: string
  private outputDir: string

  constructor() {
    this.docsDir = path.resolve(process.cwd(), 'app/(docs)')
    this.templatesDir = path.resolve(process.cwd(), 'components/templates')
    this.outputDir = path.resolve(process.cwd(), 'lib/generated')
  }

  /**
   * Ensure output directory exists
   */
  private ensureOutputDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }
  }

  /**
   * Find all codes.tsx files in docs/** and components/templates/** structures
   */
  private findCodesFiles(): Array<{ relativePath: string; fullPath: string }> {
    const files: Array<{ relativePath: string; fullPath: string }> = []

    const scanDirectory = (dirPath: string, relativePath: string = '') => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        const entryRelativePath = path.join(relativePath, entry.name)

        if (entry.isDirectory()) {
          scanDirectory(fullPath, entryRelativePath)
        } else if (entry.isFile() && entry.name === 'codes.tsx') {
          files.push({
            relativePath: entryRelativePath,
            fullPath
          })
        }
      }
    }

    scanDirectory(this.docsDir)
    scanDirectory(this.templatesDir)
    return files
  }

  /**
   * Find all example files in docs/** and components/templates/** structures (recursively)
   */
  private findExampleFiles(): Array<{ relativePath: string; fullPath: string; language: string }> {
    const files: Array<{ relativePath: string; fullPath: string; language: string }> = []

    const scanDirectory = (dirPath: string, relativePath: string = '') => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        const entryRelativePath = path.join(relativePath, entry.name)

        if (entry.isDirectory()) {
          // Recursively scan all directories
          scanDirectory(fullPath, entryRelativePath)
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name)
          // Include files with relevant extensions
          if (ext === '.tsx' || ext === '.ts' || ext === '.css' || ext === '.js' || ext === '.jsx') {
            const language = ext === '.tsx' ? 'tsx' : ext === '.ts' ? 'typescript' : ext === '.css' ? 'css' : ext === '.js' ? 'javascript' : 'jsx'
            files.push({
              relativePath: entryRelativePath,
              fullPath,
              language
            })
          }
        }
      }
    }

    scanDirectory(this.docsDir)
    scanDirectory(this.templatesDir)
    return files
  }

  /**
   * Load snippets from a codes.tsx file
   */
  private async loadSnippetsFromFile(filePath: string): Promise<RegisteredCodeSnippet[]> {
    try {
      // Use dynamic import to load the codes.tsx file
      const module = await import(filePath)

      // Get the default export
      const snippets = module.default

      if (Array.isArray(snippets)) {
        return snippets
      } else {
        console.warn(`⚠️  Default export is not an array in ${filePath}`)
        return []
      }
    } catch (error) {
      console.error(`❌ Failed to load ${filePath}:`, (error as Error).message)
      return []
    }
  }

  /**
   * Process code snippet with Shiki
   */
  private async processSnippet(snippet: RegisteredCodeSnippet): Promise<string> {
    return await codeToHtml(snippet.code, {
      lang: snippet.language,
      theme: 'github-dark',
      transformers: snippet.highlightLines && snippet.highlightLines.length > 0 ? [
        {
          line(node, line) {
            if (snippet.highlightLines!.includes(line)) {
              node.properties.class = 'highlighted-line'
            }
          }
        }
      ] : []
    })
  }

  /**
   * Process example file with Shiki
   */
  private async processExampleFile(fullPath: string, language: string): Promise<string> {
    const content = fs.readFileSync(fullPath, 'utf-8')
    return await codeToHtml(content, {
      lang: language,
      theme: 'github-dark'
    })
  }

  /**
   * Generate the static registry
   */
  async generateRegistry(): Promise<void> {
    console.log('🔍 Scanning codes.tsx and example files...')

    const codesFiles = this.findCodesFiles()
    const exampleFiles = this.findExampleFiles()

    console.log(`📁 Found ${codesFiles.length} codes.tsx files:`, codesFiles.map(f => f.relativePath))
    console.log(`📁 Found ${exampleFiles.length} example files:`, exampleFiles.map(f => f.relativePath))

    const allSnippets: RegisteredCodeSnippet[] = []

    // Load all snippets from codes.tsx files
    for (const file of codesFiles) {
      console.log(`📥 Loading ${file.relativePath}...`)
      const snippets = await this.loadSnippetsFromFile(file.fullPath)
      allSnippets.push(...snippets)
      console.log(`✅ Loaded ${snippets.length} snippets from ${file.relativePath}`)
    }

    console.log(`📝 Total snippets: ${allSnippets.length}`)

    const registry: GeneratedRegistry = {
      files: {},
      lastGenerated: new Date().toISOString()
    }

    // Process all snippets
    for (const snippet of allSnippets) {
      console.log(`⚙️  Processing snippet: ${snippet.id}...`)
      const highlighted = await this.processSnippet(snippet)
      registry.files[snippet.id] = {
        raw: snippet.code,
        highlighted,
        metadata: {
          title: snippet.title,
          description: snippet.description,
          language: snippet.language,
          highlightLines: snippet.highlightLines
        }
      }
    }

    // Process all example files
    for (const file of exampleFiles) {
      console.log(`⚙️  Processing example: ${file.relativePath}...`)
      const highlighted = await this.processExampleFile(file.fullPath, file.language)
      const content = fs.readFileSync(file.fullPath, 'utf-8')
      registry.files[file.relativePath] = {
        raw: content,
        highlighted,
        metadata: {
          language: file.language
        }
      }
    }

    // Generate TypeScript file
    this.ensureOutputDir()
    const outputPath = path.join(this.outputDir, 'code-registry.ts')

    const tsContent = `// Auto-generated code registry - DO NOT EDIT MANUALLY
// Generated on: ${registry.lastGenerated}
// This file is generated by scripts/generate-registry.ts

export interface CodeFile {
  raw: string
  highlighted: string
  metadata?: {
    title?: string
    description?: string
    language?: string
    highlightLines?: number[]
  }
}

export interface CodeRegistry {
  files: Record<string, CodeFile>
  lastGenerated: string
}

const registry: CodeRegistry = ${JSON.stringify(registry, null, 2)}

export default registry

// Helper functions
export function getCode(filePath: string): CodeFile | undefined {
  return registry.files[filePath]
}

export function getHighlightedCode(filePath: string): string | undefined {
  return registry.files[filePath]?.highlighted
}

export function getRawCode(filePath: string): string | undefined {
  return registry.files[filePath]?.raw
}

export function getAllFiles(): string[] {
  return Object.keys(registry.files)
}

export function getMetadata(filePath: string): CodeFile['metadata'] | undefined {
  return registry.files[filePath]?.metadata
}

export function getTitle(filePath: string): string | undefined {
  return registry.files[filePath]?.metadata?.title
}

export function getDescription(filePath: string): string | undefined {
  return registry.files[filePath]?.metadata?.description
}
`

    fs.writeFileSync(outputPath, tsContent)
    console.log(`✅ Registry generated successfully at: ${outputPath}`)
    console.log(`📊 Generated ${Object.keys(registry.files).length} files`)

    // Also generate a simple loader for runtime
    this.generateRuntimeLoader(codesFiles)
  }

  /**
   * Generate a runtime loader that imports all codes.tsx files
   */
  private generateRuntimeLoader(codesFiles: Array<{ relativePath: string; fullPath: string }>): void {
    const loaderPath = path.join(this.outputDir, 'codes-loader.ts')

    // Convert file paths to import paths relative to the loader
    const importStatements = codesFiles.map((file, index) => {
      // Convert docs/some/path/codes.tsx to ../../../docs/some/path/codes
      const relativePath = path.relative(path.dirname(loaderPath), file.fullPath)
      const importPath = relativePath.replace('.tsx', '').replace(/\\/g, '/')
      return `import * as codes${index} from '${importPath}'`
    }).join('\n')

    const moduleExports = codesFiles.map((file, index) => `  codes${index}`).join(',\n')

    const loaderContent = `// Auto-generated codes loader - DO NOT EDIT MANUALLY
// Generated on: ${new Date().toISOString()}
// This file is generated by scripts/generate-registry.ts

${importStatements}

export const allCodesModules = [
${moduleExports}
]
`

    fs.writeFileSync(loaderPath, loaderContent)
    console.log(`✅ Runtime loader generated at: ${loaderPath}`)
  }
}

// Run the generator
async function main() {
  try {
    console.log('🚀 Starting code registry generation...')
    const generator = new CodeRegistryGenerator()
    await generator.generateRegistry()
    console.log('✅ Code registry generation completed!')
  } catch (error) {
    console.error('❌ Registry generation failed:', error)
    process.exit(1)
  }
}

main()
