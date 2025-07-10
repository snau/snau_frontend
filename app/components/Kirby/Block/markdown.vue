<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'

defineProps<{
  block: KirbyBlock<'markdown'>
}>()
</script>

<template>
  <MDC :value="block.content.text || ''" />
</template>
