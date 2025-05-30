<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'

import type { KirbyPageData } from '~/queries'

defineProps<{
  block: KirbyBlock<
    'interview-footer',
    {
      biolinks: {
        url: string
        title: string[]
      }[]
    }
  >
}>()
const page = usePage<KirbyPageData>()
</script>

<template>
  <div
    class="interview_header grid-cols-12 w-full gap-8 bg-stone-100 p-4 text-sm sm:grid"
  >
    <div class="column col-span-6" style="--columns: 6">
      <h4 class="block border-stone-800 pt-8 sm:border-b-1.5 sm:pb-1 sm:pt-0">
        Info
      </h4>
      {{ page.biography }}
    </div>

    <div class="column col-span-3" style="--columns: 3">
      <h4 class="block border-stone-800 pt-8 sm:border-b-1.5 sm:pb-1 sm:pt-0">
        Links
      </h4>
      <div v-for="(item, index) in block.content.biolinks" :key="index">
        <a :href="item.url">{{ item.title ? item.title : item.url }}</a>
      </div>
    </div>

    <div class="column col-span-3" style="--columns: 3">
      <h4 class="block border-stone-800 pt-8 sm:border-b-1.5 sm:pb-1 sm:pt-0">
        Credits
      </h4>
      <ul class="list-none p-0 leading-5">
        <li>
          Das Interview führte
          <a target="_blank" rel="noopener" href="petramattheis.de"
            >Petra Mattheis</a
          >
        </li>
        <li>
          Fotos von
          <a target="_blank" rel="noopener" href="https://regentaucher.com"
            >Regentaucher</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>
