<script setup lang="ts">
interface IntroBlockProps {
  block: {
    content: {
      text: string
      font_size?: string
      serif_sans?: string
    }
  }
}

defineProps<IntroBlockProps>()

const getClasses = (content: IntroBlockProps['block']['content']) => {
  return ['text-center', content.font_size || '', content.serif_sans || '']
    .filter(Boolean)
    .join(' ')
}
</script>

<template>
  <div class="grid place-items-center w-full h-screen">
    <h1 :class="getClasses(block.content)" v-html="block.content.text" />
  </div>
</template>
