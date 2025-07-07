<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { marked } from 'marked'
import type { KirbyBlock } from '#nuxt-kql'

const props = defineProps<{
  block: KirbyBlock<'markdown'>
}>()

const html = ref('')
const isLoading = ref(true)

// Estimate height based on newlines to prevent layout jump.
// 24px per line is an approximation of line-height.
const estimatedHeight = computed(() => {
  const lines = props.block.content.text?.split('\n').length || 5
  return `${lines * 24}px`
})

onMounted(async () => {
  if (process.client) {
    try {
      const DOMPurify = (await import('dompurify')).default
      html.value = DOMPurify.sanitize(marked.parse(props.block.content.text || ''))
    }
    finally {
      isLoading.value = false
    }
  }
})
</script>

<template>
  <div
    v-html="html"
    class="transition-opacity duration-300"
    :class="{ 'opacity-0': isLoading }"
    :style="{ minHeight: isLoading ? estimatedHeight : 'auto' }"
  />
</template>
