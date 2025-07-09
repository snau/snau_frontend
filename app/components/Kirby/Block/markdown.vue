<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'

const props = defineProps<{
  block: KirbyBlock<'markdown'>
}>()
</script>

<template>
  <MDC :value="block.content.text || ''" />
</template>
