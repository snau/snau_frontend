<script setup lang="ts">
import type { ButtonsBlock, Button } from '~~/shared/types/buttons'

const props = defineProps<{
  block: ButtonsBlock
}>()

// Manually define the types for the UButton component props we will be using
type ButtonColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' | 'white' | 'black'
type ButtonVariant = 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type ButtonStyleProps = {
  color: ButtonColor
  variant: ButtonVariant
  size: ButtonSize
}

function getButtonProps(style: Button['style']): ButtonStyleProps {
  switch (style) {
    case 'primary':
      // As you requested: variant='outline', color='neutral', and size='xl'
      return { variant: 'solid', color: 'secondary', size: 'xl' }
    case 'secondary':
      // A sensible default for secondary buttons
      return { variant: 'solid', color: 'primary', size: 'md' }
    case 'tertiary':
      // A sensible default for tertiary buttons
      return { variant: 'ghost', color: 'neutral', size: 'md' }
    case 'quartiary':
      return { variant: 'link', color: 'neutral', size: 'sm' }
    case 'white':
      return { variant: 'solid', color: 'white', size: 'md' }
    case 'black':
      return { variant: 'solid', color: 'black', size: 'md' }
    default:
      // Fallback to a default style
      return { variant: 'solid', color: 'primary', size: 'md' }
  }
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
        >
          <UButton :label="button.text" v-bind="getButtonProps(button.style) as any" />
        </NuxtLink>
        <UButton
          v-else
          :key="`button-${index}`"
          :label="button.text"
          v-bind="getButtonProps(button.style) as any"
          disabled
        />
      </template>
    </div>
  </div>
</template> 