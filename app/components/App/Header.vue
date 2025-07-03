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

// Add and remove scroll event listener
onMounted(() => {
  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll()
        ticking = false
      })
      ticking = true
    }
  })
  // Initialize prevScrollY with the current scroll position
  prevScrollY = window.scrollY
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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
  () => site.value.children?.find((page) => page.uri === '') || null,
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
            class="absolute inset-0 bg-white/60 dark:bg-black/25 backdrop-blur-md backdrop-saturate-150 border border-white/25 dark:border-white/15 rounded-2xl transition-all duration-300 ease-out"
            :class="{
              'bg-white/30 dark:bg-black/10 backdrop-blur-sm backdrop-saturate-125 border-white/10 dark:border-white/5 shadow-md': hasScrolledBackground,
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
        class="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-xl backdrop-saturate-150 border border-white/20 dark:border-white/10 rounded-xl shadow-lg mt-2"
      ></div>

      <div class="overflow-hidden min-h-0 relative z-10">
        <UNavigationMenu
          :key="navigationMenuKey"
          variant="pill"
          orientation="vertical"
          :items="menuItems"
          :ui="{
            root: 'bg-transparent',
            list: 'px-4 gap-4 first:pt-4 last:pb-4',
            linkLabel: 'py-1',
            childLink: 'hover:bg-opacity-20 hover:bg-gray-500',
            childList: 'border-none',
            link: [
              'transition-colors text-sm font-medium py-2 relative px-0 antialiased text-gray-900 dark:text-gray-100',
              'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gray-900 dark:after:bg-gray-100',
              'after:transition-all after:duration-300 after:ease-in-out',
              'hover:after:w-full hover:text-gray-900 dark:hover:text-gray-100',
              'data-[active]:after:w-full data-[active]:text-gray-900 dark:data-[active]:text-gray-100 data-[active]:bg-transparent data-[active]:before:bg-transparent',
              'focus-visible:outline',
              'focus-visible:outline-2',
              'focus-visible:outline-rounded',
              'transform-gpu will-change-transform',
            ].join(' '),
          }"
        />
      </div>
    </div>
  </header>
</template>
