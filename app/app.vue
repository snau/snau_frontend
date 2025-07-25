<script setup lang="ts">
import { computed } from 'vue'
import { usePage } from '~/composables/page'
import { useMobileMenu } from '~/composables/useMobileMenu'
import '~/assets/css/main.css'

const { isOpen } = useMobileMenu()
const { locale: _locale } = useI18n()
const page = usePage()

const gradientDirectionMap = {
  up: 'to top',
  'right-up': 'to top right',
  right: 'to right',
  'right-down': 'to bottom right',
  down: 'to bottom',
  'left-down': 'to bottom left',
  left: 'to left',
  'left-up': 'to top left',
} as const

const bodyStyle = computed(() => {
  const styles: Record<string, string> = {}
  const gradientColors = page.value.gradient

  if (Array.isArray(gradientColors) && gradientColors.length > 0) {
    const alignment =
      (page.value.gradient_alignment as keyof typeof gradientDirectionMap) ||
      'down'
    const direction = gradientDirectionMap[alignment] || 'to bottom'

    const colorStops =
      gradientColors.length === 1
        ? `${gradientColors[0].color}, ${gradientColors[0].color}`
        : gradientColors
          .map((g: { color: string; position?: string }, index: number) => {
            const position =
              g.position || (index / (gradientColors.length - 1)) * 100
            return `${g.color} ${position}%`
          })
          .join(', ')

    // Use background-image for CSS string
    styles['background-image'] = `linear-gradient(${direction}, ${colorStops})`
  }

  // Add general text color if valid (not empty, null, or undefined)
  const generalTextColor = page.value.generaltextcolor
  if (generalTextColor && generalTextColor.trim() !== '') {
    // Filter out suspicious debugging colors that might come from browser extensions
    const suspiciousColors = ['#fc00bd', 'rgb(252, 0, 189)', 'hsl(312, 100%, 49%)']
    if (!suspiciousColors.includes(generalTextColor.trim().toLowerCase())) {
      styles.color = generalTextColor
    } else {
      console.warn('Filtered out suspicious color value in app.vue:', generalTextColor)
    }
  }

  // Convert object to CSS string for the style attribute
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join(';')
})

// Add EB Garamond font from Bunny Fonts and apply dynamic styles to the body
useHead({
  bodyAttrs: {
    style: bodyStyle,
  },
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.bunny.net/css?family=eb-garamond:400,400i,500,500i,600,600i,700,700i',
    },
  ],
})
</script>

<template>
  <UApp>
    <AppHeader />

    <!-- Mobile Overlay -->
    <ClientOnly>
      <Transition enter-active-class="transition-opacity duration-300 ease-out"
        leave-active-class="transition-opacity duration-200 ease-in" enter-from-class="opacity-0"
        leave-to-class="opacity-0">
        <div v-if="isOpen" class="fixed inset-0 z-40 bg-black/50 dark:bg-stone/200 backdrop-blur-sm" role="presentation"
          @click="isOpen = false" />
      </Transition>
    </ClientOnly>

    <!-- Main Content -->
    <main id="main"
      class="main relative z-10 transition-opacity duration-300 ease-out dark:bg-[var(--ui-color-bg)] dark:text-[var(--ui-color-text)]"
      :class="{
        'opacity-75 pointer-events-none': isOpen,
      }">
      <NuxtPage />
    </main>

    <AppFooter />

    <!-- Debug component for development -->
    <!-- Temporarily disabled for Netlify testing -->
    <!-- <DebugViewTransitions /> -->
  </UApp>
</template>
