<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'

defineProps<{
  block: KirbyBlock<'quote'>
}>()
</script>

<template>
  <blockquote>
    <div class="quote-mark-row">
      <!-- <span class="quote-mark-line" aria-hidden="true"></span> -->
      <span class="quote-mark" aria-hidden="true">»</span>
      <!-- <span class="quote-mark-line" aria-hidden="true"></span> -->
    </div>
    <div v-html="block.content.text" />
    <small v-html="block.content.citation" />
  </blockquote>
</template>
