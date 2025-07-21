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

const getObjectPosition = (img: ResolvedKirbyImage, _index: number) => {
  // Handle focus point as object with value property (like ScrollingStory ImageBlock)
  if (img.focus && typeof img.focus === 'object' && (img.focus as any).value) {
    return `object-position: ${(img.focus as any).value};`
  }

  // Handle focus point as direct string
  if (img.focus && typeof img.focus === 'string' && img.focus.trim() !== '') {
    return `object-position: ${img.focus};`
  }

  // Fallback to focusX and focusY percentages
  if (typeof img.focusX === 'number' && typeof img.focusY === 'number') {
    return `object-position: ${img.focusX}% ${img.focusY}%;`
  }

  return ''
}

const getImageStyle = (block: any) => {
  const aspectRatio = block.content.ratio ? `aspect-ratio:${block.content.ratio};` : ''
  const objectFit = `object-fit:${block.content.crop === false ? 'contain' : 'cover'};`
  return `${aspectRatio}${objectFit}`
}
</script>

<template>
  <div class="my-6">
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 pswp-gallery">
      <figure v-for="(img, index) in block.content.images" :key="index" class="relative overflow-hidden" :style="{
        aspectRatio: block.content.ratio || undefined,
      }">
        <a :href="img.url" :data-pswp-width="img.width" :data-pswp-height="img.height"
          :data-pswp-srcset="img.srcset || ''" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
          <img :src="img.url" :srcset="img.srcset" :width="img.width" :height="img.height" :alt="img.alt || ''"
            class="w-full h-full" :class="{
              'object-contain': block.content.crop === false,
              'object-cover': block.content.crop !== false,
            }" :style="getObjectPosition(img, index)" loading="lazy" />
        </a>

        <figcaption v-if="img.copyright" class="text-sm mt-2" :style="{ color: textColor || 'inherit' }"
          v-html="img.copyright" />
      </figure>
    </div>

    <figcaption v-if="block.content.caption" class="text-center text-sm mt-4" :style="{ color: textColor || 'inherit' }"
      v-html="block.content.caption" />
  </div>
</template>
