<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { ResolvedKirbyImage } from '#shared/types/kirby'

defineProps<{
  block: KirbyBlock<
    'team-structure',
    {
      // Structure data is resolved server-side in a `blocksResolver` function
      // See: https://kirby.tools/docs/headless/field-methods#custom-resolvers
      team: {
        name: string
        // Contains the resolved image data
        image: ResolvedKirbyImage | null
        // Contains the resolved page URI
        link: string | null
        subtitle?: string
        image_ratio?: string
      }[]
    }
  >
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="item in block.content.team" :key="item.name">
      <NuxtLink
        v-if="item.link"
        :to="item.link"
        class="group block text-center"
      >
        <figure
          v-if="item.image"
          class="overflow-hidden rounded-sm"
          :style="{ aspectRatio: item.image_ratio || '1/1' }"
        >
          <img
            :srcset="item.image.srcset"
            :width="item.image.width"
            :height="item.image.height"
            :alt="item.image.alt || ''"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </figure>
        <p class="mt-4 font-bold">{{ item.name }}</p>
        <p v-if="item.subtitle" class="text-sm text-gray-500">
          {{ item.subtitle }}
        </p>
      </NuxtLink>
      <div v-else class="text-center">
        <figure
          v-if="item.image"
          class="overflow-hidden rounded-sm"
          :style="{ aspectRatio: item.image_ratio || '1/1' }"
        >
          <img
            :srcset="item.image.srcset"
            :width="item.image.width"
            :height="item.image.height"
            :alt="item.image.alt || ''"
            class="w-full h-full object-cover"
          />
        </figure>
        <p class="mt-4 font-bold">{{ item.name }}</p>
        <p v-if="item.subtitle" class="text-sm text-gray-500">
          {{ item.subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>