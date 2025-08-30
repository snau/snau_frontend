<script setup lang="ts">
import { watch } from 'vue'
import { useMobileMenu } from '~/composables/useMobileMenu'
import Logo from './Logo.vue'

const { locale: _locale, t: _t } = useI18n()
const route = useRoute()
const site = useSite()
const _page = usePage()
const { navigationLinks } = useHeader(site)
const { isOpen, toggle } = useMobileMenu()
const navigationMenuKey = ref(0)
const localePath = useLocalePath()

// Initialize invert functionality
useInvert()

// Add state for header visibility
const isHeaderVisible = ref(true)
// Add state for enhanced background when scrolled
const hasScrolledBackground = ref(false)

// Track previous scroll position
let prevScrollY = 0

// Function to handle scroll events - detect scroll direction
const handleScroll = () => {
  const currentScrollY = window.scrollY

  // Show enhanced background after scrolling past 50px
  hasScrolledBackground.value = currentScrollY > 50

  // Always show header when at the top of the page
  if (currentScrollY <= 0) {
    isHeaderVisible.value = true
    prevScrollY = currentScrollY
    return
  }

  if (currentScrollY > prevScrollY) {
    // Scrolling down: hide navigation
    isHeaderVisible.value = false
  } else if (currentScrollY < prevScrollY) {
    // Scrolling up: show navigation
    isHeaderVisible.value = true
  }
  // Update prevScrollY for the next comparison
  prevScrollY = currentScrollY
}

// Track scroll handler for cleanup
let scrollHandler: (() => void) | null = null

// Add and remove scroll event listener with immediate execution
onMounted(() => {
  let ticking = false

  // Immediate execution for initial state
  handleScroll()

  scrollHandler = () => {
    if (!ticking) {
      // Execute immediately without waiting for rAF for better responsiveness
      handleScroll()
      window.requestAnimationFrame(() => {
        ticking = false
      })
      ticking = true
    }
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })

  // Initialize prevScrollY with the current scroll position
  prevScrollY = window.scrollY
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
})

watch(
  () => route.fullPath,
  () => {
    if (isOpen.value) {
      isOpen.value = false
    }
  },
)

// Compute the home page and its listed status
const homePage = computed(
  () => site.value.children?.find((page) => page.uri === 'home') || null,
)
const isHomeListed = computed(() => homePage.value?.isListed ?? false)

// Update menuItems to exclude unlisted home page
const menuItems = computed(() => {
  return navigationLinks.value
    .filter((link) => link.to !== '' && (link.to !== '/' || isHomeListed.value))
    .map((link) => ({
      label: link.label,
      to: localePath(link.to),
    }))
})
</script>

