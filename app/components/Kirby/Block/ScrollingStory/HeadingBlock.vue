<script setup lang="ts">
interface HeadingBlockProps {
  block: {
    level?: string
    content: string
    font_size?: string
    alignment?: string
    serif_sans?: string
  }
}

defineProps<HeadingBlockProps>()

const getClasses = (block: HeadingBlockProps['block']) => {
  return [
    'my-6',
    block.font_size || '',
    block.alignment ? `text-${block.alignment}` : '',
    block.serif_sans || '',
  ]
    .filter(Boolean)
    .join(' ')
}
</script>

<template>
  <component :is="block.level || 'h2'" :class="getClasses(block)">
    <span v-html="block.content"></span>
  </component>
</template>
