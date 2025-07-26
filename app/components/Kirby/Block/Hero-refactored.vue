<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { ResolvedKirbyImage } from '../../../../shared/types/kirby'

const props = defineProps<{
  block: KirbyBlock<
    'hero',
    {
      heading?: string
      heading_size?: string
      heading_style?: string
      heading_alignment?: 'up' | 'down'
      subheading?: string
      subheading_style?: string
      date?: string
      date_style?: string
      text?: string
      text_style?: string
      backgroundcolor?: string
      secondarybackgroundcolor?: string
      textcolor?: string
      secondarytextcolor?: string
      text_shadow?: 'shadow_dark' | 'shadow_light'
      coverimage?: ResolvedKirbyImage[]
      hero_layout?: 'left' | 'right' | 'centered'
      hero_fade?: 'top' | 'bottom'
      object_fit?: 'cover' | 'contain' | 'none'
      image_alignment?: 'up' | 'down'
      kenburns?: 'effect_on' | 'effect_off'
    }
  >
}>()

// Destructure content for cleaner access
const content = computed(() => props.block.content)

// Image handling with better performance
const primaryImage = computed((): ResolvedKirbyImage | null => {
  const images = content.value.coverimage
  if (!images) return null

  // Handle both array and single object cases efficiently
  return Array.isArray(images) ? images[0] || null : images
})

// Content computeds - memoized for performance
const headingText = computed(() => content.value.heading?.trim() || '')
const subheadingText = computed(() => content.value.subheading?.trim() || '')
const bodyText = computed(() => content.value.text?.trim() || '')
const dateValue = computed(() => content.value.date)

// Date formatting with proper internationalization
const formattedDate = computed(() => {
  if (!dateValue.value) return ''

  try {
    const date = new Date(dateValue.value)
    if (Number.isNaN(date.getTime())) return dateValue.value

    // Use Intl.DateTimeFormat for better i18n support
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  } catch {
    return dateValue.value
  }
})

// Layout and styling computeds - optimized
const layout = computed(() => content.value.hero_layout || 'left')
const alignment = computed(() => content.value.heading_alignment)
const objectFit = computed(() => content.value.object_fit || 'cover')
const hasKenburns = computed(() => content.value.kenburns === 'effect_on')
const fadeDirection = computed(() => content.value.hero_fade)

// CSS class builders - more maintainable
const containerClasses = computed(() => {
  const baseClasses = 'hero min-h-screen -ml-2 md:ml-0'

  if (layout.value === 'centered') {
    return `${baseClasses} relative w-full h-full`
  }

  return `${baseClasses} w-screen sm:grid sm:grid-cols-12 md:h-full md:w-full`
})

const imageContainerClasses = computed(() => {
  const baseClasses = 'relative overflow-hidden'

  if (layout.value === 'centered') {
    return `${baseClasses} absolute inset-0 w-full h-full`
  }

  const gridClasses = 'col-span-12 md:col-span-6'
  const orderClass = layout.value === 'right' ? 'md:order-2' : ''

  return `${baseClasses} ${gridClasses} ${orderClass} w-full h-screen`
})

const contentClasses = computed(() => {
  const baseClasses = 'relative z-10 flex flex-col items-center text-center'

  if (layout.value === 'centered') {
    const positionClasses = {
      up: 'absolute inset-0 justify-start pt-[22vh]',
      down: 'absolute inset-0 justify-end pb-[10vh]',
      default: 'absolute inset-0 justify-center'
    }

    const position = alignment.value === 'up' ? 'up' :
      alignment.value === 'down' ? 'down' : 'default'

    return `${baseClasses} ${positionClasses[position]} w-full h-full`
  }

  const gridClasses = 'col-span-12 md:col-span-6'
  const orderClass = layout.value === 'right' ? 'md:order-1' : 'md:order-2'
  const alignmentClasses = {
    up: 'justify-start pt-[22vh]',
    down: 'justify-end pb-[5vh]',
    default: 'justify-center py-12'
  }

  const alignmentClass = alignment.value === 'up' ? 'up' :
    alignment.value === 'down' ? 'down' : 'default'

  return `${baseClasses} ${gridClasses} ${orderClass} ${alignmentClasses[alignmentClass]}`
})

