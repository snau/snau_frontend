<script setup lang="ts">
interface QuoteBlockProps {
  block: {
    text: string
    author?: string
    alignment?: string
    font_size?: string
    serif_sans?: string
  }
}

defineProps<QuoteBlockProps>()

const getAlignment = (block: QuoteBlockProps['block']) => {
  return block.alignment ? `text-${block.alignment}` : 'text-left'
}

const getFontSize = (block: QuoteBlockProps['block']) => {
  return block.font_size || 'text-xl'
}

const getFontFamily = (block: QuoteBlockProps['block']) => {
  return block.serif_sans || 'font-sans'
}
</script>

<template>
  <blockquote class="text-sm mx-12 lg:my-24" :class="getAlignment(block)">
    <span
      :class="[getFontSize(block), getFontFamily(block)]"
      v-html="block.text"
    />
    <footer
      v-if="block.author"
      class="text-sm mt-2"
      v-html="`— ${block.author}`"
    />
  </blockquote>
</template>
