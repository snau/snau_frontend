<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'

defineProps<{
  block: KirbyBlock<'video'>
}>()
</script>

<template>
  <div v-html="block.content.url" />
</template>
