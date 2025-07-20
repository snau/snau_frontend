<script setup lang="ts">
import GalleryBlock from './GalleryBlock.vue'
import HeadingBlock from './HeadingBlock.vue'
import ImageBlock from './ImageBlock.vue'
import IntroBlock from './IntroBlock.vue'
import QuoteBlock from './QuoteBlock.vue'
import TextBlock from './TextBlock.vue'

interface BlockRendererProps {
  block: any
  textColor?: string // Add new prop
}

defineProps<BlockRendererProps>()

const blockComponents = {
  heading: HeadingBlock,
  text: TextBlock,
  intro: IntroBlock,
  image: ImageBlock,
  quote: QuoteBlock,
  gallery: GalleryBlock,
}
</script>

<template>
  <component
    :is="blockComponents[block.type as keyof typeof blockComponents]"
    v-if="blockComponents[block.type as keyof typeof blockComponents]"
    :block="block"
    :text-color="textColor"
  />
  <div v-else class="my-4">Block type: {{ block.type }}</div>
</template>
