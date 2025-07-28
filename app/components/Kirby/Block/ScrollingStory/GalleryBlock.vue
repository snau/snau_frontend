<script setup lang="ts">
interface GalleryImage {
  url: string
  srcset?: string
  width?: number
  height?: number
  alt?: string
  copyright?: string
  focus?: string | { value: string }
  focusX?: number
  focusY?: number
}

interface GalleryBlockProps {
  block: {
    type?: string
    content?: {
      images: (GalleryImage | string)[] // Can be resolved images or file IDs
      ratio?: string
      crop?: boolean | string
      caption?: string
    }
    images?: (GalleryImage | string)[] // Fallback for direct images prop
    ratio?: string
    crop?: boolean | string
    caption?: string
  }
  textColor?: string
}

const props = defineProps<GalleryBlockProps>()

/**
 * Get the images array from the block, handling different data structures
 */
const getImages = (
  block: GalleryBlockProps['block'],
): (GalleryImage | string)[] => {
  // Try content.images first (Kirby block structure)
  if (block.content?.images) {
    return block.content.images
  }
  // Fallback to direct images property
  if (block.images) {
    return block.images
  }
  return []
}

/**
 * Get block properties, handling nested content structure
 */
const getBlockProp = (block: GalleryBlockProps['block'], prop: string): any => {
  if (block.content && prop in block.content) {
    return (block.content as any)[prop]
  }
  return (block as any)[prop]
}

/**
 * Check if an image is a resolved image object or just a file ID
 */
const isResolvedImage = (img: GalleryImage | string): img is GalleryImage => {
  return typeof img === 'object' && img !== null && 'url' in img
}

/**
 * Determines the CSS object-position value for an image based on focus point data
 */
const getObjectPosition = (img: GalleryImage): string => {
  // Handle focus point as object with value property
  if (img.focus && typeof img.focus === 'object' && (img.focus as any).value) {
    return (img.focus as any).value
  }

  // Handle focus point as direct string
  if (img.focus && typeof img.focus === 'string' && img.focus.trim() !== '') {
    return img.focus
  }

  // Fallback to focusX and focusY percentages
  if (typeof img.focusX === 'number' && typeof img.focusY === 'number') {
    return `${img.focusX}% ${img.focusY}%`
  }

  return 'center center'
}

/**
 * Computes Tailwind classes for image object-fit behavior
 */
const getImageClasses = (crop: boolean | undefined): string => {
  const baseClasses =
    'w-full h-full transition-all duration-300 ease-out rounded-sm'
  const fitClass = crop === false ? 'object-contain' : 'object-cover'
  const hoverClasses = 'hover:scale-105 hover:brightness-105'

  return `${baseClasses} ${fitClass} ${hoverClasses}`
}

/**
 * Generate a stable gallery ID for PhotoSwipe grouping
 */
const galleryId = computed(() => {
  const images = getImages(props.block)
  const firstImage = images.find(isResolvedImage)
  const hash =
    firstImage?.url?.split('/').pop() ||
    Math.random().toString(36).substring(2, 11)
  return `gallery-scrolling-${hash}`
})

/**
 * Preloads an image for better UX when hovering
 */
const preloadImage = (url: string): void => {
  if (import.meta.client) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  }
}

/**
 * PhotoSwipe Lightbox instance
 */
let lightbox: any = null

/**
 * Initialize PhotoSwipe Lightbox properly for Vue/Nuxt
 */
const initPhotoSwipe = async () => {
  if (!import.meta.client) return

  try {
    // Dynamic import of PhotoSwipe modules
    const { default: PhotoSwipeLightbox } = await import('photoswipe/lightbox')

    // Clean up existing instance
    if (lightbox) {
      lightbox.destroy()
      lightbox = null
    }

    // Create new lightbox instance
    lightbox = new PhotoSwipeLightbox({
      gallery: `[data-pswp-uid="${galleryId.value}"]`,
      children: 'a',
      pswpModule: () => import('photoswipe'),

      // Better performance options
      preloadFirstSlide: false,

      // Animation options
      showAnimationDuration: 300,
      hideAnimationDuration: 200,
    })

    // Initialize the lightbox
    lightbox.init()
  } catch (error) {
    console.warn('PhotoSwipe initialization failed:', error)
  }
}

onMounted(() => {
  nextTick(() => {
    setTimeout(initPhotoSwipe, 150) // Slightly longer delay for ScrollingStory
  })
})

onBeforeUnmount(() => {
  // Clean up PhotoSwipe instance
  if (lightbox) {
    lightbox.destroy()
    lightbox = null
  }
})
</script>

<template>
  <section class="my-8">
    <!-- Gallery Grid -->
    <div
      v-if="getImages(block).length && getImages(block).some(isResolvedImage)"
      class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 pswp-gallery"
      :data-pswp-uid="galleryId"
    >
      <figure
        v-for="(img, index) in getImages(block).filter(isResolvedImage)"
        :key="index"
        class="group relative overflow-hidden rounded-sm"
        :style="{
          aspectRatio: getBlockProp(block, 'ratio') || '1/1',
          minHeight: '200px',
        }"
      >
        <!-- Image Link -->
        <a
          :href="img.url"
          :data-pswp-width="img.width"
          :data-pswp-height="img.height"
          :data-pswp-srcset="img.srcset || ''"
          :data-pswp-alt="img.alt || ''"
          :data-cropped="getBlockProp(block, 'crop') !== false"
          target="_blank"
          rel="noopener noreferrer"
          class="block h-full w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm"
          @mouseenter="preloadImage(img.url)"
        >
          <img
            :src="img.url"
            :srcset="img.srcset"
            :width="img.width"
            :height="img.height"
            :alt="img.alt || ''"
            :class="getImageClasses(getBlockProp(block, 'crop'))"
            :style="{ objectPosition: getObjectPosition(img) }"
            loading="lazy"
            decoding="async"
          />
        </a>

        <!-- Image Copyright -->
        <figcaption
          v-if="img.copyright"
          class="mt-2 px-1 text-xs text-gray-600 dark:text-gray-400"
          :style="{ color: textColor || undefined }"
          v-html="img.copyright"
        />
      </figure>
    </div>

    <!-- Gallery Caption -->
    <figcaption
      v-if="getBlockProp(block, 'caption')"
      class="mt-6 text-center text-sm text-gray-700 dark:text-gray-300"
      :style="{ color: textColor || undefined }"
      v-html="getBlockProp(block, 'caption')"
    />
  </section>
</template>

<style scoped>
/* Enhanced loading shimmer animation */
.pswp-gallery img {
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
}

.pswp-gallery img[src] {
  animation: none;
  background: none;
}

/* Dark mode shimmer */
@media (prefers-color-scheme: dark) {
  .pswp-gallery img {
    background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

/* Smooth hover transitions */
.pswp-gallery a {
  will-change: transform;
}

.pswp-gallery img {
  will-change: transform, filter;
}
</style>
