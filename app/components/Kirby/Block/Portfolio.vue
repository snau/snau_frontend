<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import { computed, nextTick, ref, watch } from 'vue'
import { useInfiniteScroll } from '~/composables/useInfiniteScroll'
import { useInterviewData } from '~/composables/useInterviewData'
import { useInterviewFilters } from '~/composables/useInterviewFilters'
import { useMasonryGrid } from '~/composables/useMasonryGrid'
import { useFormatDate } from '~/composables/useFormatDate'
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

// Get the item size value based on the selected option
const itemSizeValue = computed(() => {
  // Only apply item size for photo layout
  if (props.block.content.card_layout !== 'photo') {
    return 500
  }

  const itemSize = props.block.content.item_size || 'medium'
  if (process.client) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--ui-itemsize-${itemSize}`)
      .trim()
  }
  return '500'
})

// Initialize masonry grid for photo layout
const { masonryGrid, handleImageLoaded, resetGrid } = useMasonryGrid({
  columnWidth: Number(itemSizeValue.value),
  gap: gapValue.value,
})

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
  if (usePhotoLayout.value) {
    resetGrid()
  }

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
      class="not-prose cards mt-6 grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4"
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
      <div
        v-if="hasMore"
        ref="loaderRef"
        class="col-span-full flex flex-col items-center py-4 gap-2"
      >
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

    <!-- Masonry grid for photo layout -->
    <div
      v-else-if="filteredInterviews.length > 0 && usePhotoLayout"
      ref="masonryGrid"
      class="masonry-grid mt-6 gap-4"
      style="opacity: 0; visibility: hidden"
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
          class="masonry-item transition-opacity duration-500"
          :class="{
            'opacity-0': !isItemVisible(interview.uri),
            'opacity-100': isItemVisible(interview.uri),
          }"
        >
          <InterviewPhoto
            :interview="interview"
            :format-date="formatDateShort"
            @image-loaded="handleImageLoaded"
          />
        </div>
      </template>

      <!-- Loading indicator -->
      <div
        v-if="hasMore"
        ref="loaderRef"
        class="col-span-full flex flex-col items-center py-4 gap-2"
      >
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
