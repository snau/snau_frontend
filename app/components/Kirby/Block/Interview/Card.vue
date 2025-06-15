<script setup lang="ts">
import { computed } from 'vue'
import { useLocalePath } from '#imports'

const props = defineProps<Props>()
const localePath = useLocalePath()

// Log the generated path
const fullPath = computed(() => localePath(`/${props.interview.uri}`));
console.log('InterviewCard URI:', props.interview.uri, 'Generated Path:', fullPath.value);

interface Cover {
  url: string
  alt: string
}

interface Interview {
  uri: string
  cover?: Cover
  date: string
  intro: string
  title: string
  categories: string[]
}

interface Props {
  interview: Interview
  formatDate: (date: Date) => string
}

const quotedIntro = computed(() => {
  if (!props.interview.intro) return ''
  return `„${props.interview.intro}"`
})
</script>

<template>
  <NuxtLink :to="fullPath">
    <div
      class="relative cursor-pointer rounded overflow-hidden"
      :style="{
        // 'view-transition-name': `card-interview-uri`,
      }"
    >
      <div class="aspect-[4/6] overflow-hidden">
        <img
          :src="props.interview.cover?.url || ''"
          :alt="props.interview.cover?.alt"
          :style="{
            // 'view-transition-name': `image-interview-uri`,
          }"
          class="w-full h-full object-cover transition-all duration-1000 ease-out hover:scale-102"
        />
      </div>

      <span class="absolute top-2 left-2 text-white text-shadow">
        {{ props.formatDate(new Date(props.interview.date)) }}
      </span>

      <div
        class="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-black to-transparent opacity-80"
      />

      <div class="absolute bottom-0 left-0 right-0 px-4 pb-3">
        <h3
          class="text-white font-serif text-base font-bold italic quote-text"
          :style="{
            // 'view-transition-name': `intro-interview-uri`,
          }"
          v-html="quotedIntro"
        />
        <div
          class="mt-1 text-small text-white opacity-75"
          :style="{
            // 'view-transition-name': `title-interview-uri`,
          }"
        >
          {{ props.interview.title }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.quote-text::first-letter {
  margin-left: -0.4em;
}
</style>
