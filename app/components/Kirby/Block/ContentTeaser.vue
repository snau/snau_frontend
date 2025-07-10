<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { ResolvedKirbyImage } from '#shared/types/kirby'
import { computed } from 'vue'

const props = defineProps<{
  block: KirbyBlock<
    'contentTeaser',
    {
      team: {
        headline?: string | null
        subline?: string | null
        badge?: string | null
        meta?: string | null
        image: ResolvedKirbyImage | null
        link: string | null
        image_ratio?: string | null
      }[]
      text_position?: 'inside' | 'outside' | null
    }
  >
}>()

// Current style selection based on text_position
const isInside = computed(() => props.block.content.text_position !== 'outside')
</script>

<template>
  <div
    class="grid gap-x-6 gap-y-12"
    style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"
  >
    <div v-for="(item, index) in block.content.team" :key="index">
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
          <div class="text-left mt-4">
            <h3 class="content-teaser-heading-outside">
              {{ item.headline }}
            </h3>
            <h4
              v-if="item.subline"
              class="content-teaser-subline-outside block"
            >
              {{ item.subline }}
            </h4>
            <span
              v-if="item.meta"
              class="content-teaser-meta-outside mt-1 block"
              >{{ item.meta }}</span
            >
          </div>
        </template>

        <!-- Layout for Text Inside -->
        <template v-else>
          <figure
            v-if="item.image"
            class="relative overflow-hidden rounded-sm h-full"
            :style="{ aspectRatio: item.image_ratio || '1/1' }"
          >
            <span v-if="item.badge" class="content-teaser-badge">
              {{ item.badge }}
            </span>
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
            <div
              class="absolute bottom-0 left-0 right-0 p-4 text-white text-left"
            >
              <h3 class="content-teaser-heading-inside">
                {{ item.headline }}
              </h3>
              <p class="content-teaser-subline-inside">
                {{ item.subline }}
              </p>
              <span
                v-if="item.meta"
                class="content-teaser-meta-inside mt-1 block"
                >{{ item.meta }}</span
              >
            </div>
          </figure>
          <!-- Fallback for 'inside' text when there is no image -->
          <div v-else class="text-center">
            <h3 class="content-teaser-heading-inside">
              {{ item.headline }}
            </h3>
            <p v-if="item.subline" class="content-teaser-subline-inside">
              {{ item.subline }}
            </p>
            <span
              v-if="item.meta"
              class="content-teaser-meta-inside mt-1 block"
              >{{ item.meta }}</span
            >
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
            <h3 class="content-teaser-heading-outside">
              {{ item.headline }}
            </h3>
            <p v-if="item.subline" class="content-teaser-subline-outside">
              {{ item.subline }}
            </p>
            <span
              v-if="item.meta"
              class="content-teaser-meta-outside mt-1 block"
              >{{ item.meta }}</span
            >
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
            <div
              class="absolute bottom-0 left-0 right-0 p-4 text-white text-left"
            >
              <h3 class="content-teaser-heading-inside">
                {{ item.headline }}
              </h3>
              <p v-if="item.subline" class="content-teaser-subline-inside">
                {{ item.subline }}
              </p>
              <span
                v-if="item.meta"
                class="content-teaser-meta-inside mt-1 block"
                >{{ item.meta }}</span
              >
            </div>
          </figure>
          <!-- Fallback for 'inside' text when there is no image -->
          <div v-else class="text-center">
            <h3 class="content-teaser-heading-inside">
              {{ item.headline }}
            </h3>
            <p v-if="item.subline" class="content-teaser-subline-inside">
              {{ item.subline }}
            </p>
            <span
              v-if="item.meta"
              class="content-teaser-meta-inside mt-1 block"
              >{{ item.meta }}</span
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
