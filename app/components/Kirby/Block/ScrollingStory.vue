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
import { marked } from 'marked'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

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

// Track the currently visible content section
const currentMarkerIndex = ref(0)
// Track which image should be displayed
const currentImageId = ref<string | null>(null)

// Compute dynamic background styles based on current content section
const backgroundStyle = computed(() => {
  const index = currentMarkerIndex.value
  if (index === -1 || index >= props.block.content.rightcontent.length)
    return {}

  const content = props.block.content.rightcontent[index]
  if (!content) return {}

  const {
    backgroundcolor = 'transparent',
    secondarybackgroundcolor = '',
    textcolor = 'inherit',
  } = content

  const hasGradient =
    secondarybackgroundcolor && secondarybackgroundcolor.trim()

  return {
    ...(hasGradient
      ? {
          background: `linear-gradient(to bottom, ${backgroundcolor}, ${secondarybackgroundcolor})`,
        }
      : { backgroundColor: backgroundcolor }),
    color: textcolor,
    transition: 'background 0.5s ease-in-out, color 0.5s ease-in-out',
  }
})

// Cache for parsed markdown to improve performance
const markdownCache = new Map<string, string>()

/**
 * Parses and caches markdown content to improve performance
 * Uses a Map to store previously parsed content and avoid redundant processing
 *
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

// Intersection Observer instance
let observer: IntersectionObserver | null = null

/**
 * Sets up the Intersection Observer to track scroll position and trigger content updates
 * Handles the synchronization between scrolled content and displayed images
 *
 * Key functionality:
 * - Initializes observer with 50% visibility threshold
 * - Updates currentMarkerIndex and currentImageId when sections become visible
 * - Preloads images to prevent flickering during transitions
 * - Includes error handling for observer setup failures
 */
onMounted(() => {
  // Set initial image ID if available
  if (props.block.content.rightcontent[0]?.markerReference) {
    currentImageId.value = props.block.content.rightcontent[0].markerReference
  }

  // Preload images to prevent flickering during transitions
  props.block.content.leftcontent.forEach(({ coverimage }) => {
    if (coverimage?.url) {
      const img = new Image()
      img.src = coverimage.url
    }
  })

  try {
    // Initialize Intersection Observer to track scroll position
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const marker = entry.target as HTMLElement
            const indexAttr = marker.dataset.index
            const markerContent = marker.dataset.markerContent

            if (indexAttr !== undefined) {
              // Update current section and corresponding image
              const newIndex = Number.parseInt(indexAttr, 10)
              if (currentMarkerIndex.value !== newIndex) {
                currentMarkerIndex.value = newIndex
                currentImageId.value = markerContent || null
              }
              break // Exit after finding first visible marker
            }
          }
        }
      },
      {
        rootMargin: '-20% 0px',
        threshold: [0, 0.25, 0.5],
      },
    )

    // Attach observer to all content markers
    const markers = document.querySelectorAll<HTMLElement>('.contentMarker')
    markers.forEach((marker, index) => {
      marker.dataset.index = String(index)
      observer?.observe(marker)
    })
  } catch (error) {
    console.error('Error setting up intersection observer:', error)
  }
})

// Clean up observer on component unmount
onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

/**
 * Renders a heading block with customizable styling
 * Supports different heading levels, font sizes, and text alignment
 *
 * @param block - The heading block configuration object containing:
 *   - level: Heading level (h1-h6)
 *   - content: The heading text
 *   - font_size: Optional custom font size class
 *   - alignment: Optional text alignment
 *   - serif_sans: Optional font family selection
 * @returns HTML string of the formatted heading
 */
const renderHeading = (block: any): string => {
  if (!block?.content) return ''

  const classes = [
    'my-6',
    block.font_size || '',
    block.alignment ? `text-${block.alignment}` : '',
    block.serif_sans || '',
  ]
    .filter(Boolean)
    .join(' ')

  return `<${block.level || 'h2'} class="${classes}">${block.content}</${block.level || 'h2'}>`
}

/**
 * Renders a text block with configurable font styles
 * @param block The text block configuration
 */
const renderText = (block: any): string => {
  if (!block?.content) return ''

  const classes = [
    'my-4',
    block.font_size || 'text-base',
    block.serif_sans || 'font-sans',
  ]
    .filter(Boolean)
    .join(' ')

  return `<div class="${classes}">${block.content}</div>`
}

/**
 * Renders an intro block with centered text
 * @param block The intro block configuration
 */
const renderIntro = (block: any): string => {
  if (!block?.content?.text) return ''

  return `<div class="grid place-items-center w-full h-screen">
    <h1 class="text-center ${block.content.font_size || ''} ${block.content.serif_sans || ''}">
      ${block.content.text}
    </h1>
  </div>`
}

/**
 * Renders an image block with advanced features
 *
 * Supports:
 * - Responsive images with srcset
 * - Customizable aspect ratios
 * - Image cropping controls
 * - Focus point positioning
 * - Optional captions and copyright information
 * - Lazy loading for performance
 * - Optional linking of images
 *
 * @param block - The image block configuration
 * @returns HTML string of the formatted image with its container
 */