<template>
  <header class="fixed top-8 left-0 right-0 z-50 w-full mx-auto">
    <nav
      class="flex bg-[var(--ui-nav-color-bg)] md:bg-transparent items-center justify-center py-2 mx-4 px-4 border border-[var(--ui-border-nav)] md:border-none sm:max-w-[60vw] sm:mx-auto md:max-w-full transition-opacity duration-300"
      :class="{ 'opacity-0': !isHeaderVisible, 'opacity-100': isHeaderVisible }"
    >
      <!-- Centered Logo and Navigation Group with Frosted Glass -->
      <div class="flex items-center gap-6 relative">
        <!-- Default Frosted Glass Background -->
        <div class="absolute inset-0 -mx-4 -my-2 transform-gpu">
          <div
            class="absolute inset-0 bg-white/60 dark:bg-black/25 backdrop-blur-md backdrop-saturate-150 border border-white/25 dark:border-white/15 rounded-2xl transition-[background-color,border-color,box-shadow,backdrop-filter] duration-150 ease-out will-change-[background,border,box-shadow,backdrop-filter] transform-gpu"
            style="contain: layout style paint"
            :class="{
              'bg-white/30 dark:bg-black/10 !backdrop-blur-sm !backdrop-saturate-125 border-white/10 dark:border-white/5 shadow-md':
                hasScrolledBackground,
            }"
          ></div>
        </div>

        <!-- Logo and Navigation Content -->
        <div
          class="relative z-10 flex items-center gap-6 transform-gpu will-change-transform"
        >
          <!-- Logo -->
          <Logo />

          <!-- Desktop Navigation -->
          <div
            class="hidden md:block transition-opacity duration-300"
            :class="{
              'opacity-0': !isHeaderVisible,
              'opacity-100': isHeaderVisible,
            }"
          >
            <div class="px-3">
              <UNavigationMenu
                variant="pill"
                orientation="horizontal"
                :items="menuItems"
                :ui="{
                  list: 'gap-6',
                  linkLabel: 'py-0',
                  childLink: 'hover:bg-opacity-20 hover:bg-gray-500',
                  link: [
                    'text-sm font-medium transition-colors text-gray-900 dark:text-gray-100 relative px-0 tracking-wider antialiased',
                    'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-gray-900 dark:after:bg-gray-100',
                    'after:transition-all after:duration-300 after:ease-in-out',
                    'before:inset-y-0 hover:before:bg-elevated/0',
                    'hover:after:w-full hover:text-gray-900 dark:hover:text-gray-100',
                    'data-[active]:after:w-full data-[active]:text-gray-900 dark:data-[active]:text-gray-100 data-[active]:bg-transparent data-[active]:before:bg-transparent',
                    'transform-gpu will-change-transform',
                  ].join(' '),
                }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Toggle - positioned absolutely -->
      <UButton
        aria-controls="mobile-nav"
        :aria-expanded="isOpen"
        aria-label="Mobile menu toggle"
        class="absolute right-4 scale-110 md:hidden transition-opacity duration-300"
        :class="{
          'opacity-0': !isHeaderVisible,
          'opacity-100': isHeaderVisible,
        }"
        :icon="isOpen ? 'i-tabler-x' : 'i-tabler-menu-2'"
        size="xl"
        color="neutral"
        variant="ghost"
        @click="toggle"
      />
    </nav>

    <!-- Mobile Navigation -->
    <div
      id="mobile-nav"
      class="relative mx-4 sm:mx-auto sm:max-w-[60vw] md:max-w-full md:hidden grid transition-opacity duration-300 ease-[var(--ui-easing)]"
      :style="{
        gridTemplateRows: isOpen ? '1fr' : '0fr',
      }"
      :class="{ 'opacity-0': !isHeaderVisible, 'opacity-100': isHeaderVisible }"
    >
      <!-- Mobile Frosted Glass Background -->
      <div
        v-if="isOpen"
        class="absolute inset-0 mt-2 rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-xl backdrop-saturate-150 bg-gradient-to-b from-white/60 to-white/30 dark:from-black/30 dark:to-black/10"
      ></div>

      <div
        class="overflow-hidden min-h-0 relative z-10 transition-all duration-300 ease-[var(--ui-easing)]"
        :class="isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'"
      >
        <UNavigationMenu
          :key="navigationMenuKey"
          variant="pill"
          orientation="vertical"
          :items="menuItems"
          :ui="{
            root: 'bg-transparent',
            list: 'px-3 py-2 gap-1 first:pt-2 last:pb-2',
            linkLabel: 'py-1',
            childLink: 'hover:bg-opacity-20 hover:bg-gray-500',
            childList: 'border-none',
            link: [
              'text-sm font-medium relative antialiased text-gray-900 dark:text-gray-100',
              'transition-all duration-200 ease-[var(--ui-easing)]',
              'py-2 px-3 -mx-2 rounded-lg',
              'hover:bg-white/50 dark:hover:bg-white/5 hover:backdrop-blur-sm',
              'data-[active]:bg-white/60 dark:data-[active]:bg-white/10',
              'data-[active]:text-gray-900 dark:data-[active]:text-gray-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 dark:focus-visible:ring-white/20',
              'transform-gpu will-change-transform',
            ].join(' '),
          }"
        />
      </div>
    </div>
  </header>
</template>
