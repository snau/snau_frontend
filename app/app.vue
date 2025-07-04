<script setup lang="ts">
import { useMobileMenu } from '~/composables/useMobileMenu'
import '~/assets/css/main.css'
const { isOpen } = useMobileMenu()
const { locale: _locale } = useI18n()

// Add EB Garamond font from Bunny Fonts
useHead({
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
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        leave-active-class="transition-opacity duration-200 ease-in"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 z-40 bg-black/50 dark:bg-stone/200 backdrop-blur-sm"
          role="presentation"
          @click="isOpen = false"
        />
      </Transition>
    </ClientOnly>

    <!-- Main Content -->
    <main
      id="main"
      class="main relative z-10 transition-opacity duration-300 ease-out dark:bg-[var(--ui-color-bg)] dark:text-[var(--ui-color-text)]"
      :class="{
        'opacity-75 pointer-events-none': isOpen,
      }"
    >
      <NuxtPage />
    </main>

    <AppFooter />

    <!-- Debug component for development -->
    <!-- Temporarily disabled for Netlify testing -->
    <!-- <DebugViewTransitions /> -->
  </UApp>
</template>
