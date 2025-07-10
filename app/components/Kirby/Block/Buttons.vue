<script setup lang="ts">
import type { ButtonsBlock, Button } from '~~/shared/types/buttons'

const props = defineProps<{
  block: ButtonsBlock
}>()

/**
 * Returns a string of Tailwind CSS classes based on the button style.
 * This acts as a local variant system.
 * @param style The style variant from Kirby (e.g., 'primary', 'secondary').
 */
function getButtonClasses(style: Button['style']): string {
  // Base classes applied to all buttons - REMOVED 'shadow-sm' from here.
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants: Record<Button['style'], string> = {
    primary: 'text-md font-normal text-black/80 bg-white/20 border-none shadow-none hover:bg-blue-700 cursor-pointer inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-none focus:outline-none focus:ring-none focus:ring-offset-none',
    secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-500 shadow-sm', // Added shadow-sm here for example
    tertiary: 'text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-blue-500 shadow-sm', // Added shadow-sm here for example
    quartiary: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:ring-indigo-500', // No shadow
    white: 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 shadow-sm', // Added shadow-sm here for example
    black: 'text-white bg-black hover:bg-gray-800 focus:ring-gray-500 shadow-sm', // Added shadow-sm here for example
  }

  return `${baseClasses} ${variants[style] || variants.primary}`
}
</script>

<template>
  <div class="space-y-4">
    <h2 v-if="block.content.title" class="text-2xl font-bold">
      {{ block.content.title }}
    </h2>
    <div class="flex flex-wrap items-center gap-4">
      <template v-for="(button, index) in block.content.buttons">
        <NuxtLink
          v-if="button.link"
          :key="`link-${index}`"
          :to="button.link.href"
          :target="button.link.popup ? '_blank' : undefined"
          class="no-underline"
        >
          <button :class="getButtonClasses(button.style)">
            {{ button.text }}
          </button>
        </NuxtLink>
        <button
          v-else
          :key="`button-${index}`"
          :class="getButtonClasses(button.style)"
          disabled
        >
          {{ button.text }}
        </button>
      </template>
    </div>
  </div>
</template> 