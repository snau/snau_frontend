<script setup lang="ts">
/**
 * ScrollingStory Component
 *
 * A dynamic storytelling component that creates an immersive scrolling experience with synchronized
 * content and images. The component is split into two main sections:
 *
 * 1. Left Panel (Desktop):
 *    - Fixed-position images that transition based on scroll position
 *    - Uses Intersection Observer to trigger image changes
 *    - Hidden on mobile for better UX
 *
 * 2. Right Panel:
 *    - Scrollable content with text, images, and various block types
 *    - Responsive layout with different styles for mobile/desktop
 *    - First section on mobile spans full width for impact
 *
 * Features:
 * - Lazy loading of images for performance optimization
 * - Markdown parsing with caching to prevent unnecessary re-renders
 * - Dynamic background colors and gradients per section
 * - Smooth transitions between sections
 * - Accessible image handling with proper alt texts and ARIA attributes
 *
 * @component
 */

import type { KirbyBlock } from '#nuxt-kql'
import type { ResolvedKirbyImage } from '../../../../shared/types/kirby'
import { computed } from 'vue'
import BlockRenderer from './ScrollingStory/BlockRenderer.vue'

/**
 * Defines the structure for the left panel content items
 * Each item represents a fixed-position image that can be referenced by the right content
 */
interface LeftContent {
  coverimage: ResolvedKirbyImage | null // The main image to display in the left panel
  id: string // Unique identifier used for content synchronization
}

/**
 * Defines the structure for the right panel content sections
 * Each section can contain text, custom styling, and additional content blocks
 */
interface RightContent {
  markerReference: string // Links this section to a specific left panel image
  text: string // Main markdown content for the section
  backgroundcolor: string // Primary background color for the section
  secondarybackgroundcolor: string // Secondary color for gradient effects
  textcolor: string // Text color for content in this section
  blocks: any[] | any // Additional content blocks (images, quotes, etc.)
}

// Props interface for component
interface BlockProps {
  block: KirbyBlock<
    'scrolling-story',
    {
      leftcontent: LeftContent[]
      rightcontent: RightContent[]
    }
  >
}

const props = defineProps<BlockProps>()

// Use composables for complex logic
const { currentMarkerIndex, currentImageId } = useScrollingStoryObserver(
  props.block.content.leftcontent,
  props.block.content.rightcontent,
)

const { backgroundStyle } = useScrollingStoryBackground(
  currentMarkerIndex,
  props.block.content.rightcontent,
)

// Compute the text color based on the currently active section
const currentTextColor = computed(() => {
  const index = currentMarkerIndex.value
  if (index === -1 || index >= props.block.content.rightcontent.length)
    return 'inherit'

  const content = props.block.content.rightcontent[index]
  return content?.textcolor || 'inherit'
})

const { parseMarkdown } = useMarkdownParser()

/**
 * Ensures consistent handling of block content
 * Converts single blocks to arrays for unified processing
 *
 * @param blocks - Content blocks that may be either a single block or an array
 * @returns Normalized array of blocks
 */
const normalizeBlocks = (blocks: any): any[] => {
  if (!blocks) return []
  return Array.isArray(blocks) ? blocks : [blocks]
}
</script>

