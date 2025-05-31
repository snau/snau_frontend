<script setup lang="ts">
interface GalleryBlockProps {
  block: {
    images: Array<{
      url: string
      srcset?: string
      width?: number
      height?: number
      alt?: string
      copyright?: string
    }>
    ratio?: string
    crop?: boolean
    caption?: string
  }
}

defineProps<GalleryBlockProps>()

const getImageStyle = (block: GalleryBlockProps['block']) => {
  const aspectRatio = block.ratio ? `aspect-ratio:${block.ratio};` : ''
  const objectFit = `object-fit:${block.crop === false ? 'contain' : 'cover'};`
  return `${aspectRatio}${objectFit}`
}
</script>

<template>
  <div class="my-6">
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <figure
        v-for="(img, index) in block.images"
        :key="index"
        :style="getImageStyle(block)"
      >
        <img
          :src="img.url"
          :srcset="img.srcset || ''"
          :width="img.width || ''"
          :height="img.height || ''"
          :alt="img.alt || ''"
          class="w-full object-cover"
          :class="[block.crop ? 'h-auto' : 'h-full']"
          loading="lazy"
        />
        <figcaption
          v-if="img.copyright"
          class="text-sm mt-2 text-gray-600"
          v-html="img.copyright"
        />
      </figure>
    </div>
    <figcaption
      v-if="block.caption"
      class="text-center text-sm mt-2 text-gray-600"
      v-html="block.caption"
    />
  </div>
</template>
