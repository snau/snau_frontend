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

// Track previous scroll position
let prevScrollY = 0

// Function to handle scroll events - detect scroll direction
const handleScroll = () => {
  const currentScrollY = window.scrollY

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
      class="flex bg-[var(--ui-nav-color-bg)] md:bg-transparent items-center justify-between py-2 mx-4 px-4 border border-[var(--ui-border-nav)] md:border-none sm:max-w-[60vw] sm:mx-auto md:max-w-full transition-opacity duration-300"
      :class="{ 'opacity-0': !isHeaderVisible, 'opacity-100': isHeaderVisible }"
    >
      <!-- Logo stays visible -->
      <Logo />

      <!-- Desktop Navigation - only this fades out -->
      <div
        class="lg:px-8 hidden md:block transition-opacity duration-300"
        :class="{
          'opacity-0': !isHeaderVisible,
          'opacity-100': isHeaderVisible,
        }"
      >
        <UNavigationMenu
          variant="pill"
          orientation="horizontal"
          :items="menuItems"
          :ui="{
            list: 'gap-6',
            linkLabel: 'py-1',
            childLink: 'hover:bg-opacity-20 hover:bg-gray-500',
            link: [
              'text-base transition-colors text-[var(--ui-nav-color-text)] relative px-0 tracking-wider',
              'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[3px] after:bg-[var(--ui-nav-color-text)]',
              'after:transition-all after:duration-300 after:ease-in-out',
              'hover:after:w-full hover:text-[var(--ui-nav-color-text)]',
              'data-[active]:after:w-full data-[active]:text-[var(--ui-nav-color-text)]',
            ].join(' '),
          }"
        />
      </div>

      <!-- Mobile Menu Toggle - also fades out -->
      <UButton
        aria-controls="mobile-nav"
        :aria-expanded="isOpen"
        aria-label="Mobile menu toggle"
        class="scale-110 md:hidden transition-opacity duration-300"
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
      class="mx-4 sm:mx-auto sm:max-w-[60vw] md:max-w-full md:hidden grid transition-opacity duration-300 ease-[var(--ui-easing)]"
      :style="{
        gridTemplateRows: isOpen ? '1fr' : '0fr',
      }"
      :class="{ 'opacity-0': !isHeaderVisible, 'opacity-100': isHeaderVisible }"
    >
      <div class="overflow-hidden min-h-0">
        <UNavigationMenu
          :key="navigationMenuKey"
          variant="pill"
          orientation="vertical"
          :items="menuItems"
          :ui="{
            root: 'bg-[var(--ui-nav-color-bg)]',
            list: 'px-4 gap-4 first:pt-4 last:pb-4',
            linkLabel: 'py-1',
            childLink: 'hover:bg-opacity-20 hover:bg-gray-500',
            childList: 'border-none',
            link: [
              'transition-colors text-base py-2 relative px-0',
              'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[var(--ui-nav-color-text)]',
              'after:transition-all after:duration-300 after:ease-in-out',
              'hover:after:w-full hover:text-[var(--ui-nav-color-text)]',
              'data-[active]:after:w-full data-[active]:text-[var(--ui-nav-color-text)] data-[active]:text-[var(--ui-nav-color-text-active)]',
              'focus-visible:outline',
              'focus-visible:outline-2',
              'focus-visible:outline-rounded',
            ].join(' '),
          }"
        />
      </div>
    </div>
  </header>
</template>
