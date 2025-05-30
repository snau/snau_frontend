<script setup lang="ts">
import type { KirbyInterviewsResponse } from '~/queries'
import { interviewsQuery } from '~/queries'

const { data } = await useKql<KirbyInterviewsResponse>(interviewsQuery)

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})
const formatDateShort = (date: Date) => dateFormatter.format(date)

// Computed property to sort items by date
const sortedInterviews = computed(() => {
  if (!data.value?.result) {
    return []
  }

  return data.value.result.slice().sort((a: any, b: any) => {
    // Assuming 'date' is in a format that can be directly used in Date constructor
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})
</script>

<template>
  <div
    v-if="data && data.result && data.result.length > 0 && sortedInterviews[0]"
  >
    <div
      v-for="item in [sortedInterviews[0]]"
      :key="item?.title"
      class="bg-[#fffbf1] flex"
    >
      <figure
        class="w-1/2 column group col-span-12 m-0 max-h-[90vh] overflow-hidden md:col-span-6"
      >
        <NuxtLink v-if="item?.uri" :to="item.uri">
          <NuxtImg
            v-if="item?.cover"
            :key="item.cover.url"
            :src="item.cover.url"
            :alt="item.cover.alt || ''"
            sizes="100vw md:50vw"
            loading="lazy"
            format="webp"
            class="h-full w-full object-cover"
            quality="50"
          />
        </NuxtLink>
      </figure>

      <UContainer class="w-1/2 grid place-items-center text-center">
        <div>
          <h2 class="mb-4 w-[600px] m-auto text-center" v-html="item?.intro" />
          <h3 class="text-xl" v-html="item?.title" />
          <time v-if="item?.date" class="" :datetime="item.date">
            {{ formatDateShort(new Date(item.date)) }}
          </time>
          <div>
            <p v-html="item?.description" />
            <NuxtLink v-if="item?.uri" :to="item.uri"> Weiterlesen </NuxtLink>
          </div>
        </div>
      </UContainer>
    </div>
  </div>
</template>
