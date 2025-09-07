#!/usr/bin/env tsx

import { preloadCodeFiles } from './code-loader.js'

async function main() {
  try {
    console.log('🚀 Starting dynamic code preload process...')
    await preloadCodeFiles()
    console.log('✅ Dynamic code preload completed successfully!')
  } catch (error) {
    console.error('❌ Dynamic code preload failed:', error)
    process.exit(1)
  }
}

main()
