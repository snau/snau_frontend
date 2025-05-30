<script setup lang="ts">
import { useRouter } from '#imports'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { computed, ref } from 'vue'

const props = defineProps<Props>()

gsap.registerPlugin(Flip)

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

const imageEl = ref<HTMLImageElement | null>(null)
const router = useRouter()

const quotedIntro = computed(() => {
  if (!props.interview.intro) return ''
  return `„${props.interview.intro}"`
})

function handleCardClick(): void {
  if (!imageEl.value) return

  const state = Flip.getState(imageEl.value)
  imageEl.value.classList.add(
    'fixed',
    'inset-0',
    'w-screen',
    'h-screen',
    'm-0',
    'object-cover',
    'z-[9999]',
  )

  Flip.from(state, {
    duration: 0.8,
    ease: 'power4.inOut',
    absolute: true,
    onComplete: () => {
      // Remove the image element before navigation
      imageEl.value?.remove()
      router.push(`/${props.interview.uri}`)
    },
  })
}
</script>

<template>
  <div
    class="relative cursor-pointer rounded overflow-hidden"
    @click="handleCardClick"
  >
    <div class="aspect-[4/6] overflow-hidden">
      <img
        ref="imageEl"
        :src="props.interview.cover?.url || ''"
        :alt="props.interview.cover?.alt"
        class="w-full h-full object-cover transition-all duration-1000 ease-out hover:scale-102"
        @load="imageEl?.style.removeProperty('visibility')"
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
        v-html="quotedIntro"
      />
      <div class="mt-1 text-small text-white opacity-75">
        {{ props.interview.title }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.quote-text::first-letter {
  margin-left: -0.4em;
}
</style>
