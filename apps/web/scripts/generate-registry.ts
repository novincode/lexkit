#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { codeToHtml } from 'shiki'
import { ALL_REGISTERED_SNIPPETS, RegisteredCodeSnippet } from '../app/(docs)/lib/registered-codes'

interface GeneratedRegistry {
  files: Record<string, { raw: string; highlighted: string; metadata?: any }>
  lastGenerated: string
}

/**
 * Build-time code registry generator
 * This script scans all example files and generates a static registry
 * that can be imported directly without runtime processing
 */
class CodeRegistryGenerator {
  private examplesDir: string
  private outputDir: string

  constructor() {
    this.examplesDir = path.resolve(process.cwd(), 'app/(docs)')
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
   * Scan and discover all code files
   */
  private discoverFiles(): Array<{ relativePath: string; fullPath: string }> {
    const files: Array<{ relativePath: string; fullPath: string }> = []
    
    const scanDirectory = (dirPath: string, relativePath: string = '') => {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name)
        const entryRelativePath = path.join(relativePath, entry.name)
        
        if (entry.isDirectory()) {
          // Only scan directories named "examples"
          if (entry.name === 'examples') {
            scanDirectory(fullPath, entryRelativePath)
          } else {
            // Recursively scan other directories to find "examples" folders
            scanDirectory(fullPath, entryRelativePath)
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name)
          if ((ext === '.tsx' || ext === '.css') && relativePath.includes('examples')) {
            files.push({
              relativePath: entryRelativePath,
              fullPath
            })
          }
        }
      }
    }
    
    scanDirectory(this.examplesDir)
    return files
  }

  /**
   * Process code file with Shiki
   */
  private async processCodeFile(fullPath: string, language: string, highlightLines?: number[]): Promise<string> {
    const content = fs.readFileSync(fullPath, 'utf-8')

    return await codeToHtml(content, {
      lang: language,
      theme: 'github-dark',
      transformers: highlightLines && highlightLines.length > 0 ? [
        {
          line(node, line) {
            if (highlightLines.includes(line)) {
              node.properties.class = 'highlighted-line'
            }
          }
        }
      ] : []
    })
  }

  /**
   * Process registered code snippet with Shiki
   */
  private async processRegisteredSnippet(snippet: RegisteredCodeSnippet): Promise<string> {
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
   * Generate the static registry
   */
  async generateRegistry(): Promise<void> {
    console.log('🔍 Scanning code files...')

    const files = this.discoverFiles()
    console.log(`📁 Found ${files.length} files:`, files)
    console.log(`📝 Found ${ALL_REGISTERED_SNIPPETS.length} registered snippets:`, ALL_REGISTERED_SNIPPETS.map(s => s.id))

    const registry: GeneratedRegistry = {
      files: {},
      lastGenerated: new Date().toISOString()
    }

    // Process file-based examples
    for (const file of files) {
      console.log(`⚙️  Processing ${file.relativePath}...`)

      const ext = path.extname(file.relativePath)
      const language = ext === '.tsx' ? 'tsx' : 'css'

      const rawContent = fs.readFileSync(file.fullPath, 'utf-8')
      const highlighted = await this.processCodeFile(file.fullPath, language)
      
      registry.files[file.relativePath] = {
        raw: rawContent,
        highlighted: highlighted
      }
    }

    // Process registered snippets
    for (const snippet of ALL_REGISTERED_SNIPPETS) {
      console.log(`⚙️  Processing registered snippet: ${snippet.id}...`)

      const highlighted = await this.processRegisteredSnippet(snippet)
      
      registry.files[snippet.id] = {
        raw: snippet.code,
        highlighted: highlighted,
        metadata: {
          title: snippet.title,
          description: snippet.description,
          language: snippet.language,
          highlightLines: snippet.highlightLines
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