const renderImage = (block: any): string => {
  if (!block?.image?.url) return ''

  const aspectRatio = block.ratio ? `aspect-ratio:${block.ratio};` : ''
  const objectFit = `object-fit:${block.crop === false ? 'contain' : 'cover'};`
  const imageStyle = `${aspectRatio}${objectFit}`
  const objectPosition = block.image.focus?.value
    ? `object-position:${block.image.focus.value};`
    : ''

  const imageHTML = `
    <img 
      src="${block.image.url}" 
      srcset="${block.image.srcset || ''}" 
      width="${block.image.width || ''}" 
      height="${block.image.height || ''}"
      alt="${block.alt || block.image.alt || ''}" 
      class="w-full ${block.crop ? 'h-auto' : 'h-full'} object-cover"
      style="${objectPosition}" 
      loading="lazy" 
    />`

  const captionHTML = [
    block.image.copyright
      ? `<figcaption class="text-sm mt-2 text-gray-600">${block.image.copyright}</figcaption>`
      : '',
    block.caption || block.image.caption
      ? `<figcaption class="text-sm mt-2 text-gray-600">${block.caption || block.image.caption}</figcaption>`
      : '',
  ]
    .filter(Boolean)
    .join('')

  const figureHTML = `<figure class="my-6" style="${imageStyle}">${imageHTML}${captionHTML}</figure>`

  return block.link
    ? `<a rel="noopener noreferrer" target="_blank" href="${block.link}" class="block-image-link">${figureHTML}</a>`
    : figureHTML
}

/**
 * Renders a quote block with optional author attribution
 * @param block The quote block configuration
 */
const renderQuote = (block: any): string => {
  if (!block?.text) return ''

  const alignment = block.alignment ? `text-${block.alignment}` : 'text-left'
  const fontSize = block.font_size || 'text-xl'
  const fontFamily = block.serif_sans || 'font-sans'

  return `<blockquote class="text-base mx-12 lg:my-24 ${alignment}">
    <span class="${fontSize} ${fontFamily}">${block.text}</span>
    ${block.author ? `<footer class="text-sm mt-2">— ${block.author}</footer>` : ''}
  </blockquote>`
}

/**
 * Renders a gallery of images with configurable grid layout
 * @param block The gallery block configuration
 */
const renderGallery = (block: any): string => {
  if (!block?.images?.length) return ''

  const aspectRatio = block.ratio ? `aspect-ratio:${block.ratio};` : ''
  const objectFit = `object-fit:${block.crop === false ? 'contain' : 'cover'};`
  const imageStyle = `${aspectRatio}${objectFit}`

  const imagesHTML = block.images
    .map(
      (img: any) =>
        `<figure style="${imageStyle}">
      <img 
        src="${img.url}" 
        srcset="${img.srcset || ''}" 
        width="${img.width || ''}" 
        height="${img.height || ''}"
        alt="${img.alt || ''}" 
        class="w-full ${block.crop ? 'h-auto' : 'h-full'} object-cover" 
        loading="lazy" 
      />
      ${img.copyright ? `<figcaption class="text-sm mt-2 text-gray-600">${img.copyright}</figcaption>` : ''}
    </figure>`,
    )
    .join('')

  const captionHTML = block.caption
    ? `<figcaption class="text-center text-sm mt-2 text-gray-600">${block.caption}</figcaption>`
    : ''

  return `<div class="my-6">
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">${imagesHTML}</div>
    ${captionHTML}
  </div>`
}

/**
 * Main block renderer that dispatches to specific render functions
 * Includes error handling for unknown block types
 * @param block The block to render
 */
