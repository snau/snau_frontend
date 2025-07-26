<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import slugify from '@sindresorhus/slugify'

interface HeadingBlockContent {
  text: string
  level: string
  font_size?: string
  serif_sans?: string
}

defineProps<{
  block: KirbyBlock<'heading'> & { content: HeadingBlockContent }
  textColor?: string
}>()
</script>

<template>
  <component :is="block.content.level" :id="slugify(block.content.text)" :style="{ color: textColor || 'inherit' }"
    :class="[
      block.content.font_size || '',
      block.content.serif_sans || 'font-sans',
      { 'custom-text-color': textColor }
    ]">
    <span v-html="block.content.text" />
  </component>
</template>
