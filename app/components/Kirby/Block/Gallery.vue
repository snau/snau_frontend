<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { ResolvedKirbyImage } from '../../../../shared/types/kirby'

const props = defineProps<{
  block: KirbyBlock<
    'gallery' | 'gallery-resolved',
    {
      images: ResolvedKirbyImage[] | string[]
      ratio?: string
      crop?: boolean
      caption?: string
    }
  >
  textColor?: string
}>()

// Debug: Log the entire block structure
console.warn('🖼️ Gallery Block - Full Props:', props)
console.warn('🖼️ Gallery Block - Block Type:', props.block?.type)
console.warn('🖼️ Gallery Block - Block Content:', props.block?.content)
console.warn('🖼️ Gallery Block - Images:', props.block?.content?.images)
console.warn('🖼️ Gallery Block - First Image:', props.block?.content?.images?.[0])

const getImageStyle = (block: { ratio?: string; crop?: boolean }) => {
  const aspectRatio = block.ratio ? `aspect-ratio:${block.ratio};` : ''
  const objectFit = `object-fit:${block.crop === false ? 'contain' : 'cover'};`
  return `${aspectRatio}${objectFit}`
}
</script>

<template>
  <div class="my-6">
    <!-- Debug Panel -->
    <div class="bg-blue-50 border border-blue-200 p-4 mb-4 text-sm">
      <h4 class="font-bold text-blue-800 mb-2">🔍 Gallery Debug Info</h4>
      <div class="space-y-1 text-blue-700">
        <div><strong>Block exists:</strong> {{ !!block }}</div>
        <div><strong>Block type:</strong> {{ block?.type || 'undefined' }}</div>
        <div><strong>Content exists:</strong> {{ !!block?.content }}</div>
        <div><strong>Images array:</strong> {{ block?.content?.images || 'undefined' }}</div>
        <div><strong>Images count:</strong> {{ block?.content?.images?.length || 0 }}</div>
        <div><strong>Caption:</strong> {{ block?.content?.caption || 'No caption' }}</div>
        <div><strong>Ratio:</strong> {{ block?.content?.ratio || 'No ratio' }}</div>
        <div><strong>Crop:</strong> {{ block?.content?.crop }}</div>
      </div>
    </div>

    <!-- Show raw JSON for debugging -->
    <details class="mb-4">
      <summary class="cursor-pointer text-sm font-medium text-gray-600">Show Raw Block Data</summary>
      <pre class="bg-gray-100 p-2 text-xs overflow-auto mt-2">{{ JSON.stringify(block, null, 2) }}</pre>
    </details>

    <!-- Gallery Content -->
    <div v-if="block?.content?.images?.length" class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Handle resolved images (objects with url, srcset, etc.) -->
      <template v-if="typeof block.content.images[0] === 'object'">
        <figure v-for="(img, index) in block.content.images" :key="index" :style="getImageStyle(block.content)">
          <div class="bg-yellow-100 p-1 text-xs mb-1">
            Image {{ index + 1 }}: {{ img.url || 'No URL' }}
          </div>
          <img :src="img.url" :srcset="img.srcset" :width="img.width" :height="img.height" :alt="img.alt || ''"
            class="w-full object-cover" :class="[block.content.crop ? 'h-auto' : 'h-full']" loading="lazy" />
          <figcaption v-if="img.copyright" class="text-sm mt-2" :style="{ color: textColor || 'inherit' }"
            v-html="img.copyright" />
        </figure>
      </template>

      <!-- Handle unresolved images (file UUIDs) -->
      <template v-else>
        <div v-for="(fileId, index) in block.content.images" :key="index"
          class="bg-orange-100 border border-orange-300 p-4 text-orange-700">
          <div class="text-sm font-medium">Unresolved Image {{ index + 1 }}</div>
          <div class="text-xs mt-1">File ID: {{ fileId }}</div>
          <div class="text-xs mt-1">
            ⚠️ This image needs server-side resolution
          </div>
        </div>
      </template>
    </div>

    <!-- No images message -->
    <div v-else class="bg-red-50 border border-red-200 p-4 text-red-700">
      ⚠️ No images found in gallery block
    </div>

    <!-- Gallery Caption -->
    <figcaption v-if="block?.content?.caption" class="text-center text-sm mt-2"
      :style="{ color: textColor || 'inherit' }" v-html="block.content.caption" />
  </div>
</template>
