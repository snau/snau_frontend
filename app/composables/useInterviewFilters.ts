import type { KirbyBlock } from '#nuxt-kql'
import type { Interview } from '../../shared/types/interview'
import { computed } from 'vue'

export function useInterviewFilters(
  interviews: Ref<Interview[]>,
  block: KirbyBlock<
    | 'category'
    | 'tags'
    | 'selection'
    | 'show_tags'
    | 'show_category'
    | 'card_layout'
    | 'gap'
    | 'item_size'
    | 'categories' // Added this line
  >,
) {
  // Single initialization of filters with initial values from props
  const { selectedCategories, categoryDisplayNames, categoriesWithInterviews } =
    useCategories(interviews)

  const { selectedTag, tagDisplayNames, tagsWithInterviews } =
    useTags(interviews)

  // Initialize filters with prop values if they exist
  if (block.content.category) {
    selectedCategories.value = [block.content.category]
  }
  // For tags, we should only set a single tag as the selected one
  // If block.content.tags is a comma-separated string, we'll use the first tag
  if (block.content.tags && typeof block.content.tags === 'string') {
    // Split by comma and use the first tag (trimmed)
    const firstTag = (block.content.tags as string).split(',')[0]?.trim()
    if (firstTag) {
      selectedTag.value = firstTag
    }
  }

  // Check if filters should be displayed
  const showCategoryFilter = computed(() => {
    // Kirby toggle fields might come as strings, so we need to handle multiple formats
    const value = block.content.show_category

    // If undefined or null, default to true
    if (value === undefined || value === null) {
      return true
    }

    // Handle string values like "true"/"false" or "1"/"0"
    if (typeof value === 'string') {
      // Check for falsy string values
      if (value === 'false' || value === '0' || value === '') {
        return false
      }
      return true
    }

    // Handle boolean values
    return value === true
  })

  const showTagsFilter = computed(() => {
    // Kirby toggle fields might come as strings, so we need to handle multiple formats
    const value = block.content.show_tags

    // If undefined or null, default to true
    if (value === undefined || value === null) {
      return true
    }

    // Handle string values like "true"/"false" or "1"/"0"
    if (typeof value === 'string') {
      // Check for falsy string values
      if (value === 'false' || value === '0' || value === '') {
        return false
      }
      return true
    }

    // Handle boolean values
    return value === true
  })

  const filteredInterviews = computed(() => {
    return interviews.value
      .filter((interview: Interview) => {
        // Block-level tags (from props)
        const blockTags =
          block.content.tags && typeof block.content.tags === 'string'
            ? (block.content.tags as string)
                .split(',')
                .map((t: string) => t.trim())
            : []

        // Block-level categories (from props)
        const blockCategories =
          block.content.categories && typeof block.content.categories === 'string'
            ? (block.content.categories as string)
                .split(',')
                .map((c: string) => c.trim())
            : []

        // User-selected tag (from UI)
        const userSelectedTag = selectedTag.value

        // Matches block-level tags
        const matchesBlockTags =
          blockTags.length === 0 ||
          blockTags.some((tag: string) => interview.tags.includes(tag))

        // Matches block-level categories
        const matchesBlockCategories =
          blockCategories.length === 0 ||
          blockCategories.some((category: string) =>
            interview.categories.includes(category),
          )

        // Matches user-selected tag
        const matchesUserTag =
          !userSelectedTag || interview.tags.includes(userSelectedTag)

        // Matches user-selected categories (multi-select)
        const userSelectedCategories = selectedCategories.value || []
        const matchesCategory =
          userSelectedCategories.length === 0 ||
          userSelectedCategories.some((cat: string) =>
            interview.categories.includes(cat),
          )

        return (
          matchesBlockTags &&
          matchesUserTag &&
          matchesCategory &&
          matchesBlockCategories
        )
      })
      .sort((a: Interview, b: Interview) => {
        if (!a.date && !b.date) return 0
        if (!a.date) return 1
        if (!b.date) return -1
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
  })

  const mapCategory = (category: string): string =>
    categoryDisplayNames.value[
      category as keyof typeof categoryDisplayNames.value
    ] || category

  const mapTag = (tag: string): string =>
    tagDisplayNames.value[tag as keyof typeof tagDisplayNames.value] || tag

  return {
    selectedCategories,
    selectedTag,
    showCategoryFilter,
    showTagsFilter,
    filteredInterviews,
    categoriesWithInterviews,
    tagsWithInterviews,
    mapCategory,
    mapTag,
  }
}
