<script setup lang="ts">
interface TextBlockProps {
  block: {
    content: string
    font_size?: string
    serif_sans?: string
  }
}

defineProps<TextBlockProps>()

const getClasses = (block: TextBlockProps['block']) => {
  return [
    'my-4',
    block.font_size || 'text-base',
    block.serif_sans || 'font-sans',
  ]
    .filter(Boolean)
    .join(' ')
}
</script>

<template>
  <div :class="getClasses(block)" v-html="block.content" />
</template>
