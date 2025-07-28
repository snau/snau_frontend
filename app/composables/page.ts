import type { HookResult } from '@nuxt/schema'
import type { KirbySharedPageData } from '~/queries'
import { kirbyStatic } from '#nuxt-kql'
import { joinURL } from 'ufo'

/**
 * Returns static data prefetched at build time
 */
export function useKirbyStaticData() {
  try {
    return kirbyStatic
  } catch (error) {
    console.warn('KirbyStatic data not available:', error)
    return { languages: [] }
  }
}

/**
 * Returns the currently active page, similar to Kirby's `$page` global variable
 */
export function usePage<T extends Record<string, any> = Record<string, any>>() {
  return useState<T>('app.page', () => ({}) as T)
}

/**
 * Sets the currently active page and updates the document head
 */
export function setPage<T extends KirbySharedPageData & Record<string, any>>(
  page: T,
) {
  try {
    usePage().value = page

    // Build the page meta tags
    const { siteUrl } = useRuntimeConfig().public
    const { $i18n: i18n } = useNuxtApp()
    const { defaultLocale } = i18n
    const site = useSite()
    const title = page.title
      ? `${page.title} – ${site.value.title}`
      : site.value.title
    const description = page.description || site.value.description
    const url = joinURL(siteUrl, useRoute().path)
    const image = page?.cover?.url

    // Build alternate URL with error handling
    const alternateUrls = []
    try {
      if (page.i18nMeta && typeof page.i18nMeta === 'object') {
        Object.entries(page.i18nMeta).forEach(([lang, meta]) => {
          if (meta && typeof meta === 'object' && meta.uri) {
            // Remove homepage slug and add leading language prefix
            const uri = getLocalizedPath(meta.uri.replace(/^home/, '/'), lang)

            alternateUrls.push({
              rel: 'alternate',
              hreflang: lang,
              href: joinURL(siteUrl, uri),
            })
          }
        })
      }
    } catch (error) {
      console.warn('Error building alternate URLs:', error)
    }

    // Add primary locale as `x-default` for SEO
    if (alternateUrls.length > 0) {
      const defaultUrl = alternateUrls.find((i) => i.hreflang === defaultLocale)
      if (defaultUrl) {
        alternateUrls.push({
          ...defaultUrl,
          hreflang: 'x-default',
        })
      }
    }

    useHead({
      bodyAttrs: {
        'data-template': page.intendedTemplate || 'default',
      },
    })

    useServerHead({
      link: [{ rel: 'canonical', href: url }, ...alternateUrls],
    })

    useSeoMeta({
      title,
    })

    useServerSeoMeta({
      description,
      ogTitle: title,
      ogDescription: description,
      ogUrl: url,
      ogType: 'website',
      ...(image && { ogImage: image }),
      twitterTitle: title,
      twitterDescription: description,
      twitterCard: image ? 'summary_large_image' : 'summary',
      ...(image && { twitterImage: image }),
    })

    // Resolve components that depend on the full page data
    const nuxtApp = useNuxtApp()
    nuxtApp._pageDependenciesRendered = true
    return nuxtApp.callHook('page-dependencies:rendered')
  } catch (error) {
    console.error('Error in setPage:', error)
    throw error
  }
}

/**
 * Returns a promise that resolves when the page setup is complete
 */
export async function hasPage() {
  if (import.meta.server) {
    const nuxtApp = useNuxtApp()
    const error = useError()

    // Defer rendering the component until the page component has rendered
    return new Promise<void>((resolve) => {
      const resolver = () => {
        resolve()
      }

      // If Nuxt has an error, immediately render the component
      if (error.value) {
        return resolver()
      }

      if (nuxtApp._pageDependenciesRendered) {
        return resolver()
      }

      // Called manually by using the `setPage` composable
      nuxtApp.hooks.hookOnce('page-dependencies:rendered', resolver)

      // When any error happens, resolve
      nuxtApp.hooks.hookOnce('app:error', resolver)
      nuxtApp.hooks.hookOnce('vue:error', resolver)
    })
  }

  return Promise.resolve()
}

declare module '#app' {
  interface RuntimeNuxtHooks {
    'page-dependencies:rendered': () => HookResult
  }
}