// Style objects - computed for reactivity
const backgroundStyles = computed(() => {
  const primary = content.value.backgroundcolor || 'transparent'
  const secondary = content.value.secondarybackgroundcolor

  if (secondary) {
    return {
      background: `linear-gradient(to bottom, ${primary}, ${secondary})`
    }
  }

  return { backgroundColor: primary }
})

const textStyles = computed(() => ({
  color: content.value.textcolor || 'inherit'
}))

const subheadingStyles = computed(() => ({
  color: content.value.secondarytextcolor || 'inherit'
}))

// Image styling with better performance
const imageStyles = computed(() => {
  if (!primaryImage.value) return {}

  const styles: Record<string, string> = {
    objectFit: objectFit.value
  }

  // Handle focus positioning
  const image = primaryImage.value
  if (image.focus) {
    styles.objectPosition = image.focus
  } else if (image.focusX !== undefined && image.focusY !== undefined) {
    styles.objectPosition = `${image.focusX}% ${image.focusY}%`
  } else if (content.value.image_alignment && objectFit.value !== 'none') {
    styles.objectPosition = content.value.image_alignment === 'up' ?
      'center 0%' : 'center 100%'
  }

  // Handle 'none' object-fit
  if (objectFit.value === 'none') {
    Object.assign(styles, {
      width: 'auto',
      height: 'auto',
      maxWidth: '100%',
      maxHeight: '100%'
    })
  }

  return styles
})

// Utility functions for CSS classes
const getFontClass = (fontStyle?: string): string => {
  const fontMap: Record<string, string> = {
    'font-serif': 'font-serif',
    'font-mono': 'font-mono'
  }
  return fontMap[fontStyle || ''] || 'font-sans'
}

const getHeadingSizeClass = (size?: string): string => {
  const validSizes = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-m']
  return validSizes.includes(size || '') ? size! : 'text-xl'
}

const getTextShadowClass = (shadow?: string): string => {
  const shadowMap: Record<string, string> = {
    'shadow_dark': 'text-shadow-dark',
    'shadow_light': 'text-shadow-light'
  }
  return shadowMap[shadow || ''] || ''
}

// Image classes with better organization
const imageClasses = computed(() => {
  const classes = ['w-full', 'h-full']

  // Object fit classes
  switch (objectFit.value) {
    case 'cover':
      classes.push('object-cover')
      break
    case 'contain':
      classes.push('object-contain')
      break
    case 'none':
      classes.push('max-w-full', 'max-h-full')
      break
    default:
      classes.push('object-cover')
  }

  // Animation classes
  if (hasKenburns.value) {
    classes.push('motion-safe:animate-kenburns', 'motion-reduce:animate-none')
  }

  // Fade classes
  if (fadeDirection.value === 'top') {
    classes.push('hero-fade-top')
  } else if (fadeDirection.value === 'bottom') {
    classes.push('hero-fade-bottom')
  }

  return classes
})

// Accessibility helpers
const getImageAlt = computed(() => {
  return primaryImage.value?.alt ||
    (headingText.value ? `Hero image for: ${headingText.value}` : 'Hero image')
})

const getImageSizes = computed(() => {
  // Optimized sizes based on layout
  if (layout.value === 'centered') {
    return '100vw'
  }
  return '(min-width: 768px) 50vw, 100vw'
})

// Sanitize HTML content for security
const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper sanitization library
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}
</script>

