<script setup lang="ts">
import type { KirbyPageData } from '~/queries'
import { NuxtLink } from '#components'
import Logo from './Logo.vue'

// Wait for the page to be loaded before rendering this component,
// otherwise `usePage()` would return `undefined`
await hasPage()

const { locale, locales, t } = useI18n()
const site = useSite()
const page = usePage<KirbyPageData>()
const { navigationLinks } = useHeader(site)
const localePath = useLocalePath()

const localeCodes = computed(() =>
  locales.value.map((i) => (typeof i === 'string' ? i : i.code)),
)

const translatedUris = computed(() =>
  Object.fromEntries(
    Object.entries(page.value.i18nMeta).map(([code, { uri }]) => [code, uri]),
  ),
)

// Compute the home page and its listed status
const homePage = computed(
  () => site.value.children?.find((page) => page.uri === '') || null,
)
const isHomeListed = computed(() => homePage.value?.isListed ?? false)

// Update menuItems to exclude unlisted home page and include children
const menuItems = computed(() => {
  return navigationLinks.value
    .filter((link) => link.to !== '' && (link.to !== '/' || isHomeListed.value))
    .map((link) => ({
      label: link.label,
      to: localePath(link.to),
      children:
        link.children
          ?.filter((child: any) => child.isListed)
          .map((child: any) => ({
            label: child.title,
            to: localePath(`/${child.uri}`),
          })) || [],
    }))
})

// Legal links (you can customize these or make them dynamic from CMS)
const legalLinks = computed(() => [
  {
    label: t('footer.legal.imprint'),
    to: localePath('/impressum'),
  },
  {
    label: t('footer.legal.privacy'),
    to: localePath('/datenschutz'),
  },
])

// Organize navigation into individual sections
const magazinSection = computed(() => 
  menuItems.value.find(item => item.label === 'Magazin') || null
)

const portfolioSection = computed(() => 
  menuItems.value.find(item => item.label === 'Portfolio') || null
)

const uberUnsSection = computed(() => 
  menuItems.value.find(item => item.label === 'Über Uns') || null
)

const kontaktSection = computed(() => 
  menuItems.value.find(item => item.label === 'Kontakt') || null
)

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer
    class="relative bg-white/50 dark:bg-black/50 backdrop-blur-md border-t border-gray-200/20 dark:border-gray-800/30 mt-24"
  >
    <!-- Gradient overlay for visual depth -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-gray-50/30 to-transparent dark:from-gray-900/30 pointer-events-none"
    ></div>

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Main footer content -->
      <div class="py-16">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8"
        >
          <!-- Logo and brand section -->
          <div class="lg:col-span-1">
            <div class="mb-6">
              <Logo />
            </div>
          </div>

          <!-- Magazin Section -->
          <div class="lg:col-span-1" v-if="magazinSection">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-6">
              <NuxtLink 
                :to="magazinSection.to"
                class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 hover:underline decoration-1 underline-offset-4"
              >
                {{ magazinSection.label }}
              </NuxtLink>
            </h3>
            <ul class="space-y-4">
              <li v-for="child in magazinSection.children" :key="child.to">
                <NuxtLink 
                  :to="child.to"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 hover:underline decoration-1 underline-offset-4"
                >
                  {{ child.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Portfolio Section -->
          <div class="lg:col-span-1" v-if="portfolioSection">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-6">
              <NuxtLink 
                :to="portfolioSection.to"
                class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 hover:underline decoration-1 underline-offset-4"
              >
                {{ portfolioSection.label }}
              </NuxtLink>
            </h3>
            <ul class="space-y-4">
              <li v-for="child in portfolioSection.children" :key="child.to">
                <NuxtLink 
                  :to="child.to"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 hover:underline decoration-1 underline-offset-4"
                >
                  {{ child.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Über Uns Section -->
          <div class="lg:col-span-1" v-if="uberUnsSection">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-6">
              <NuxtLink 
                :to="uberUnsSection.to"
                class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 hover:underline decoration-1 underline-offset-4"
              >
                {{ uberUnsSection.label }}
              </NuxtLink>
            </h3>
            <ul class="space-y-4">
              <li v-for="child in uberUnsSection.children" :key="child.to">
                <NuxtLink 
                  :to="child.to"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 hover:underline decoration-1 underline-offset-4"
                >
                  {{ child.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Kontakt Section -->
          <div class="lg:col-span-1" v-if="kontaktSection">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-6">
              <NuxtLink 
                :to="kontaktSection.to"
                class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 hover:underline decoration-1 underline-offset-4"
              >
                {{ kontaktSection.label }}
              </NuxtLink>
            </h3>
            <ul class="space-y-4">
              <li v-for="child in kontaktSection.children" :key="child.to">
                <NuxtLink 
                  :to="child.to"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 hover:underline decoration-1 underline-offset-4"
                >
                  {{ child.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom section with copyright and legal links -->
      <div class="border-t border-gray-200/30 dark:border-gray-800/30 py-8">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <!-- Copyright -->
          <span class="text-sm text-gray-500 dark:text-gray-500">
            &copy; {{ currentYear }} {{ site.title }}.
            {{ t('footer.copyright') }}
          </span>

          <!-- Legal links -->
          <div class="flex flex-wrap items-center gap-6">
            <NuxtLink
              v-for="link in legalLinks"
              :key="link.to"
              :to="link.to"
              class="text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 hover:underline decoration-1 underline-offset-4"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
