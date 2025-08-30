<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import { computed, nextTick, ref, watch } from 'vue'
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
  selectedCategory,
  selectedTag,
  showCategoryFilter: _showCategoryFilter,
  showTagsFilter: _showTagsFilter,
  filteredInterviews,
  categoriesWithInterviews: _categoriesWithInterviews,
  tagsWithInterviews: _tagsWithInterviews,
  mapCategory: _mapCategory,
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

// Function to check if an item should be visible
const isItemVisible = (uri: string) => visibleItems.value.has(uri)

// Function to handle item visibility
const handleItemVisibility = (el: HTMLElement, uri: string) => {
  observeItem(el, uri)
}

// Update hasMore when we reach the end of the list
watch(visibleInterviews, (newValue) => {
  hasMore.value = newValue.length < filteredInterviews.value.length
})

// Reset pagination and grid when filters change
watch([selectedCategory, selectedTag], () => {
  currentPage.value = 1
  hasMore.value = true

  // Smooth scroll to the first interview after a short delay to ensure the DOM has updated
  nextTick(() => {
    firstInterviewRef.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  })
})
</script>

<template>
  <div class="px-8 max-w-screen-4xl mx-auto pb-32">
    <!-- Add this message before the grid -->
    <div
      v-if="filteredInterviews.length === 0"
      class="mt-8 text-center text-stone-500"
    >
      No items match the selected filters.
    </div>

    <!-- Regular grid for card layout -->
    <div
      v-if="filteredInterviews.length > 0 && !usePhotoLayout"
      ref="containerRef"
      class="not-prose mt-6 grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-3"
    >
      <template
        v-for="(interview, index) in visibleInterviews"
        :key="interview.uri"
      >
        <div
          :ref="
            (el) => {
              if (index === 0) {
                firstInterviewRef = el as HTMLElement
                if (el) (el as HTMLElement).style.scrollMarginTop = '8rem'
              }
              el && handleItemVisibility(el as HTMLElement, interview.uri)
            }
          "
          class="transition-opacity duration-500"
          :class="{
            'opacity-0': !isItemVisible(interview.uri),
            'opacity-100': isItemVisible(interview.uri),
          }"
        >
          <div class="h-full">
            <InterviewCard
              :interview="interview"
              :format-date="formatDateShort"
            />
          </div>
        </div>
      </template>

      <!-- Loading indicator -->
      <div v-if="hasMore" ref="loaderRef" class="flex flex-col items-center py-4 gap-2">
        <div
          v-if="isLoading"
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-stone-900"
        ></div>
        <div class="text-sm text-stone-500">
          Showing {{ visibleInterviews.length }} of
          {{ filteredInterviews.length }} interviews
        </div>
      </div>
    </div>

    <!-- Masonry (CSS columns) for photo layout only -->
    <div
      v-else-if="filteredInterviews.length > 0 && usePhotoLayout"
      ref="containerRef"
      class="not-prose cards masonry mt-6 columns-1 sm:columns-2 lg:columns-3"
      :style="{ columnGap: gapValue }"
    >
      <template
        v-for="(interview, index) in visibleInterviews"
        :key="interview.uri"
      >
        <!-- Content for masonry grid items -->
        <div
          :ref="
            (el) => {
              if (index === 0) {
                firstInterviewRef = el as HTMLElement
                if (el) (el as HTMLElement).style.scrollMarginTop = '8rem'
              }
              el && handleItemVisibility(el as HTMLElement, interview.uri)
            }
          "
          class="transition-opacity duration-500 break-inside-avoid inline-block w-full"
          :style="{ breakInside: 'avoid' }"
          :class="{
            'opacity-0': !isItemVisible(interview.uri),
            'opacity-100': isItemVisible(interview.uri),
          }"
        >
          <InterviewPhoto
            :interview="interview"
            :format-date="formatDateShort"
          />
        </div>
      </template>

      <!-- Loading indicator -->
      <div v-if="hasMore" ref="loaderRef" class="flex flex-col items-center py-4 gap-2">
        <div
          v-if="isLoading"
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-stone-900"
        ></div>
        <div class="text-sm text-stone-500">
          Showing {{ visibleInterviews.length }} of
          {{ filteredInterviews.length }} interviews
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure a bit of spacing between items in columns layout (photo layout) */
.masonry.cards > * {
  margin-bottom: 1.5rem;
}
</style>
