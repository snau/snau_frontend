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
      subheading_size?: string
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
      // File UUIDs are resolved server-side to the actual image data
      // See: https://kirby.tools/docs/headless/field-methods
    }
  >
}>()

// Optimized: Direct access to content for better performance
const content = computed(() => props.block.content)

// Optimized: Single computed for image handling
const coverImage = computed(() => {
  const images = content.value.coverimage
  if (!images) return null

  // Handle both array and single object cases efficiently
  return Array.isArray(images) ? images : [images]
})

const imageData = computed(() => {
  return coverImage.value?.[0] || null
})

// Optimized: Memoized content computeds
const heading = computed(() => content.value.heading || '')
const subheading = computed(() => content.value.subheading)
const text = computed(() => content.value.text)
const date = computed(() => content.value.date)

// Optimized: Better date formatting with error handling
const formattedDate = computed(() => {
  if (!date.value) return ''

  try {
    const dateObj = new Date(date.value)
    if (Number.isNaN(dateObj.getTime())) return date.value

    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()

    return `${day}.${month}.${year}`
  } catch {
    return date.value
  }
})

// Optimized: Cached layout computeds
const layout = computed(() => content.value.hero_layout || 'left')
const alignment = computed(() => content.value.heading_alignment)
const objectFit = computed(() => content.value.object_fit || 'cover')
const heroFade = computed(() => content.value.hero_fade)

// Styling computeds - kept exactly as original for visual consistency
const backgroundStyle = computed(() => {
  const primaryColor = content.value.backgroundcolor || 'transparent'
  const secondaryColor = content.value.secondarybackgroundcolor

  if (secondaryColor) {
    return {
      background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
    }
  }

  return {
    backgroundColor: primaryColor,
  }
})

const textColorStyle = computed(() => ({
  color: content.value.textcolor || 'inherit',
}))

const h2Color = computed(() => ({
  color: content.value.secondarytextcolor || 'inherit',
}))

// Layout classes - preserved exactly for visual consistency
const containerClasses = computed(() => {
  if (layout.value === 'centered') {
    return 'hero w-full h-full -ml-2 md:ml-0 top-0 left-0'
  }
  return 'hero w-screen md:grid md:grid-cols-12 -ml-2 md:ml-0 md:h-full md:w-full'
})

const imageClasses = computed(() => {
  if (layout.value === 'centered') {
    return 'column group m-0 overflow-hidden inset-0 w-full h-full'
  }
  return `column group col-span-12 m-0 overflow-hidden h-screen md:col-span-6 md:h-full ${layout.value === 'right' ? 'md:order-2' : ''}`
})

const contentClasses = computed(() => {
  if (layout.value === 'centered') {
    // Default: center, up: top, down: bottom
    if (alignment.value === 'up') {
      return 'column not-prose absolute inset-0 flex flex-col items-center justify-start pt-[22vh] z-10 w-full h-full'
    } else if (alignment.value === 'down') {
      return 'column not-prose absolute inset-0 flex flex-col items-center justify-end pb-[10vh] z-10 w-full h-full'
    }
    return 'column not-prose absolute inset-0 flex flex-col items-center justify-center z-10 w-full h-full'
  }

  // Default: center, up: top, down: bottom
  let base = `column not-prose flex flex-col col-span-12 justify-center items-center text-center md:col-span-6 ${layout.value === 'right' ? 'md:order-1' : 'md:order-2'}`
  if (alignment.value === 'up') {
    base += ' items-center pt-[22vh]'
  } else if (alignment.value === 'down') {
    base += ' items-center pb-[5vh]'
  } else {
    base += ' items-center py-12'
  }
  return base
})

// Image styling - preserved exactly
const imageStyle = computed(() => {
  if (!imageData.value) return {}

  const style: Record<string, string> = {}
  style.objectFit = objectFit.value

  // Focus positioning
  if (imageData.value.focus) {
    style.objectPosition = imageData.value.focus
  } else if (imageData.value.focusX && imageData.value.focusY) {
    style.objectPosition = `${imageData.value.focusX}% ${imageData.value.focusY}%`
  } else if (
    (objectFit.value === 'cover' || objectFit.value === 'contain') &&
    content.value.image_alignment
  ) {
    if (content.value.image_alignment === 'up') {
      style.objectPosition = 'center 0%'
    } else if (content.value.image_alignment === 'down') {
      style.objectPosition = 'center 100%'
    }
  }

  // Handle 'none' object-fit
  if (objectFit.value === 'none') {
    style.width = 'auto'
    style.height = 'auto'
    style.maxWidth = '100%'
    style.maxHeight = '100%'
  }

  return style
})

// Optimized: Utility functions with better performance
const fontClass = (style?: string): string => {
  switch (style) {
    case 'font-serif':
      return 'font-serif'
    case 'font-mono':
      return 'font-mono'
    default:
      return 'font-sans'
  }
}

const headingSizeClass = (size?: string): string => {
  switch (size) {
    case 'text-3xl':
    case 'text-2xl':
    case 'text-xl':
    case 'text-lg':
    case 'text-m':
      return size
    default:
      return 'text-xl'
  }
}

const subheadingSizeClass = (size?: string): string => {
  switch (size) {
    case 'text-2xl':
    case 'text-xl':
    case 'text-lg':
    case 'text-md':
      return size
    default:
      return 'text-xl'
  }
}

const subheadingLineHeightClass = computed(() => {
  return content.value.subheading_size === 'text-2xl' ? 'leading-none' : ''
})

