<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { ResolvedKirbyImage } from '../../../../shared/types/kirby'

defineProps<{
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
}>()

const getObjectPosition = (img: ResolvedKirbyImage, index: number) => {
  // Debug: Log focus point data for each image
  console.warn(`🎯 Gallery Image ${index + 1} Focus Debug:`, {
    url: img.url,
    focus: img.focus,
    focusType: typeof img.focus,
    focusValue: (img.focus as any)?.value, // Check if focus is an object with value
    focusX: img.focusX,
    focusY: img.focusY,
    allImageData: img
  })

  // Handle focus point as object with value property (like ScrollingStory ImageBlock)
  if (img.focus && typeof img.focus === 'object' && (img.focus as any).value) {
    const style = `object-position: ${(img.focus as any).value};`
    console.warn(`🎯 Using focus object value: "${(img.focus as any).value}" -> ${style}`)
    return style
  }

  // Handle focus point as direct string (like "center top", "left bottom", "50% 25%")
  if (img.focus && typeof img.focus === 'string' && img.focus.trim() !== '') {
    const style = `object-position: ${img.focus};`
    console.warn(`🎯 Using focus string: "${img.focus}" -> ${style}`)
    return style
  }

  // Fallback to focusX and focusY percentages if available
  if (typeof img.focusX === 'number' && typeof img.focusY === 'number') {
    const style = `object-position: ${img.focusX}% ${img.focusY}%;`
    console.warn(`🎯 Using focusX/Y: ${img.focusX}%, ${img.focusY}% -> ${style}`)
    return style
  }

  console.warn(`🎯 No valid focus point data found for image ${index + 1}`)
  return ''
}
</script>

<template>
  <div class="my-6">
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <figure v-for="(img, index) in block.content.images" :key="index" class="relative overflow-hidden" :style="{
        aspectRatio: block.content.ratio || undefined,
      }">
        <!-- Debug: Focus point indicator -->
        <div class="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 rounded z-10">
          {{ index + 1 }}:
          {{
            (img.focus && typeof img.focus === 'object' && (img.focus as any).value)
              ? (img.focus as any).value
              : (img.focus && typeof img.focus === 'string' && img.focus.trim() !== '')
                ? img.focus
                : (typeof img.focusX === 'number' && typeof img.focusY === 'number')
                  ? `${img.focusX}%,${img.focusY}%`
                  : 'No focus'
          }}
        </div>

        <img :src="img.url" :srcset="img.srcset" :width="img.width" :height="img.height" :alt="img.alt || ''"
          class="w-full h-full" :class="{
            'object-contain': block.content.crop === false,
            'object-cover': block.content.crop !== false,
          }" :style="getObjectPosition(img, index)" loading="lazy" />
        <figcaption v-if="img.copyright" class="text-sm mt-2" :style="{ color: textColor || 'inherit' }"
          v-html="img.copyright" />
      </figure>
    </div>
    <figcaption v-if="block.content.caption" class="text-center text-sm mt-2" :style="{ color: textColor || 'inherit' }"
      v-html="block.content.caption" />
  </div>
</template>
