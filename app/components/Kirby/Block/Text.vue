<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'

interface TextBlockContent {
  text: string
  font_size?: string
  serif_sans?: string
}

defineProps<{
  block: KirbyBlock<'text'> & { content: TextBlockContent }
  textColor?: string
}>()
</script>

<template>
  <div :style="{ color: textColor || 'inherit' }" class="kirby-text-block" :class="[
    block.content.font_size || 'text-base',
    block.content.serif_sans || 'font-sans',
    { 'custom-text-color': textColor }
  ]" v-html="block.content.text" />
</template>
