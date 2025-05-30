<script setup lang="ts">
/**
 * InterviewHeader.vue
 *
 * A responsive header component for interview pages that displays:
 * - A background with customizable colors
 * - A cover image with optional focus point
 * - Interview quote, title and date
 *
 * The component adapts between mobile (stacked) and desktop (side-by-side) layouts
 */
import type { KirbyPageData } from '~/queries'
import { computed, onMounted, onUnmounted, ref } from 'vue'

// Get the current page data from the Kirby CMS
const page = usePage<KirbyPageData>()

// Determine if we're in SSR mode to avoid window reference errors
const isSSR = typeof window === 'undefined'

// Compute the background style based on available colors
const backgroundStyle = computed(() => {
  if (!page.value?.backgroundcolor) return 'transparent'

  if (page.value.secondarybackgroundcolor) {
    return `linear-gradient(135deg, ${page.value.backgroundcolor}, ${page.value.secondarybackgroundcolor})`
  }
  return page.value.backgroundcolor
})

// Reactive styles object for the header container
const interviewHeaderStyle = computed(() => ({
  background: backgroundStyle.value,
  color: page.value?.textcolor || 'white',
}))

// Create a date formatter for the interview date - memoized to avoid recreation
const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

// Track if the viewport is mobile size
const isMobile = ref(isSSR ? true : window.innerWidth < 768)

// Debounced resize handler for better performance
let resizeTimeout: ReturnType<typeof setTimeout> | null = null
const handleResize = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    isMobile.value = window.innerWidth < 768 // md breakpoint in Tailwind is 768px
  }, 100) // 100ms debounce
}

// Set up responsive behavior - only in client-side
onMounted(() => {
  if (isSSR) return

  // Initial check
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', handleResize, { passive: true })
})

// Clean up event listener
onUnmounted(() => {
  if (isSSR) return

  window.removeEventListener('resize', handleResize)
  if (resizeTimeout) clearTimeout(resizeTimeout)
})

// Compute text color style that only applies on desktop
const textColorStyle = computed(() => {
  // On mobile, return empty object to use default text-white class
  // On desktop, use the custom text color from page data
  return isMobile.value || !page.value?.textcolor
    ? {}
    : { color: page.value.textcolor }
})

// Determine if we should use the default white text color
const useDefaultTextColor = computed(() => {
  return isMobile.value || !page.value?.textcolor
})

/**
 * Format a date in the short format (DD. Month YYYY)
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
const formatDateShort = (date: Date) => dateFormatter.format(date)

// Compute image attributes with fallbacks for better performance and accessibility
const imageAttrs = computed(() => {
  if (!page.value?.cover) {
    return {
      src: '',
      alt: '',
      style: { objectPosition: 'center' },
    }
  }

  return {
    src: page.value.cover.url || '',
    srcset: page.value.cover.srcset || '',
    width: page.value.cover.width,
    height: page.value.cover.height,
    alt: page.value.cover.alt || '',
    style: { objectPosition: page.value.cover.focus || 'center' },
    fetchpriority: 'high', // Prioritize loading this image
  }
})

// Determine if we have a valid cover image
const hasCoverImage = computed(() => Boolean(page.value?.cover?.url))
</script>

<template>
  <section
    id="interview-header"
    class="block -mt-32 md:grid grid-cols-12 w-screen h-[100vh] md:h-[80vh] md:max-h-[100vh] md:w-full overflow-hidden md:-mt-12"
    :style="interviewHeaderStyle"
    aria-labelledby="interview-title"
    role="banner"
  >
    <!-- Cover image container -->
    <figure
      v-if="hasCoverImage"
      id="interview-header-image"
      class="absolute -mt-32 md:mt-0 top-0 left-0 right-0 bottom-0 md:static column group col-span-12 order-1 md:h-full m-0 overflow-hidden md:col-span-6 md:order-2"
    >
      <!-- Cover image with lazy loading and responsive sizing -->
      <img
        loading="eager"
        decoding="async"
        class="w-full h-full object-cover"
        sizes="(min-width: 768px) 50vw, 100vw"
        v-bind="imageAttrs"
      />

      <!-- Gradient overlay for text on mobile - only visible below md breakpoint -->
      <div
        class="absolute top-0 left-0 right-0 bottom-0 z-[5] md:hidden"
        style="
          background-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 25%,
            rgba(0, 0, 0, 0.7)
          );
          pointer-events: none;
        "
        aria-hidden="true"
      ></div>
    </figure>

    <!-- Interview text content -->
    <div
      id="interview-header-text"
      class="relative column not-prose order-2 grid col-span-12 items-end md:items-center justify-center justify-items-center py-36 md:py-12 text-center md:order-1 md:col-span-6 h-full z-[10]"
    >
      <div class="column px-4" style="--columns: 12">
        <!-- Interview quote -->
        <h1
          class="transition-colors duration-300 px-2 text-lg font-bold font-sans italic md:max-w-[22ch] lg:text-3xl xl:text-4xl"
          :class="[useDefaultTextColor ? 'text-white' : '']"
          :style="textColorStyle"
        >
          <span class="backdrop-opacity-70" aria-hidden="true">»</span>
          <span>{{ page.intro }}</span>
          <span class="opacity-70" aria-hidden="true">«</span>
        </h1>

        <!-- Interview title -->
        <h2
          id="interview-title"
          class="transition-colors duration-300 opacity-85 mt-4 text-base font-bold tracking-wider font-sans"
          :class="[useDefaultTextColor ? 'text-white' : '']"
          :style="textColorStyle"
        >
          {{ page.title }}
        </h2>

        <!-- Interview date (if available) -->
        <time
          v-if="page.date"
          class="transition-colors duration-300 text-base opacity-85 block md:mt-2"
          :class="[useDefaultTextColor ? 'text-white' : '']"
          :style="textColorStyle"
          :datetime="page.date"
        >
          {{ formatDateShort(new Date(page.date)) }}
        </time>
      </div>
    </div>
  </section>
</template>
