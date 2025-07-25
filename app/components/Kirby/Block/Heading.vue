<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import slugify from '@sindresorhus/slugify'

defineProps<{
  block: KirbyBlock<'heading'>
  textColor?: string
}>()
</script>

<template>
  <component :is="block.content.level" :id="slugify(block.content.text)" :style="{ color: textColor || 'inherit' }">
    <span v-html="block.content.text" />
  </component>
</template>
