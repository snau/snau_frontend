<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { ResolvedKirbyImage } from '#shared/types/kirby'

defineProps<{
  block: KirbyBlock<
    'team-structure',
    {
      team: {
        name: string
        image: ResolvedKirbyImage | null
        link: string | null
        subtitle?: string
        image_ratio?: string | null
      }[]
      text_position?: 'inside' | 'outside' | null
    }
  >
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="item in block.content.team" :key="item.name">
      <!-- Case 1: Has a link -->
      <NuxtLink v-if="item.link" :to="item.link" class="group block h-full">
        <!-- Layout for Text Outside -->
        <template v-if="block.content.text_position === 'outside'">
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
          <div class="text-center mt-4">
            <p class="font-bold">{{ item.name }}</p>
            <p v-if="item.subtitle" class="text-sm text-gray-500">
              {{ item.subtitle }}
            </p>
          </div>
        </template>

        <!-- Layout for Text Inside -->
        <template v-else>
          <figure
            v-if="item.image"
            class="relative overflow-hidden rounded-sm h-full"
            :style="{ aspectRatio: item.image_ratio || '1/1' }"
          >
            <img
              :srcset="item.image.srcset"
              :width="item.image.width"
              :height="item.image.height"
              :alt="item.image.alt || ''"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
            />
            <div class="absolute bottom-0 left-0 right-0 p-4 text-white text-left">
              <p class="font-bold">{{ item.name }}</p>
              <p v-if="item.subtitle" class="text-sm opacity-80">
                {{ item.subtitle }}
              </p>
            </div>
          </figure>
          <!-- Fallback for 'inside' text when there is no image -->
          <div v-else class="text-center">
            <p class="font-bold">{{ item.name }}</p>
            <p v-if="item.subtitle" class="text-sm text-gray-500">
              {{ item.subtitle }}
            </p>
          </div>
        </template>
      </NuxtLink>

      <!-- Case 2: No link -->
      <div v-else class="block h-full">
        <!-- Layout for Text Outside -->
        <template v-if="block.content.text_position === 'outside'">
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
          <div class="text-center mt-4">
            <p class="font-bold">{{ item.name }}</p>
            <p v-if="item.subtitle" class="text-sm text-gray-500">
              {{ item.subtitle }}
            </p>
          </div>
        </template>

        <!-- Layout for Text Inside -->
        <template v-else>
          <figure
            v-if="item.image"
            class="relative overflow-hidden rounded-sm h-full"
            :style="{ aspectRatio: item.image_ratio || '1/1' }"
          >
            <img
              :srcset="item.image.srcset"
              :width="item.image.width"
              :height="item.image.height"
              :alt="item.image.alt || ''"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
            />
            <div class="absolute bottom-0 left-0 right-0 p-4 text-white text-left">
              <p class="font-bold">{{ item.name }}</p>
              <p v-if="item.subtitle" class="text-sm opacity-80">
                {{ item.subtitle }}
              </p>
            </div>
          </figure>
          <!-- Fallback for 'inside' text when there is no image -->
          <div v-else class="text-center">
            <p class="font-bold">{{ item.name }}</p>
            <p v-if="item.subtitle" class="text-sm text-gray-500">
              {{ item.subtitle }}
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>