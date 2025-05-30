import type { KirbyBlock } from '#nuxt-kql'
import type { Interview } from '../../shared/types/interview'
import { computed } from 'vue'
import { interviewsQuery } from '~/queries'

export function useInterviewData(
  block: KirbyBlock<
    | 'category'
    | 'tags'
    | 'selection'
    | 'show_tags'
    | 'show_category'
    | 'card_layout'
    | 'gap'
    | 'item_size'
  >,
) {
  // Default to 'interviews' if no selection is provided
  const pageToFetch = computed(() => {
    return block.content.selection || 'interviews'
  })

  // Create a dynamic query to fetch the selected page's children
  const fetchQuery = computed(() => {
    // For the standard interviews page, use the existing query
    if (pageToFetch.value === 'interviews') {
      return interviewsQuery
    }

    // For other pages, create a query that focuses on getting children
    return {
      query: `page("${pageToFetch.value}")` as const,
      select: {
        uri: true,
        title: true,
        children: {
          query: 'page.children' as const,
          select: {
            uri: true,
            title: true,
            date: true,
            intro: true,
            categories: true,
            tags: true,
            cover: {
              query: 'page.cover.toFile' as const,
              select: ['url', 'srcset', 'alt'],
            },
          },
        },
      },
    }
  })

  const { data } = useKql(fetchQuery.value)

  // Process the data to properly extract children
  const processedInterviews = computed<Interview[]>(() => {
    // If it's the standard interviews page
    if (pageToFetch.value === 'interviews') {
      return data.value?.result || []
    }

    // For other pages, extract and process the children
    const children = data.value?.result?.children || []

    return children.map((child: any) => ({
      ...child,
      // Ensure these properties exist with proper format
      categories: Array.isArray(child.categories)
        ? child.categories
        : typeof child.categories === 'string'
          ? child.categories.split(',').map((cat: string) => cat.trim())
          : child.categories
            ? [child.categories]
            : [],
      tags: Array.isArray(child.tags)
        ? child.tags
        : typeof child.tags === 'string'
          ? child.tags.split(',').map((tag: string) => tag.trim())
          : child.tags
            ? [child.tags]
            : [],
    }))
  })

  return {
    processedInterviews,
    data,
  }
}
