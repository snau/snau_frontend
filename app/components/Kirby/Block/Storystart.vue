<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'

const props = defineProps<{
  block: KirbyBlock<
    'storystart',
    {
      text: string
    }
  >
}>()
</script>

<template>
  <h2>
    {{ props.block.content.text }}
  </h2>
  <hr />
</template>
