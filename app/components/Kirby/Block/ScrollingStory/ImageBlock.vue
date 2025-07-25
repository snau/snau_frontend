<script setup lang="ts">
interface ImageBlockProps {
  block: {
    image: {
      url: string
      srcset?: string
      width?: number
      height?: number
      alt?: string
      caption?: string
      copyright?: string
      focus?: {
        value: string
      }
    }
    ratio?: string
    crop?: boolean
    alt?: string
    caption?: string
    link?: string
    lightbox?: boolean
    offset_bleed?: 'offset' | 'bleed' | string
  }
  textColor?: string
}

const props = defineProps<ImageBlockProps>()

const getImageStyle = (block: ImageBlockProps['block']) => {
  const aspectRatio = block.ratio ? `aspect-ratio:${block.ratio};` : ''
  const objectFit = `object-fit:${block.crop === false ? 'contain' : 'cover'};`
  return `${aspectRatio}${objectFit}`
}

const getObjectPosition = (block: ImageBlockProps['block']) => {
  return block.image.focus?.value
    ? `object-position:${block.image.focus.value};`
    : ''
}

/**
 * PhotoSwipe Lightbox instance
 */
let lightbox: any = null

/**
 * Generate a stable gallery ID for PhotoSwipe grouping
 */
const galleryId = computed(() => {
  const hash = props.block.image.url?.split('/').pop() || Math.random().toString(36).substring(2, 11)
  return `scrolling-image-${hash}`
})

/**
 * Initialize PhotoSwipe Lightbox for ScrollingStory images
 */
const initPhotoSwipe = async () => {
  if (!import.meta.client || !props.block.lightbox) return

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
  if (props.block.lightbox) {
    return props.block.image.url
  }

  // If custom link is provided and lightbox is disabled, use custom link
  if (props.block.link && !props.block.lightbox) {
    return props.block.link
  }

  // Default: no link
  return null
})

onMounted(() => {
  if (props.block.lightbox) {
    nextTick(() => {
      setTimeout(initPhotoSwipe, 100)
    })
  }
})

/**
 * Get container classes based on offset_bleed setting
 */
const getContainerClasses = computed(() => {
  const baseClasses = ['my-6']

  if (props.block.offset_bleed === 'offset') {
    // Offset: Add margin/padding to create visual offset
    baseClasses.push('mx-4 sm:mx-6 lg:mx-8')
  } else if (props.block.offset_bleed === 'bleed') {
    // Bleed: Extend beyond container boundaries (more conservative for ScrollingStory)
    baseClasses.push('-mx-2 sm:-mx-4 lg:-mx-6')
  }

  return baseClasses
})

/**
 * Get figcaption classes based on offset_bleed setting
 */
const getFigcaptionClasses = computed(() => {
  const baseClasses = ['text-sm', 'mt-2', 'text-left']

  if (props.block.offset_bleed === 'offset') {
    // Offset: Align caption with left edge of offset image + same left margin as offset
    baseClasses.push('ml-4', 'sm:ml-6', 'lg:ml-8')
  } else if (props.block.offset_bleed === 'bleed') {
    // Bleed: Reset caption margins for bleed images
    baseClasses.push('mx-2', 'sm:mx-4', 'lg:mx-6')
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
  <figure :class="[
    ...getContainerClasses,
    block.lightbox ? 'pswp-gallery' : ''
  ]" :data-pswp-uid="block.lightbox ? galleryId : undefined" :style="getImageStyle(block)">
    <!-- Conditional wrapper: link or div -->
    <component :is="getLinkHref ? 'a' : 'div'" :href="getLinkHref || undefined"
      :data-pswp-width="block.lightbox ? block.image.width : undefined"
      :data-pswp-height="block.lightbox ? block.image.height : undefined"
      :data-pswp-srcset="block.lightbox ? block.image.srcset : undefined"
      :target="!block.lightbox && block.link ? '_blank' : undefined"
      :rel="!block.lightbox && block.link ? 'noopener noreferrer' : undefined" class="block overflow-hidden rounded-sm"
      :class="[
        getLinkHref ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' : ''
      ]">
      <NuxtImg :src="block.image.url" :width="block.image.width || ''" :height="block.image.height || ''"
        :alt="block.alt || block.image.alt || ''" class="w-full transition-all duration-300 ease-out" :class="[
          block.crop === false ? 'object-contain' : 'object-cover',
          block.crop ? 'h-auto' : 'h-full',
          getLinkHref ? 'hover:scale-105 hover:brightness-105' : ''
        ]" :style="getObjectPosition(block)" loading="lazy" decoding="async" format="avif,webp,jpg" quality="80" />
    </component>

    <figcaption v-if="block.image.copyright" :class="[...getFigcaptionClasses, { 'custom-text-color': textColor }]"
      :style="{ color: textColor || 'inherit' }" v-html="block.image.copyright" />

    <figcaption v-if="block.caption || block.image.caption"
      :class="[...getFigcaptionClasses, { 'custom-text-color': textColor }]" :style="{ color: textColor || 'inherit' }"
      v-html="block.caption || block.image.caption" />
  </figure>
</template>
