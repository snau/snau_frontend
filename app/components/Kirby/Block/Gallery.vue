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

// No longer needed as we're using CSS properties directly in the template
</script>

<template>
  <div class="my-6">
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <figure v-for="(img, index) in block.content.images" :key="index" class="relative overflow-hidden" :style="{
        aspectRatio: block.content.ratio || undefined,
      }">
        <img :src="img.url" :srcset="img.srcset" :width="img.width" :height="img.height" :alt="img.alt || ''"
          class="w-full h-full object-cover" :class="{
            'object-contain': block.content.crop === false,
            'object-cover': block.content.crop !== false,
          }" loading="lazy" />
        <figcaption v-if="img.copyright" class="text-sm mt-2" :style="{ color: textColor || 'inherit' }"
          v-html="img.copyright" />
      </figure>
    </div>
    <figcaption v-if="block.content.caption" class="text-center text-sm mt-2" :style="{ color: textColor || 'inherit' }"
      v-html="block.content.caption" />
  </div>
</template>
