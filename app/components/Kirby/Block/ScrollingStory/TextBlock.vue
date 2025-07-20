<script setup lang="ts">
interface TextBlockProps {
  block: {
    content: string
    font_size?: string
    serif_sans?: string
  }
  textColor?: string // Add new prop
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
  <div :class="getClasses(block)" :style="{ color: textColor || 'inherit' }" v-html="block.content" />
</template>
