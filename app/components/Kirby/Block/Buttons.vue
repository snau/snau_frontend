<script setup lang="ts">
import type { ButtonsBlock, Button } from '~~/shared/types/buttons'

const props = defineProps<{
  block: ButtonsBlock
}>()

type ButtonColor = "primary" | "neutral" | "secondary" | "error" | "success" | "info" | "warning"
type ButtonVariant = "solid" | "outline" | "soft" | "ghost" | "link"

type ButtonStyleProps = {
  color?: ButtonColor
  variant?: ButtonVariant
}

function getButtonProps(style: Button['style']): ButtonStyleProps {
  switch (style) {
    case 'primary':
      return { color: 'primary', variant: 'solid' }
    case 'secondary':
      return { color: 'primary', variant: 'outline' }
    case 'tertiary':
      return { color: 'primary', variant: 'soft' }
    case 'quartiary':
      return { color: 'primary', variant: 'ghost' }
    case 'white':
      return { color: 'neutral', variant: 'outline' }
    case 'black':
      return { color: 'neutral', variant: 'solid' }
    default:
      return { color: 'primary', variant: 'solid' }
  }
}
</script>

<template>
  <div class="space-y-4">
    <h2 v-if="block.content.title" class="text-2xl font-bold">
      {{ block.content.title }}
    </h2>
    <div class="flex flex-wrap gap-4">
      <template v-for="(button, index) in block.content.buttons">
        <NuxtLink
          v-if="button.link"
          :key="`link-${index}`"
          :to="button.link.href"
          :target="button.link.popup ? '_blank' : undefined"
        >
          <UButton :label="button.text" v-bind="getButtonProps(button.style)" />
        </NuxtLink>
        <UButton
          v-else
          :key="`button-${index}`"
          :label="button.text"
          v-bind="getButtonProps(button.style)"
          disabled
        />
      </template>
    </div>
  </div>
</template> 