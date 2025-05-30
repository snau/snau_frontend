<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { ResolvedKirbyImage } from '../../../../shared/types/kirby'
import { computed } from 'vue'

const props = defineProps<{
  block: KirbyBlock<
    'hero',
    {
      heading?: string
      subheading?: string
      date?: string
      text?: string
      backgroundcolor?: string
      secondarybackgroundcolor?: string
      textcolor?: string
      secondarytextcolor?: string
      coverimage?: ResolvedKirbyImage[]
      hero_layout?: 'left' | 'right' | 'centered'
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

const heading = computed(() => props.block.content.heading)
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
  if (layout === 'centered') {
    return 'column not-prose absolute inset-0 flex items-center justify-center z-10'
  }
  return `column not-prose grid col-span-12 items-center justify-center justify-items-center py-12 text-center md:col-span-6 ${layout === 'right' ? 'md:order-1' : 'md:order-2'}`
})

// Computed property for image focus style
const imageStyle = computed(() => {
  if (!imageData.value) return {}
  const style: Record<string, string> = {}
  if (imageData.value.focus) {
    style.objectPosition = imageData.value.focus
  } else if (imageData.value.focusX && imageData.value.focusY) {
    style.objectPosition = `${imageData.value.focusX}% ${imageData.value.focusY}%`
  }
  return style
})
</script>
<template>
  <div
    class="h-screen min-h-[85vh]"
    :class="containerClasses"
    :style="backgroundStyle"
  >
    <figure v-if="imageData" :class="imageClasses" class="w-full h-screen;">
      <img
        class="h-full w-screen object-cover"
        :class="[{ kenburns: props.block.content.hero_layout === 'centered' }]"
        loading="lazy"
        :src="imageData.url"
        :srcset="imageData.srcset"
        :width="imageData.width"
        :height="imageData.height"
        sizes="(min-width: 640px) 50vw, 100vw"
        :alt="imageData.alt || ''"
        :style="imageStyle"
      />
    </figure>

    <div :class="contentClasses">
      <div class="column px-4 text-center">
        <h1
          class="m-auto px-2 text-2xl font-bold font-sans italic md:max-w-[22ch] lg:text-3xl xl:text-4xl"
          v-html="heading"
        />
        <h2
          :style="h2Color"
          class="mt-4 text-lg font-normal tracking-wider font-sans opacity-85 md:text-xl"
          v-html="subheading"
        />
        <span
          class="text-sm opacity-85 lg:text-base"
          :datetime="date"
          v-html="date"
        />
        <p v-html="text" />
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
</style>
