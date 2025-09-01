<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import { computed, ref, watch } from 'vue'
import { useFormatDate } from '~/composables/useFormatDate'
import { useInfiniteScroll } from '~/composables/useInfiniteScroll'
import { useInterviewData } from '~/composables/useInterviewData'
import { useInterviewFilters } from '~/composables/useInterviewFilters'
import InterviewCard from './Interview/Card.vue'
import InterviewPhoto from './Interview/Photo.vue'

const props = defineProps<{
  block: KirbyBlock<
    | 'category'
    | 'tags'
    | 'selection'
    | 'show_tags'
    | 'show_category'
    | 'card_layout'
    | 'gap'
    | 'item_size'
    | 'categories'
  >
}>()

const { formatDateShort } = useFormatDate()

// Add ref for the first interview element
const firstInterviewRef = ref<HTMLElement | null>(null)

// No JS masonry: use CSS multi-column responsive masonry instead

// Fetch and process interview data
const { processedInterviews } = useInterviewData(props.block)

// Handle interview filtering
// Use destructuring to rename unused variables with underscore prefix
const {
  selectedCategories,
  selectedTag,
  showCategoryFilter,
  showTagsFilter: _showTagsFilter,
  filteredInterviews,
  categoriesWithInterviews,
  tagsWithInterviews: _tagsWithInterviews,
  mapCategory,
  mapTag: _mapTag,
} = useInterviewFilters(processedInterviews, props.block)

// Determine which card layout to use based on the card_layout prop
const usePhotoLayout = computed(() => {
  const layout = props.block.content.card_layout
  return layout === 'photo'
})

// Get the gap value based on the selected option
const gapValue = computed(() => {
  const gap = props.block.content.gap || 'medium'
  return `var(--ui-gap-${gap})`
})

// CSS columns-based masonry handles responsiveness; no JS needed

// Initialize infinite scroll
const {
  containerRef,
  loaderRef,
  isLoading,
  hasMore,
  currentPage,
  itemsPerPage,
  visibleItems,
  observeItem,
} = useInfiniteScroll({
  distance: 200,
  threshold: 0.1,
})

// Compute visible interviews based on pagination
const visibleInterviews = computed(() => {
  const endIndex = currentPage.value * itemsPerPage.value
  return filteredInterviews.value.slice(0, endIndex)
})

// Force a fresh render of the grid/masonry on filter change
const containerKey = computed(() => {
  const cats = selectedCategories.value?.slice().sort().join(',') || ''
  const tag = selectedTag.value || ''
  return `${cats}|${tag}`
})

// Items should render visible immediately to avoid layout gaps on filter changes
const isItemVisible = (_uri: string) => true

// Function to handle item visibility
const handleItemVisibility = (el: HTMLElement, uri: string) => {
  observeItem(el, uri)
}

// Update hasMore when we reach the end of the list
watch(visibleInterviews, (newValue) => {
  hasMore.value = newValue.length < filteredInterviews.value.length
})

// Reset pagination and grid when filters change
watch([selectedCategories, selectedTag], () => {
  // Reset pagination but do not scroll the window
  currentPage.value = 1
  hasMore.value = true
})
</script>

<template>
  <div class="max-w-screen-4xl mx-auto pb-32">
    <div v-if="showCategoryFilter" class="mb-4">
      <div
        class="no-scrollbar -mx-2 flex w-auto gap-2 overflow-x-auto px-2 [scrollbar-width:none] [-ms-overflow-style:none]"
        role="group" aria-label="Filter categories">
        <button v-for="category in categoriesWithInterviews" :key="category" type="button"
          class="whitespace-nowrap rounded-sm border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60"
          :class="selectedCategories.includes(category)
            ? 'border-stone-900 bg-stone-900 text-white shadow-sm dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
            : 'border-stone-200 bg-transparent text-stone-700 hover:border-stone-300 hover:bg-white dark:border-stone-800 dark:text-stone-300 dark:hover:border-stone-700'
            " :aria-pressed="selectedCategories.includes(category)" @click="selectedCategories = selectedCategories.includes(category)
              ? selectedCategories.filter((c) => c !== category)
              : [...selectedCategories, category]">
          {{ mapCategory(category) }}
        </button>
      </div>
    </div>

    <!-- Add this message before the grid -->
    <div v-if="filteredInterviews.length === 0" class="mt-8 text-center text-stone-500">
      No items match the selected filters.
    </div>

    <!-- Regular grid for card layout -->
    <div v-if="filteredInterviews.length > 0 && !usePhotoLayout" ref="containerRef" :key="containerKey"
      class="not-prose mt-6 grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-3">
      <template v-for="(interview, index) in visibleInterviews" :key="interview.uri">
        <div :ref="(el) => {
          if (index === 0) {
            firstInterviewRef = el as HTMLElement
            if (el) (el as HTMLElement).style.scrollMarginTop = '8rem'
          }
          el && handleItemVisibility(el as HTMLElement, interview.uri)
        }
          " class="duration-300">
          <div class="h-full">
            <InterviewCard :interview="interview" :format-date="formatDateShort" />
          </div>
        </div>
      </template>

      <!-- Loading indicator -->
      <div v-if="hasMore" ref="loaderRef" class="flex flex-col items-center py-4 gap-2">
        <div v-if="isLoading" class="animate-spin rounded-sm h-8 w-8 border-t-2 border-b-2 border-stone-900"></div>
        <div class="text-sm text-stone-500">
          Showing {{ visibleInterviews.length }} of
          {{ filteredInterviews.length }} interviews
        </div>
      </div>
    </div>

    <!-- Masonry (CSS columns) for photo layout only -->
    <template v-else-if="filteredInterviews.length > 0 && usePhotoLayout">
      <div ref="containerRef" :key="containerKey"
        class="not-prose cards masonry mt-6 columns-1 sm:columns-2 lg:columns-3" :style="{ columnGap: gapValue }">
        <template v-for="(interview, index) in visibleInterviews" :key="interview.uri">
          <!-- Content for masonry grid items -->
          <div :ref="(el) => {
            if (index === 0) {
              firstInterviewRef = el as HTMLElement
              if (el) (el as HTMLElement).style.scrollMarginTop = '8rem'
            }
            el && handleItemVisibility(el as HTMLElement, interview.uri)
          }
            " class="duration-300 break-inside-avoid inline-block w-full" :style="{ breakInside: 'avoid-column' }">
            <InterviewPhoto :interview="interview" :format-date="formatDateShort" />
          </div>
        </template>
      </div>

      <!-- Loading indicator placed outside the multicol container -->
      <div v-if="hasMore" ref="loaderRef" class="flex flex-col items-center py-4 gap-2">
        <div v-if="isLoading" class="animate-spin rounded-sm h-8 w-8 border-t-2 border-b-2 border-stone-900"></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Ensure a bit of spacing between items in columns layout (photo layout) */
.masonry.cards>* {
  margin-bottom: 1.5rem;
}
</style>
<style scoped>
/* Hide horizontal scrollbar for the pill container across browsers */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
