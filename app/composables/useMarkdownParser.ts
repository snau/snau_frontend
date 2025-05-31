import { marked } from 'marked'

// Cache for parsed markdown to improve performance
const markdownCache = new Map<string, string>()

/**
 * Composable for parsing and caching markdown content
 * Uses a Map to store previously parsed content and avoid redundant processing
 */
export function useMarkdownParser() {
  /**
   * Parses and caches markdown content to improve performance
   * @param text - The markdown text to be parsed
   * @returns The parsed HTML string, or empty string if input is empty
   */
  const parseMarkdown = (text: string): string => {
    if (!text) return ''
    if (!markdownCache.has(text)) {
      markdownCache.set(text, marked.parse(text) as string)
    }
    return markdownCache.get(text) || ''
  }

  /**
   * Clears the markdown cache (useful for memory management)
   */
  const clearCache = () => {
    markdownCache.clear()
  }

  /**
   * Gets the current cache size
   */
  const getCacheSize = () => {
    return markdownCache.size
  }

  return {
    parseMarkdown,
    clearCache,
    getCacheSize,
  }
}
