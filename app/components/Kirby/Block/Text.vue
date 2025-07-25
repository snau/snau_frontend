<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'

defineProps<{
  block: KirbyBlock<'text'>
  textColor?: string
}>()
</script>

<template>
  <div :style="{ color: textColor || 'inherit' }" v-html="block.content.text" />
</template>
