<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'

const { block } = defineProps<{
  block: KirbyBlock<'accordion'>
}>()
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <UAccordion
      multiple
      :ui="{
        item: '-mx-2 my-1 border-none text-left text-[var(--ui-accordion-color-text)] bg-[var(--ui-accordion-color-closed)] hover:bg-[var(--ui-accordion-color-hover)] data-[state=open]:bg-[var(--ui-accordion-color-open)]',
        body: 'text-base',
        trigger: 'text-base p-6 cursor-pointer',
        content: 'px-6 ',
      }"
      :items="
        (
          (block.content.accordion || []) as Array<{
            label: string
            icon?: string
            content: string
            disabled?: boolean
          }>
        ).map((item) => ({
          label: item.label,
          icon: item.icon,
          content: item.content,
          disabled: item.disabled || false,
        }))
      "
    />
  </div>
</template>