<template>
  <section class="hero-section" :class="containerClasses" :style="backgroundStyles" role="banner"
    :aria-label="headingText ? `Hero section: ${headingText}` : 'Hero section'">
    <!-- Background Image -->
    <figure v-if="primaryImage" :class="imageContainerClasses" class="hero-image-container">
      <img :class="imageClasses" :src="primaryImage.url" :srcset="primaryImage.srcset" :width="primaryImage.width"
        :height="primaryImage.height" :sizes="getImageSizes" :alt="getImageAlt" :style="imageStyles" loading="lazy"
        decoding="async" fetchpriority="high" />
    </figure>

    <!-- Content Overlay -->
    <div :class="contentClasses" class="hero-content">
      <div class="hero-content-inner px-6 sm:px-12 text-center max-w-4xl">
        <!-- Main Heading -->
        <h1 v-if="headingText" class="hero-heading m-0 pb-0 leading-tight" :class="[
          getFontClass(content.heading_style),
          getHeadingSizeClass(content.heading_size),
          getTextShadowClass(content.text_shadow)
        ]" :style="textStyles" v-html="sanitizeHtml(headingText)" />

        <!-- Subheading -->
        <h2 v-if="subheadingText" class="hero-subheading text-lg md:text-xl mt-4 mb-0 leading-relaxed"
          :class="getFontClass(content.subheading_style)" :style="subheadingStyles"
          v-html="sanitizeHtml(subheadingText)" />

        <!-- Date -->
        <time v-if="dateValue && formattedDate" class="hero-date block text-base opacity-85 mt-4"
          :class="getFontClass(content.date_style)" :datetime="dateValue" :style="textStyles">
          {{ formattedDate }}
        </time>

        <!-- Body Text -->
        <div v-if="bodyText" class="hero-text mt-6 text-base md:text-lg leading-relaxed"
          :class="getFontClass(content.text_style)" :style="textStyles" v-html="sanitizeHtml(bodyText)" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Ken Burns animation with reduced motion support */
@keyframes kenburns {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .motion-safe\:animate-kenburns {
    animation: kenburns 45s ease-in-out infinite;
  }
}

.motion-reduce\:animate-none {
  animation: none !important;
}

/* Fade effects with better browser support */
.hero-fade-top {
  mask: linear-gradient(to bottom, transparent 0%, black 30%);
  -webkit-mask: linear-gradient(to bottom, transparent 0%, black 30%);
}

.hero-fade-bottom {
  mask: linear-gradient(to top, transparent 0%, black 30%);
  -webkit-mask: linear-gradient(to top, transparent 0%, black 30%);
}

/* Text shadow utilities with better performance */
.text-shadow-dark {
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 4px 8px rgba(0, 0, 0, 0.6),
    0 8px 16px rgba(0, 0, 0, 0.4);
}

.text-shadow-light {
  text-shadow:
    0 2px 4px rgba(255, 255, 255, 0.8),
    0 4px 8px rgba(255, 255, 255, 0.6),
    0 8px 16px rgba(255, 255, 255, 0.4);
}

/* Improved focus styles for accessibility */
.hero-content-inner h1:focus,
.hero-content-inner h2:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Better responsive typography */
.hero-heading {
  font-size: clamp(1.5rem, 4vw, 3rem);
  max-width: 22ch;
  margin-left: auto;
  margin-right: auto;
}

.hero-subheading {
  max-width: 32ch;
  margin-left: auto;
  margin-right: auto;
}

/* Ensure proper stacking context */
.hero-image-container {
  z-index: 1;
}

.hero-content {
  z-index: 10;
}

/* High contrast mode support */
@media (prefers-contrast: high) {

  .text-shadow-dark,
  .text-shadow-light {
    text-shadow: none;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
}

/* Print styles */
@media print {
  .hero-section {
    height: auto !important;
    min-height: auto !important;
  }

  .hero-image-container {
    position: static !important;
  }

  .hero-content {
    position: static !important;
    color: black !important;
  }

  .text-shadow-dark,
  .text-shadow-light {
    text-shadow: none !important;
  }
}
</style>