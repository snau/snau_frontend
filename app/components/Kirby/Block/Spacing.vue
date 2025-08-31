<script setup lang="ts">
import type { SpacingBlock, SpacingSize } from '~/shared/types/spacing'
import { computed } from 'vue'

const props = defineProps<{
  block: SpacingBlock
}>()

// Map for spacing classes (used for both mobile and desktop)
const sizeClasses: Record<Exclude<SpacingSize, 'hidden'>, string> = {
  small: 'h-6',
  medium: 'h-16',
  large: 'h-24',
  xlarge: 'h-32',
}

const spacingClasses = computed(() => {
  const desktopValue = props.block.content.desktop
  const mobileValue = props.block.content.mobile

  const classes: string[] = []

  // Base (mobile) styles
  if (mobileValue === 'hidden') {
    classes.push('hidden')
  } else {
    classes.push(sizeClasses[mobileValue] || sizeClasses.medium)
  }

  // Desktop overrides at md and up
  if (desktopValue === 'hidden') {
    classes.push('md:hidden')
  } else {
    classes.push(`md:${sizeClasses[desktopValue] || sizeClasses.medium}`)
    // If mobile is hidden, ensure it becomes visible on desktop
    if (mobileValue === 'hidden') {
      classes.push('md:block')
    }
  }

  return classes.join(' ')
})
</script>

<template>
  <div :class="spacingClasses" aria-hidden="true" />
</template>