<template>
  <!-- Main container with dynamic background -->
  <div class="lg:flex lg:max-w-full scrolling-story" :style="backgroundStyle">
    <!-- Left panel: Fixed position images (desktop only) -->
    <div class="hidden lg:block lg:w-1/2 lg:h-screen lg:sticky md:top-0 md:overflow-hidden relative">
      <!-- Image stack with fade transitions -->
      <img v-for="item in block.content.leftcontent" :key="item.id"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out" :class="[
          {
            'opacity-100': currentImageId === item.id,
            'opacity-0': currentImageId !== item.id,
          },
        ]" :src="item.coverimage?.url" :srcset="item.coverimage?.srcset" :width="item.coverimage?.width"
        :height="item.coverimage?.height" :alt="item.coverimage?.alt || ''" loading="lazy" />
    </div>

    <!-- Right panel: Scrolling content -->
    <div class="w-full max-w-[100vw] lg:w-1/2 lg:px-8 xl:px-16 2xl:px-24 3xl:px-48 4xl:px-64 5xl:px-80">
      <!-- Content sections with intersection observers -->
      <div v-for="(item, index) in block.content.rightcontent" :key="index" class="column relative" :class="[
        { 'min-h-[50vh]': index !== 0 },
        { 'min-h-screen': index === 0 },
        { 'px-8': index !== 0 },
        { 'lg:mt-44 xl:mt-0': index === 0 },
      ]">
        <!-- Intersection Observer marker -->
        <div class="contentMarker absolute left-0 w-full pointer-events-none"
          :class="[index === 0 ? 'h-screen top-0' : 'h-[50vh] top-1/4']" :data-marker-content="item.markerReference"
          :data-index="String(index)"></div>

        <!-- First section special mobile layout -->
        <template v-if="index === 0">
          <!-- Mobile image with overlay -->
          <div v-if="item.markerReference" class="lg:hidden relative min-h-screen">
            <div class="absolute inset-0">
              <img v-for="leftItem in block.content.leftcontent" v-show="leftItem.id === item.markerReference"
                :key="leftItem.id" :src="leftItem.coverimage?.url" :srcset="leftItem.coverimage?.srcset"
                :width="leftItem.coverimage?.width" :height="leftItem.coverimage?.height"
                :alt="leftItem.coverimage?.alt || ''" class="w-full h-full object-cover transition-opacity duration-500"
                loading="lazy" />

              <!-- Gradient overlay -->
              <div class="absolute inset-0 pointer-events-none" style="
                  background: linear-gradient(
                    to bottom,
                    rgba(0, 0, 0, 0.4) 0%,
                    rgba(0, 0, 0, 0.2) 40%,
                    rgba(0, 0, 0, 0) 100%
                  );
                "></div>
              <!-- Bottom fade-out gradient -->
              <div class="absolute bottom-0 left-0 right-0 h-[50vh] pointer-events-none" :style="{
                background: `linear-gradient(to bottom, 
                  rgba(255,255,255,0) 0%,
                  ${item.backgroundcolor ? item.backgroundcolor.replace(')', ', 0.4)').replace('rgb', 'rgba') : 'rgba(255,255,255,0.4)'} 50%,
                  ${item.backgroundcolor || 'rgb(255,255,255)'} 100%
                )`,
              }"></div>
            </div>

            <!-- Mobile content overlay -->
            <div class="relative z-10 min-h-screen flex flex-col justify-start px-8 pt-[20vh]">
              <div v-if="item.text" class="mb-6" :style="{ color: currentTextColor }"
                v-html="parseMarkdown(item.text)" />
              <div v-if="item.blocks" class="leading-normal mt-6" :style="{ color: currentTextColor }">
                <BlockRenderer v-for="(contentBlock, i) in normalizeBlocks(item.blocks)" :key="i" :block="contentBlock"
                  :text-color="currentTextColor" />
              </div>
            </div>
          </div>

          <!-- Desktop content -->
          <div class="hidden lg:block">
            <div v-if="item.text" class="mb-6" :style="{ color: currentTextColor }" v-html="parseMarkdown(item.text)" />
            <div v-if="item.blocks" class="leading-normal mt-6" :style="{ color: currentTextColor }">
              <BlockRenderer v-for="(contentBlock, i) in normalizeBlocks(item.blocks)" :key="i" :block="contentBlock"
                :text-color="currentTextColor" />
            </div>
          </div>
        </template>

        <!-- Regular sections (not first) -->
        <template v-else>
          <!-- Mobile-only image display -->
          <div v-if="item.markerReference" class="lg:hidden mb-8">
            <div class="relative">
              <img v-for="leftItem in block.content.leftcontent" v-show="leftItem.id === item.markerReference"
                :key="leftItem.id" :src="leftItem.coverimage?.url" :srcset="leftItem.coverimage?.srcset"
                :width="leftItem.coverimage?.width" :height="leftItem.coverimage?.height"
                :alt="leftItem.coverimage?.alt || ''"
                class="w-full h-auto object-cover rounded-lg transition-opacity duration-500" loading="lazy" />
            </div>
          </div>

          <!-- Main text content -->
          <div v-if="item.text" class="mb-6" :style="{ color: currentTextColor }" v-html="parseMarkdown(item.text)" />

          <!-- Dynamic block content -->
          <div v-if="item.blocks" class="leading-normal mt-6" :style="{ color: currentTextColor }">
            <BlockRenderer v-for="(contentBlock, i) in normalizeBlocks(item.blocks)" :key="i" :block="contentBlock"
              :text-color="currentTextColor" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
