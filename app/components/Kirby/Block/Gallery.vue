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

const getObjectPosition = (img: ResolvedKirbyImage) => {
  // Handle focus point as object with value property
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
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <figure v-for="(img, index) in block.content.images" :key="index" class="relative overflow-hidden pswp-gallery"
        :style="{
          aspectRatio: block.content.ratio || undefined,
        }">
        <a :href="img.url" :data-pswp-width="img.width" :data-pswp-height="img.height"
          :data-pswp-srcset="img.srcset || ''" :data-pswp-alt="img.alt || ''"
          :data-cropped="block.content.crop !== false" target="_blank" rel="noopener noreferrer"
          class="block w-full h-full cursor-pointer" @mouseenter="preloadImage(img.url)">
          <img :src="img.url" :srcset="img.srcset" :width="img.width" :height="img.height" :alt="img.alt || ''"
            class="w-full h-full transition-transform duration-300 hover:scale-105 rounded-sm" :class="[
              block.content.crop === false ? 'object-contain' : 'object-cover'
            ]" :style="getObjectPosition(img)" loading="lazy" decoding="async" />
        </a>

        <figcaption v-if="img.copyright" class="text-xs mt-1 px-1" :style="{ color: textColor || 'inherit' }"
          v-html="img.copyright" />
      </figure>
    </div>

    <figcaption v-if="block.content.caption" class="text-center text-sm mt-4" :style="{ color: textColor || 'inherit' }"
      v-html="block.content.caption" />
  </div>
</template>

<style scoped>
/* Smooth transition CSS for gallery images */
.pswp-gallery a {
  position: relative;
  overflow: hidden;
}

.pswp-gallery img {
  transition: transform 0.3s ease, filter 0.3s ease;
  will-change: transform;
}

.pswp-gallery a:hover img {
  transform: scale(1.05);
  filter: brightness(1.05);
}

/* Ensure consistent sizing for smooth transitions */
.pswp-gallery figure {
  background-color: #f5f5f5;
  border-radius: 0.25rem;
  overflow: hidden;
}

/* Loading state for better UX */
.pswp-gallery img {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.pswp-gallery img[src] {
  animation: none;
}
</style>
