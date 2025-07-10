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
  const baseClasses = 'inline-flex items-center justify-center cursor-pointer border font-medium rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants: Record<Button['style'], string> = {
    primary: 'px-6 py-4 text-base font-normal text-white/90 rounded-sm bg-black/95 border-none shadow-none hover:bg-black/70 border-transparent',
    secondary: 'px-6 py-4 text-black/90 bg-black/3 hover:bg-gray-200 focus:ring-gray-500 border-transparent', 
    tertiary: 'relative text-black/90 dark:text-gray-100 border-transparent bg-transparent hover:bg-transparent after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[2px] after:bg-gray-900 dark:after:bg-gray-100 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full',
    quartiary: 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 focus:ring-indigo-500', 
    white: 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 shadow-sm', 
    black: 'text-white bg-black hover:bg-gray-800 focus:ring-gray-500 shadow-sm', 
  }

  return `${baseClasses} ${variants[style] || variants.primary}`
}
</script>

<template>
  <div class="space-y-4">
    <h2 v-if="block.content.title" class="text-2xl font-bold">
      {{ block.content.title }}
    </h2>
    <div class="inline-flex flex-wrap items-center gap-6">
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