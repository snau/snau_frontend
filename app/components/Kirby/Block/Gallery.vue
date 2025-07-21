<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { ResolvedKirbyImage } from '../../../../shared/types/kirby'

interface GalleryBlockProps {
  block: KirbyBlock<
    'gallery',
    {
      images: ResolvedKirbyImage[]
      ratio?: string
      crop?: boolean
      caption?: string
    }
  >
  textColor?: string
}

const props = defineProps<GalleryBlockProps>()

/**
 * Determines the CSS object-position value for an image based on focus point data
 */
const getObjectPosition = (img: ResolvedKirbyImage): string => {
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
  // Create a stable ID based on the first image URL or block content
  const firstImageUrl = props.block.content.images?.[0]?.url || ''
  const hash =
    firstImageUrl.split('/').pop() ||
    Math.random().toString(36).substring(2, 11)
  return `gallery-${hash}`
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
    setTimeout(initPhotoSwipe, 100)
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
    <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 pswp-gallery" :data-pswp-uid="galleryId">
      <figure v-for="(img, index) in block.content.images" :key="index"
        class="group relative overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-800" :style="{
          aspectRatio: block.content.ratio || undefined,
        }">
        <!-- Image Link -->
        <a :href="img.url" :data-pswp-width="img.width" :data-pswp-height="img.height"
          :data-pswp-srcset="img.srcset || ''" :data-pswp-alt="img.alt || ''"
          :data-cropped="block.content.crop !== false" target="_blank" rel="noopener noreferrer"
          class="block h-full w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm"
          @mouseenter="preloadImage(img.url)">
          <img :src="img.url" :srcset="img.srcset" :width="img.width" :height="img.height" :alt="img.alt || ''"
            :class="getImageClasses(block.content.crop)" :style="{ objectPosition: getObjectPosition(img) }"
            loading="lazy" decoding="async" />
        </a>

        <!-- Image Copyright -->
        <figcaption v-if="img.copyright" class="mt-2 px-1 text-xs text-gray-600 dark:text-gray-400"
          :style="{ color: textColor || undefined }" v-html="img.copyright" />
      </figure>
    </div>

    <!-- Gallery Caption -->
    <figcaption v-if="block.content.caption" class="mt-6 text-center text-sm text-gray-700 dark:text-gray-300"
      :style="{ color: textColor || undefined }" v-html="block.content.caption" />
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
