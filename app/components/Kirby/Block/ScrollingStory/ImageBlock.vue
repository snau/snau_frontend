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

/**
 * Check if crop should be disabled - handles various possible values
 */
const isCropDisabled = computed(() => {
  const cropValue = props.block.crop
  return cropValue === false || cropValue === 'false' || cropValue === '0' || cropValue === 0 || cropValue === null
})

const getImageStyle = (block: ImageBlockProps['block']) => {
  // Always apply aspect ratio if it exists - container maintains ratio, image uses object-contain/cover
  const aspectRatio = block.ratio ? `aspect-ratio:${block.ratio};` : ''
  return aspectRatio
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
 * Check if lightbox should be enabled
 */
const isLightboxEnabled = computed(() => {
  const lightboxValue = props.block.lightbox
  return lightboxValue === true || lightboxValue === 'yes' || lightboxValue === '1'
})

/**
 * Initialize PhotoSwipe Lightbox for ScrollingStory images
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
    return props.block.image.url
  }

  // If custom link is provided and lightbox is disabled, use custom link
  if (props.block.link && !isLightboxEnabled.value) {
    return props.block.link
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
 * Get image scale based on offset_bleed setting (only for bleed, not on mobile)
 */
const getImageScale = computed(() => {
  if (props.block.offset_bleed === 'bleed') {
    return 'md:scale-105' // 5% bigger on medium screens and up
  }
  return '' // normal size
})

/**
 * Get figure classes based on offset_bleed setting (not on mobile)
 */
const getFigureBorderClasses = computed(() => {
  const classes = []
  
  if (props.block.offset_bleed === 'offset') {
    classes.push('md:border-8', 'md:border-transparent', 'md:scale-90') // Border + scale entire figure
  }
  
  return classes.join(' ')
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
    'my-6',
    'flex-grow w-full', // Ensure proper sizing in flex containers
    isLightboxEnabled ? 'pswp-gallery' : '',
    getFigureBorderClasses
  ]" :data-pswp-uid="isLightboxEnabled ? galleryId : undefined" :style="getImageStyle(block)">
    <!-- Conditional wrapper: link or div -->
    <component :is="getLinkHref ? 'a' : 'div'" :href="getLinkHref || undefined"
      :data-pswp-width="isLightboxEnabled ? block.image.width : undefined"
      :data-pswp-height="isLightboxEnabled ? block.image.height : undefined"
      :data-pswp-srcset="isLightboxEnabled ? block.image.srcset : undefined"
      :target="!isLightboxEnabled && block.link ? '_blank' : undefined"
      :rel="!isLightboxEnabled && block.link ? 'noopener noreferrer' : undefined" class="block rounded-sm" :class="[
        isCropDisabled ? '' : 'overflow-hidden',
        getLinkHref ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' : ''
      ]">
      <NuxtImg :src="block.image.url" :width="block.image.width || ''" :height="block.image.height || ''"
        :alt="block.alt || block.image.alt || ''" class="w-full transition-all duration-300 ease-out" :class="[
          isCropDisabled ? 'object-contain h-full' : 'object-cover h-full',
          getLinkHref ? 'hover:scale-105 hover:brightness-105' : '',
          getImageScale
        ]" :style="getObjectPosition(block)" loading="lazy" decoding="async" quality="80"
        @error="(e) => console.warn('Image loading failed:', e)" />
    </component>

    <figcaption v-if="block.image.copyright" :class="['text-sm', 'mt-2', 'text-left', { 'custom-text-color': textColor }]"
      :style="{ color: textColor || 'inherit' }" v-html="block.image.copyright" />

    <figcaption v-if="block.caption || block.image.caption"
      :class="['text-sm', 'mt-2', 'text-left', { 'custom-text-color': textColor }]" :style="{ color: textColor || 'inherit' }"
      v-html="block.caption || block.image.caption" />
  </figure>
</template>
