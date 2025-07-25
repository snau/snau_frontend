<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { ResolvedKirbyImage } from '../../../../shared/types/kirby'
import { computed } from 'vue'
import { useMarkdownParser } from '@/composables/useMarkdownParser'

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
const page = usePage()
const _invert = computed(() => page.value.invert)

const coverImage = computed(() => {
  // Return the image data directly if it's a single object, otherwise return the array
  if (
    props.block.content.coverimage &&
    !Array.isArray(props.block.content.coverimage)
  ) {
    return [props.block.content.coverimage]
  }
  return props.block.content.coverimage
})

const imageData = computed(() => {
  // Handle both array and single object cases
  if (coverImage.value && coverImage.value.length > 0) {
    return coverImage.value[0]
  }
  return null
})

const heading = computed(() => props.block.content.heading || '')
const subheading = computed(() => props.block.content.subheading)
const text = computed(() => props.block.content.text)
const date = computed(() => props.block.content.date)

// Computed properties for styling
const backgroundStyle = computed(() => {
  const primaryColor = props.block.content.backgroundcolor || 'transparent'
  const secondaryColor = props.block.content.secondarybackgroundcolor

  if (secondaryColor) {
    return {
      background: `linear-gradient(to bottom, ${primaryColor}, ${secondaryColor})`,
      color: props.block.content.textcolor || 'inherit',
    }
  }

  return {
    backgroundColor: primaryColor,
    color: props.block.content.textcolor || 'inherit',
  }
})

const h2Color = computed(() => ({
  color: props.block.content.secondarytextcolor || 'inherit',
}))

// Computed properties for layout classes
const containerClasses = computed(() => {
  const layout = props.block.content.hero_layout || 'left'
  if (layout === 'centered') {
    return 'hero w-full h-full -ml-2 md:ml-0 top-0 left-0'
  }
  return 'hero w-screen sm:grid sm:grid-cols-12 -ml-2 md:ml-0 md:h-full md:w-full'
})

const imageClasses = computed(() => {
  const layout = props.block.content.hero_layout || 'left'
  if (layout === 'centered') {
    return 'column group m-0 overflow-hidden inset-0 w-full h-full'
  }
  return `column group col-span-12 m-0 overflow-hidden md:col-span-6 ${layout === 'right' ? 'md:order-2' : ''}`
})

const contentClasses = computed(() => {
  const layout = props.block.content.hero_layout || 'left'
  const alignment = props.block.content.heading_alignment
  if (layout === 'centered') {
    // Default: center, up: top, down: bottom
    if (alignment === 'up') {
      return 'column not-prose absolute inset-0 flex flex-col items-center justify-start pt-[22vh] z-10 w-full h-full'
    } else if (alignment === 'down') {
      return 'column not-prose absolute inset-0 flex flex-col items-center justify-end pb-[10vh] z-10 w-full h-full'
    }
    return 'column not-prose absolute inset-0 flex flex-col items-center justify-center z-10 w-full h-full'
  }
  // Default: center, up: top, down: bottom
  let base = `column not-prose grid col-span-12 justify-center justify-items-center text-center md:col-span-6 ${layout === 'right' ? 'md:order-1' : 'md:order-2'}`
  if (alignment === 'up') {
    base += ' items-center pt-[22vh]'
  } else if (alignment === 'down') {
    base += ' items-center pb-[5vh]'
  } else {
    base += ' items-center py-12'
  }
  return base
})

// Computed property for image focus style
const imageStyle = computed(() => {
  if (!imageData.value) return {}
  const style: Record<string, string> = {}
  // Object fit
  style.objectFit = objectFit.value
  // Focus
  if (imageData.value.focus) {
    style.objectPosition = imageData.value.focus
  } else if (imageData.value.focusX && imageData.value.focusY) {
    style.objectPosition = `${imageData.value.focusX}% ${imageData.value.focusY}%`
  } else if ((objectFit.value === 'cover' || objectFit.value === 'contain') && props.block.content.image_alignment) {
    // Default object position for alignment
    if (props.block.content.image_alignment === 'up') {
      style.objectPosition = 'center 0%'
    } else if (props.block.content.image_alignment === 'down') {
      style.objectPosition = 'center 100%'
    }
  }
  // If object-fit is 'none', don't stretch image
  if (objectFit.value === 'none') {
    style.width = 'auto'
    style.height = 'auto'
    style.maxWidth = '100%'
    style.maxHeight = '100%'
  }
  return style
})

// Font class helper
const fontClass = (style?: string) => {
  switch (style) {
    case 'font-serif':
      return 'font-serif'
    case 'font-mono':
      return 'font-mono'
    default:
      return 'font-sans'
  }
}
// Font size helper for heading
const headingSizeClass = (size?: string) => {
  switch (size) {
    case 'text-xl':
    case 'text-lg':
    case 'text-md':
    case 'text-small':
    case 'text-xs':
      return size
    default:
      return 'text-xl'
  }
}

// Fade overlay computed
const heroFade = computed(() => props.block.content.hero_fade)

// Object fit computed
const objectFit = computed(() => props.block.content.object_fit || 'cover')

// Tailwind classes for image based on object_fit
const imageTailwindClasses = computed(() => {
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
})
</script>
<template>
  <div class="h-screen min-h-[100]" :class="containerClasses" :style="backgroundStyle">
    <figure v-if="imageData" :class="imageClasses" class="w-full h-screen;">
      <img :class="[
        { kenburns: props.block.content.kenburns === 'effect_on' },
        ...imageTailwindClasses
      ]" loading="lazy" :src="imageData.url" :srcset="imageData.srcset" :width="imageData.width"
        :height="imageData.height" sizes="(min-width: 640px) 50vw, 100vw" :alt="imageData.alt || ''"
        :style="imageStyle" />
      <div v-if="heroFade === 'top'" class="hero-fade-top pointer-events-none" />
      <div v-else-if="heroFade === 'bottom'" class="hero-fade-bottom pointer-events-none" />
    </figure>

    <div :class="contentClasses">
      <div class="column px-12 text-center">
        <h1 class="m-auto px-2 md:max-w-[22ch] leaading-tight"
          :class="[fontClass(props.block.content.heading_style), headingSizeClass(props.block.content.heading_size)]"
          v-html="heading" />
        <h2 v-if="subheading" :style="h2Color" class="text-md pt-4"
          :class="fontClass(props.block.content.subheading_style)" v-html="subheading" />
        <span v-if="date" class="text-base opacity-85 lg:text-base pt-4"
          :class="fontClass(props.block.content.date_style)" :datetime="date" v-html="date" />
        <div v-if="text" class="pt-4" :class="fontClass(props.block.content.text_style)" v-html="text" />
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.hero-fade-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 30%;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  z-index: 2;
}

.hero-fade-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  pointer-events: none;
  background: linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  z-index: 2;
}
</style>
