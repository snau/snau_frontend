<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import { computed } from 'vue'

const props = defineProps<{
  block: KirbyBlock<
    'teaser',
    {
      headline?: string
      description?: string
      pagelink?: string
      linktitle?: string
      resolved: {
        coverimage: {
          url: string
          srcset: string
          width?: number
          height?: number
          alt?: string
        }[]
      }
    }
  >
}>()

const isExternalUrl = (url: string) => /^https?:\/\//.test(url)

const resolved = computed(() => props.block.content.resolved)
const coverImage = computed(() => resolved.value?.coverimage?.[0] || null)
</script>

<template>
  <div class="mx-0 my-8 overflow-hidden">
    <div class="md:flex">
      <div v-if="coverImage" class="relative mb-4 pr-4 md:shrink-0">
        <img
          v-if="coverImage"
          class="h-48 w-full object-cover transition-none md:h-32 md:w-32"
          lazyload
          :src="coverImage.url"
          :srcset="coverImage.srcset"
          :width="coverImage.width"
          :height="coverImage.height"
          sizes="(min-width: 640px) 300px, 100vw"
          :alt="coverImage.alt || ''"
        />
      </div>
      <div v-else class="relative md:shrink-0"></div>
      <div class="">
        <h2
          class="title mt-1 block text-lg font-bold leading-tight text-black hover:underline"
        >
          {{ block.content?.headline }}
        </h2>
        <p class="description mt-2 text-sm text-stone-500">
          {{ block.content?.description }}

          <NuxtLink
            v-if="block.content.pagelink"
            class="text-sm hover:no-underline"
            :to="block.content.pagelink"
            :target="isExternalUrl(block.content.pagelink) ? '_blank' : '_self'"
          >
            ({{ block.content.linktitle || block.content.pagelink }})
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
