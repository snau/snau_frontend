#!/usr/bin/env node

/**
 * Build verification script for Netlify deployment
 * This script checks if the build output is ready for deployment
 */

import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const OUTPUT_DIR = '.output/public'
const REQUIRED_FILES = ['200.html', '404.html', 'sitemap.xml']

console.log('🔍 Verifying build output...')

// Check if output directory exists
if (!existsSync(OUTPUT_DIR)) {
  console.error('❌ Build output directory not found:', OUTPUT_DIR)
  process.exit(1)
}

// Check required files
for (const file of REQUIRED_FILES) {
  const filePath = join(OUTPUT_DIR, file)
  if (!existsSync(filePath)) {
    console.error('❌ Required file/directory not found:', filePath)
    process.exit(1)
  }
}

// Get build size
const stats = statSync(OUTPUT_DIR)
console.log('✅ Build output verified successfully!')
console.log('📁 Output directory:', OUTPUT_DIR)
console.log('📊 Build completed at:', stats.mtime.toISOString())

// Check for common issues
const fallbackPath = join(OUTPUT_DIR, '200.html')
if (existsSync(fallbackPath)) {
  const fallbackStats = statSync(fallbackPath)
  if (fallbackStats.size < 100) {
    console.warn(
      '⚠️  Warning: 200.html seems very small, check for build issues',
    )
  }
}

// Check for language directories
const languageDirs = ['de', 'en']
for (const lang of languageDirs) {
  const langPath = join(OUTPUT_DIR, lang)
  if (existsSync(langPath)) {
    console.log(`✅ Language directory found: ${lang}/`)
  } else {
    console.warn(`⚠️  Warning: Language directory missing: ${lang}/`)
  }
}

console.log('🚀 Ready for deployment!')
