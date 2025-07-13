<script setup lang="ts">
interface ImageBlockProps {
  block: {
    image: {
      url: string
      srcset?: string
      width?: number
      height?: number
      alt?: string
      caption?: string
      copyright?: string
      focus?: {
        value: string
      }
    }
    ratio?: string
    crop?: boolean
    alt?: string
    caption?: string
    link?: string
  }
}

defineProps<ImageBlockProps>()

const getImageStyle = (block: ImageBlockProps['block']) => {
  const aspectRatio = block.ratio ? `aspect-ratio:${block.ratio};` : ''
  const objectFit = `object-fit:${block.crop === false ? 'contain' : 'cover'};`
  return `${aspectRatio}${objectFit}`
}

const getObjectPosition = (block: ImageBlockProps['block']) => {
  return block.image.focus?.value
    ? `object-position:${block.image.focus.value};`
    : ''
}
</script>

<template>
  <figure class="my-6 pswp-gallery" :style="getImageStyle(block)">
    <a
      v-bind="
        block.link
          ? {
              href: block.link,
              :href="block.image.url",
              :data-pswp-width="block.image.width",
              :data-pswp-height="block.image.height",
              rel: 'noopener noreferrer',
              target: '_blank',
              class: 'block-image-link',
            }
          : {}
      "
    >
      <img
        :src="block.image.url"
        :srcset="block.image.srcset || ''"
        :width="block.image.width || ''"
        :height="block.image.height || ''"
        :alt="block.alt || block.image.alt || ''"
        class="w-full object-cover"
        :class="[block.crop ? 'h-auto' : 'h-full']"
        :style="getObjectPosition(block)"
        loading="lazy"
      />
    </component>

    <figcaption
      v-if="block.image.copyright"
      class="text-sm mt-2 text-gray-600"
      v-html="block.image.copyright"
    />

    <figcaption
      v-if="block.caption || block.image.caption"
      class="text-sm mt-2 text-gray-600"
      v-html="block.caption || block.image.caption"
    />
  </figure>
</template>
