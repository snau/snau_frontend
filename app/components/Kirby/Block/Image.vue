<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { ResolvedKirbyImage } from '../../../../shared/types/kirby'

const props = defineProps<{
  block: KirbyBlock<
    'image-resolved',
    {
      location: string
      // File UUIDs are resolved server-side to the actual image data
      // See: https://kirby.tools/docs/headless/field-methods
      image: ResolvedKirbyImage[]
      src: string
      alt: string
      caption: string
      link: string
      ratio: string
      crop: boolean
      lightbox?: boolean
      offset_bleed?: 'offset' | 'bleed' | string
    }
  >
  textColor?: string
}>()

const figure = ref<HTMLElement | undefined>()
const { width } = useElementSize(figure)

/**
 * PhotoSwipe Lightbox instance
 */
let lightbox: any = null

/**
 * Generate a stable gallery ID for PhotoSwipe grouping
 */
const galleryId = computed(() => {
  const imageUrl = props.block.content.image?.[0]?.url || props.block.content.src
  const hash = imageUrl?.split('/').pop() || Math.random().toString(36).substring(2, 11)
  return `image-${hash}`
})

/**
 * Check if lightbox should be enabled
 */
const isLightboxEnabled = computed(() => {
  const lightboxValue = props.block.content.lightbox
  return lightboxValue === true || lightboxValue === 'yes' || lightboxValue === '1'
})

/**
 * Initialize PhotoSwipe Lightbox for single images
 */
const initPhotoSwipe = async () => {
  if (!import.meta.client || !isLightboxEnabled.value) return

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
      preloadFirstSlide: false,
      showAnimationDuration: 300,
      hideAnimationDuration: 200,
    })

    // Initialize the lightbox
    lightbox.init()
  } catch (error) {
    console.warn('PhotoSwipe initialization failed:', error)
  }
}

/**
 * Determine the appropriate href for the link
 */
const getLinkHref = computed(() => {
  // If lightbox is enabled, return the full image URL for PhotoSwipe
  if (isLightboxEnabled.value) {
    return props.block.content.image?.[0]?.url || props.block.content.src
  }

  // If custom link is provided and lightbox is disabled, use custom link
  if (props.block.content.link && !isLightboxEnabled.value) {
    return props.block.content.link
  }

  // Default: no link
  return null
})

onMounted(() => {
  if (isLightboxEnabled.value) {
    nextTick(() => {
      setTimeout(initPhotoSwipe, 100)
    })
  }
})

/**
 * Get container classes based on offset_bleed setting
 */
const getContainerClasses = computed(() => {
  const baseClasses = []

  if (props.block.content.offset_bleed === 'offset') {
    // Offset: Add margin/padding to create visual offset
    baseClasses.push('mx-4 sm:mx-8 lg:mx-12')
  } else if (props.block.content.offset_bleed === 'bleed') {
    // Bleed: Extend beyond container boundaries
    baseClasses.push('-mx-4 sm:-mx-8 lg:-mx-12 xl:-mx-16')
  }

  return baseClasses
})

/**
 * Get figcaption classes based on offset_bleed setting
 */
const getFigcaptionClasses = computed(() => {
  const baseClasses = ['mt-2', 'text-sm', 'text-left']

  if (props.block.content.offset_bleed === 'offset') {
    // Offset: Align caption with left edge of offset image + same left margin as offset
    baseClasses.push('ml-4', 'sm:ml-8', 'lg:ml-12')
  } else if (props.block.content.offset_bleed === 'bleed') {
    // Bleed: Reset caption margins for bleed images
    baseClasses.push('mx-4', 'sm:mx-8', 'lg:mx-12', 'xl:mx-16')
  }

  return baseClasses
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
  <figure ref="figure" :class="[
    isLightboxEnabled ? 'pswp-gallery' : '',
    'flex-grow w-full', // Ensure proper sizing in flex containers
    ...getContainerClasses
  ]" :data-pswp-uid="isLightboxEnabled ? galleryId : undefined">
    <!-- Conditional wrapper: link or div -->
    <component :is="getLinkHref ? 'a' : 'div'" :href="getLinkHref || undefined"
      :data-pswp-width="isLightboxEnabled ? (block.content.image?.[0]?.width) : undefined"
      :data-pswp-height="isLightboxEnabled ? (block.content.image?.[0]?.height) : undefined"
      :data-pswp-srcset="isLightboxEnabled ? (block.content.image?.[0]?.srcset) : undefined"
      :data-contain="block.content.crop === false || undefined"
      :target="!isLightboxEnabled && block.content.link ? '_blank' : undefined"
      :rel="!isLightboxEnabled && block.content.link ? 'noopener noreferrer' : undefined" :style="{
        aspectRatio: block.content.ratio || undefined,
      }" class="block overflow-hidden rounded-sm" :class="[
        getLinkHref ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' : ''
      ]">
      <NuxtImg
        :src="block.content.location === 'web' ? block.content.src : (block.content.image?.[0]?.url || block.content.src)"
        :width="block.content.image?.[0]?.width || ''" :height="block.content.image?.[0]?.height || ''"
        :sizes="`${width}px`" :alt="block.content.alt || block.content.image?.[0]?.alt || ''"
        class="w-full h-full transition-all duration-300 ease-out" :class="[
          block.content.crop === false ? 'object-contain' : 'object-cover',
          getLinkHref ? 'hover:scale-105 hover:brightness-105' : ''
        ]" :style="{
          objectPosition: block.content.image?.[0]?.focus || 'center center'
        }" loading="lazy" decoding="async" format="avif,webp,jpg" quality="80" preset="default" />
    </component>

    <figcaption v-if="block.content.caption" :class="[...getFigcaptionClasses, { 'custom-text-color': textColor }]"
      :style="{ color: textColor || 'inherit' }" v-html="block.content.caption" />
  </figure>
</template>
