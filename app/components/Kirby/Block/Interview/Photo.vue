<script setup lang="ts">
import { useLocalePath } from '#imports'
import { computed, onMounted, ref } from 'vue'

const props = defineProps<Props>()
const emit = defineEmits(['imageLoaded'])
const localePath = useLocalePath()

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
  formatDate: (date: Date | string) => string
  index?: number // Index for staggered animation
}

const imageEl = ref<HTMLImageElement | null>(null)
const imageLoaded = ref(false)
const isVisible = ref(false)

// Calculate a more irregular animation delay based on index and a random factor
// Using much shorter delays to allow multiple items to fade in simultaneously
const animationDelay = computed(() => {
  if (props.index === undefined) return '0ms'

  // Create a pseudo-random delay based on the index
  // Much shorter base delay to allow overlapping animations
  const baseDelay = props.index * 30 // Shorter base delay (was 80ms)
  const randomFactor = ((props.index * 13) % 7) * 10 // Smaller random factor (was 30ms)
  const delay = Math.min(baseDelay + randomFactor, 300) // Lower maximum delay (was 800ms)

  return `${delay}ms`
})

// Calculate a small random offset for the starting position
const randomOffset = computed(() => {
  if (props.index === undefined) return 0
  // Generate a value between 5 and 15 based on the index
  return 10 + ((props.index * 17) % 11) - 5
})

function handleImageLoad() {
  imageLoaded.value = true
  // Emit event to parent component to track loaded images
  emit('imageLoaded')

  // Trigger the fade-in animation with minimal delay
  // Use a much shorter delay to allow concurrent animations
  setTimeout(
    () => {
      isVisible.value = true
    },
    props.index !== undefined
      ? Math.min(props.index * 30 + ((props.index * 13) % 7) * 10, 300)
      : 0,
  )
}

onMounted(() => {
  // If the image is already cached, the load event might not fire
  // So we check if the image is complete
  if (imageEl.value && imageEl.value.complete) {
    imageLoaded.value = true
    emit('imageLoaded')

    // Trigger the fade-in animation with minimal delay
    setTimeout(
      () => {
        isVisible.value = true
      },
      props.index !== undefined
        ? Math.min(props.index * 30 + ((props.index * 13) % 7) * 10, 300)
        : 0,
    )
  }
})
</script>

<template>
  <NuxtLink :to="localePath(`/${props.interview.uri}`)">
    <div
      class="relative cursor-pointer overflow-hidden group"
      :style="{
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
        'transition-delay': animationDelay,
        opacity: isVisible ? '1' : '0',
        transform: isVisible
          ? 'translateY(0)'
          : `translateY(${randomOffset}px)`,
        'will-change': 'opacity, transform',
      }"
    >
      <!-- Regular photo display -->
      <div class="overflow-hidden">
        <!-- Placeholder while image is loading -->
        <div
          v-if="!imageLoaded"
          class="w-full aspect-[4/3] bg-stone-200 animate-pulse"
        ></div>

        <img
          ref="imageEl"
          :src="props.interview.cover?.url || ''"
          :alt="props.interview.cover?.alt"
          class="w-full h-full object-contain transition-all duration-300 ease-out hover:scale-105"
          :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
          @load="handleImageLoad"
        />
      </div>

      <p
        class="caption mt-4 transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        {{ props.interview.title }}
      </p>
    </div>
  </NuxtLink>
</template>