const textShadowClass = computed(() => {
  const shadow = content.value.text_shadow
  if (!shadow) return ''

  switch (shadow) {
    case 'shadow_dark':
      return 'text-shadow-dark'
    case 'shadow_light':
      return 'text-shadow-light'
    default:
      return ''
  }
})

// Optimized: Image classes with better performance
const imageTailwindClasses = computed(() => {
  if (layout.value === 'centered') {
    switch (objectFit.value) {
      case 'cover':
        return ['object-cover', 'h-full', 'w-screen']
      case 'contain':
        return ['object-contain', 'h-full', 'w-screen']
      case 'none':
        return ['max-w-full', 'max-h-full']
      default:
        return ['object-cover', 'h-full', 'w-screen']
    }
  } else {
    // For side-by-side layout, use w-full instead of w-screen
    switch (objectFit.value) {
      case 'cover':
        return ['object-cover', 'h-full', 'w-full']
      case 'contain':
        return ['object-contain', 'h-full', 'w-full']
      case 'none':
        return ['max-w-full', 'max-h-full']
      default:
        return ['object-cover', 'h-full', 'w-full']
    }
  }
})

// Optimized: Better image classes computation
const imageClassList = computed(() => [
  { kenburns: content.value.kenburns === 'effect_on' },
  { 'hero-fade-top': heroFade.value === 'top' },
  { 'hero-fade-bottom': heroFade.value === 'bottom' },
  ...imageTailwindClasses.value,
])

// Optimized: Better alt text handling
const imageAlt = computed(() => {
  return imageData.value?.alt || ''
})

// Optimized: Better sizes attribute
const imageSizes = computed(() => {
  return layout.value === 'centered'
    ? '100vw'
    : '(min-width: 640px) 50vw, 100vw'
})
</script>

<template>
  <div
    class="h-screen min-h-[100]"
    :class="containerClasses"
    :style="backgroundStyle"
  >
    <figure v-if="imageData" :class="imageClasses">
      <NuxtImg
        :class="imageClassList"
        loading="lazy"
        :src="imageData.url"
        :width="imageData.width"
        :height="imageData.height"
        :sizes="imageSizes"
        :alt="imageAlt"
        :style="imageStyle"
        quality="80"
        @error="(e) => console.warn('Hero image loading failed:', e)"
      />
    </figure>

    <div :class="contentClasses">
      <div class="column px-12 text-center">
        <h1
          class="m-auto pb-0 md:max-w-[22ch] leaading-tight"
          :class="[
            fontClass(content.heading_style),
            headingSizeClass(content.heading_size),
            textShadowClass,
          ]"
          :style="textColorStyle"
          v-html="heading"
        />

        <h2
          v-if="subheading"
          :style="h2Color"
          class="pb-0"
          :class="[
            fontClass(content.subheading_style),
            subheadingSizeClass(content.subheading_size),
            subheadingLineHeightClass,
          ]"
          v-html="subheading"
        />

        <span
          v-if="date"
          class="text-base opacity-85 lg:text-base pt-4"
          :class="fontClass(content.date_style)"
          :datetime="date"
        >
          {{ formattedDate }}
        </span>

        <div
          v-if="text"
          class="pt-4"
          :class="fontClass(content.text_style)"
          :style="textColorStyle"
          v-html="text"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ken Burns animation with reduced motion support */
@keyframes kenburns {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

.kenburns {
  animation: kenburns 45s ease-in-out infinite;
}

/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  .kenburns {
    animation: none;
  }
}

.hero-fade-top {
  mask: linear-gradient(to bottom, transparent 0%, black 30%);
  -webkit-mask: linear-gradient(to bottom, transparent 0%, black 30%);
}

.hero-fade-bottom {
  mask: linear-gradient(to top, transparent 0%, black 30%);
  -webkit-mask: linear-gradient(to top, transparent 0%, black 30%);
}

.text-shadow-dark,
.text-shadow-dark:hover,
.text-shadow-dark:focus,
.text-shadow-dark:active {
  text-shadow:
    0 0 4rem rgba(0, 0, 0, 0.9),
    0 0 8rem rgba(0, 0, 0, 0.7),
    0 0 12rem rgba(0, 0, 0, 0.5),
    0.125rem 0.125rem 1rem rgba(0, 0, 0, 0.8) !important;
  transition: none !important;
}

.text-shadow-light,
.text-shadow-light:hover,
.text-shadow-light:focus,
.text-shadow-light:active {
  text-shadow:
    0 0 4rem rgba(255, 255, 255, 0.9),
    0 0 8rem rgba(255, 255, 255, 0.7),
    0 0 12rem rgba(255, 255, 255, 0.5),
    0.0625rem 0.0625rem 1rem rgba(255, 255, 255, 0.8) !important;
  transition: none !important;
}

/* Override global heading padding */
h1,
h2,
h3,
h4,
h5,
h6 {
  padding-bottom: 0 !important;
}

/* Force line-height: 1 for text-2xl subheadings */
.leading-none {
  line-height: 1 !important;
}

/* Force grid layout to work properly */
@media (min-width: 768px) {
  .hero.md\:grid {
    display: grid !important;
    grid-template-columns: repeat(12, 1fr) !important;
  }

  .hero .md\:col-span-6 {
    grid-column: span 6 / span 6 !important;
  }

  /* Force figure to fill full height of grid cell */
  .hero figure.md\:col-span-6 {
    height: 100vh !important;
  }

  /* Ensure img fills the figure */
  .hero figure img {
    height: 100% !important;
    width: 100% !important;
  }
}
</style>
