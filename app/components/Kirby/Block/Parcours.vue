<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import { computed } from 'vue'

const props = defineProps<{
  block: KirbyBlock<
    'parcours',
    {
      title?: string
      description?: string
      city?: string
      pagelink?: string
      speciality?: string
      resolved: {
        coverimage: {
          url: string
          srcset: string
          width?: number
          height?: number
          alt?: string
        }[]
        pagelink?: {
          uri: string
        }[]
      }
    }
  >
}>()

const resolved = computed(() => props.block.content.resolved)
const coverImage = computed(() => resolved.value?.coverimage?.[0] || null)
</script>

<template>
  <div
    class="mx-0 my-8 overflow-hidden border-1 border-[rgb(230,234,234)] rounded bg-[rgb(243,246,246)] shadow-sm transition-shadow ease hover:shadow-lg"
  >
    <NuxtLink :to="block.content.resolved?.pagelink?.[0]?.uri || ''">
      <div class="md:flex">
        <div class="relative md:shrink-0">
          <img
            class="h-48 w-full object-cover transition-none md:w-48 !md:h-full"
            lazyload
            :src="coverImage?.url || ''"
            :srcset="coverImage?.srcset || ''"
            :width="coverImage?.width"
            :height="coverImage?.height"
            sizes="(min-width: 640px) 300px, 100vw"
            :alt="coverImage?.alt || ''"
          />
          <div class="triangle-overlay"></div>
          <div
            class="city absolute bottom-2 right-2 z-10 text-sm tracking-wide text-white"
          >
            {{ block.content?.city }}
          </div>
        </div>
        <div class="p-3 md:p-6">
          <h2
            class="title mt-1 block text-lg font-bold leading-tight text-black hover:underline"
          >
            {{ block.content?.title }}
          </h2>
          {{ block.content?.speciality }}
          <p class="description mt-2 text-sm text-stone-500">
            {{ block.content?.description }}
          </p>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<style scoped>
.triangle-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip-path: polygon(0 88%, 100% 78%, 100% 100%, 0% 100%);
  background-color: #28292b;
}

a {
  @apply no-underline;
}
</style>