const renderBlock = (block: any): string => {
  if (!block?.type) return ''

  try {
    switch (block.type) {
      case 'heading':
        return renderHeading(block)
      case 'text':
        return renderText(block)
      case 'intro':
        return renderIntro(block)
      case 'image':
        return renderImage(block)
      case 'quote':
        return renderQuote(block)
      case 'gallery':
        return renderGallery(block)
      default:
        return `<div class="my-4">Block type: ${block.type}</div>`
    }
  } catch (error) {
    console.error(`Error rendering block of type ${block.type}:`, error)
    return `<div class="my-4 text-red-500">Error rendering block</div>`
  }
}

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
  <div class="lg:flex lg:max-w-full" :style="backgroundStyle">
    <!-- Left panel: Fixed position images (desktop only) -->
    <div
      class="hidden lg:block lg:w-1/2 lg:h-screen lg:sticky md:top-0 md:overflow-hidden relative"
    >
      <!-- Image stack with fade transitions -->
      <img
        v-for="item in block.content.leftcontent"
        :key="item.id"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
        :class="[
          {
            'opacity-100': currentImageId === item.id,
            'opacity-0': currentImageId !== item.id,
          },
        ]"
        :src="item.coverimage?.url"
        :srcset="item.coverimage?.srcset"
        :width="item.coverimage?.width"
        :height="item.coverimage?.height"
        :alt="item.coverimage?.alt || ''"
        loading="lazy"
      />
    </div>

    <!-- Right panel: Scrolling content -->
    <div
      class="w-full max-w-[100vw] lg:w-1/2 lg:px-8 xl:px-16 2xl:px-24 3xl:px-48 4xl:px-64 5xl:px-80"
    >
      <!-- Content sections with intersection observers -->
      <div
        v-for="(item, index) in block.content.rightcontent"
        :key="index"
        class="column relative"
        :class="[
          { 'min-h-[50vh]': index !== 0 },
          { 'min-h-screen': index === 0 },
          { 'px-8': index !== 0 },
          { 'lg:mt-44 xl:mt-0': index === 0 },
        ]"
      >
        <!-- Intersection Observer marker -->
        <div
          class="contentMarker absolute left-0 w-full pointer-events-none"
          :class="[index === 0 ? 'h-screen top-0' : 'h-[50vh] top-1/4']"
          :data-marker-content="item.markerReference"
          :data-index="String(index)"
        ></div>

        <!-- First section special mobile layout -->
        <template v-if="index === 0">
          <!-- Mobile image with overlay -->
          <div
            v-if="item.markerReference"
            class="lg:hidden relative min-h-screen"
          >
            <div class="absolute inset-0">
              <img
                v-for="leftItem in block.content.leftcontent"
                v-show="leftItem.id === item.markerReference"
                :key="leftItem.id"
                :src="leftItem.coverimage?.url"
                :srcset="leftItem.coverimage?.srcset"
                :width="leftItem.coverimage?.width"
                :height="leftItem.coverimage?.height"
                :alt="leftItem.coverimage?.alt || ''"
                class="w-full h-full object-cover transition-opacity duration-500"
                loading="lazy"
              />

              <!-- Gradient overlay -->
              <div
                class="absolute inset-0 pointer-events-none"
                style="
                  background: linear-gradient(
                    to bottom,
                    rgba(0, 0, 0, 0.4) 0%,
                    rgba(0, 0, 0, 0.2) 40%,
                    rgba(0, 0, 0, 0) 100%
                  );
                "
              ></div>
              <!-- Bottom fade-out gradient -->
              <div
                class="absolute bottom-0 left-0 right-0 h-[50vh] pointer-events-none"
                :style="{
                  background: `linear-gradient(to bottom, 
                  rgba(255,255,255,0) 0%,
                  ${item.backgroundcolor ? item.backgroundcolor.replace(')', ', 0.4)').replace('rgb', 'rgba') : 'rgba(255,255,255,0.4)'} 50%,
                  ${item.backgroundcolor || 'rgb(255,255,255)'} 100%
                )`,
                }"
              ></div>
            </div>

            <!-- Mobile content overlay -->
            <div
              class="relative z-10 min-h-screen flex flex-col justify-start px-8 pt-[20vh]"
            >
              <div
                v-if="item.text"
                class="mb-6 text-white"
                v-html="parseMarkdown(item.text)"
              />
              <div v-if="item.blocks" class="leading-normal mt-6 text-white">
                <div
                  v-for="(contentBlock, i) in normalizeBlocks(item.blocks)"
                  :key="i"
                  v-html="renderBlock(contentBlock)"
                />
              </div>
            </div>
          </div>

          <!-- Desktop content -->
          <div class="hidden lg:block">
            <div
              v-if="item.text"
              class="mb-6"
              v-html="parseMarkdown(item.text)"
            />
            <div v-if="item.blocks" class="leading-normal mt-6">
              <div
                v-for="(contentBlock, i) in normalizeBlocks(item.blocks)"
                :key="i"
                v-html="renderBlock(contentBlock)"
              />
            </div>
          </div>
        </template>

        <!-- Regular sections (not first) -->
        <template v-else>
          <!-- Mobile-only image display -->
          <div v-if="item.markerReference" class="lg:hidden mb-8">
            <div class="relative">
              <img
                v-for="leftItem in block.content.leftcontent"
                v-show="leftItem.id === item.markerReference"
                :key="leftItem.id"
                :src="leftItem.coverimage?.url"
                :srcset="leftItem.coverimage?.srcset"
                :width="leftItem.coverimage?.width"
                :height="leftItem.coverimage?.height"
                :alt="leftItem.coverimage?.alt || ''"
                class="w-full h-auto object-cover rounded-lg transition-opacity duration-500"
                loading="lazy"
              />
            </div>
          </div>

          <!-- Main text content -->
          <div
            v-if="item.text"
            class="mb-6"
            v-html="parseMarkdown(item.text)"
          />

          <!-- Dynamic block content -->
          <div v-if="item.blocks" class="leading-normal mt-6">
            <div
              v-for="(contentBlock, i) in normalizeBlocks(item.blocks)"
              :key="i"
              v-html="renderBlock(contentBlock)"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
