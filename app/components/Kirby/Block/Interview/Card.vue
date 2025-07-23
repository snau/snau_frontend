<script setup lang="ts">
import { useLocalePath } from '#imports'
import { computed } from 'vue'

const props = defineProps<Props>()
const localePath = useLocalePath()

// Generate the full path for the interview
const fullPath = computed(() => localePath(`/${props.interview.uri}`))

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
    <div class="relative cursor-pointer rounded overflow-hidden" :style="{
      // 'view-transition-name': `card-interview-uri`,
    }">
      <div class="aspect-[4/6] overflow-hidden">
        <img :src="props.interview.cover?.url || ''" :alt="props.interview.cover?.alt" :style="{
          // 'view-transition-name': `image-interview-uri`,
        }" class="w-full h-full object-cover transition-all duration-1000 ease-out hover:scale-102" />
        <!-- Gradient overlay: top right to bottom left, 25% opacity, covers about 1/4 of the card -->
        <div class="pointer-events-none absolute top-0 right-0 w-1/2 h-1/2 z-10 gradient-topright-bl" />
      </div>

      <span class="absolute top-4 right-4 text-white text-shadow text-xs z-20">
        {{ props.formatDate(new Date(props.interview.date)) }}
      </span>

      <div class="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-black to-transparent opacity-80" />

      <div class="absolute bottom-0 left-0 right-0 px-4 pb-3">
        <h3 class="text-white font-serif text-base font-bold italic quote-text -mb-2" :style="{
          // 'view-transition-name': `intro-interview-uri`,
        }" v-html="quotedIntro" />
        <div class="text-small text-white opacity-75" :style="{
          // 'view-transition-name': `title-interview-uri`,
        }">
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

.gradient-topright-bl {
  background: linear-gradient(225deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 50%);
}
</style>
