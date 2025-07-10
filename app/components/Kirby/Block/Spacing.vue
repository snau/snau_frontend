<script setup lang="ts">
import type { SpacingBlock, SpacingSize } from '~~/shared/types/spacing'
import { computed } from 'vue'

const props = defineProps<{
  block: SpacingBlock
}>()

const spacingClasses = computed(() => {
  const sizeMap: Record<SpacingSize, { desktop: string; mobile: string }> = {
    small: { desktop: 'h-8', mobile: 'h-4' },
    medium: { desktop: 'h-16', mobile: 'h-8' },
    large: { desktop: 'h-24', mobile: 'h-12' },
    xlarge: { desktop: 'h-32', mobile: 'h-16' },
  }

  // Correctly access size and mobile from the nested `content` object
  const { size, mobile } = props.block.content
  const selectedSize = sizeMap[size] || sizeMap.medium

  if (mobile === 'hidden') {
    return `hidden md:block ${selectedSize.desktop}`
  }

  if (mobile === 'smaller') {
    return `${selectedSize.mobile} md:${selectedSize.desktop}`
  }

  // Default is 'same'
  return selectedSize.desktop
})
</script>

<template>
  <div :class="spacingClasses" aria-hidden="true" />
</template>
