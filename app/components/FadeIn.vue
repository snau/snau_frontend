<script setup lang="ts">
import { useFadeIn } from '~/composables/useFadeIn'

const { target, isVisible } = useFadeIn()
defineExpose({ target })
</script>

<template>
  <div
    ref="target"
    class="fade-in-section"
    :class="{ 'is-visible': isVisible }"
  >
    <slot />
  </div>
</template>
