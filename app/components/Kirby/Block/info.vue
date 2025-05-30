<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'

defineProps<{
  block: KirbyBlock<'info'>
}>()
</script>

<template>
  <div
    class="info my-4 flex items-center border-l-4 border-stone-800 bg-[#ddf0ec] pl-4 text-lg"
    v-html="block.content.text"
  />
</template>
