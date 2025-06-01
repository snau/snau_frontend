import process from 'node:process'
import { prefetchQuery, siteQuery } from './app/queries'

export default defineNuxtConfig({
  // If you project doesn't require i18n, use the `without-i18n` branch instead:
  // https://github.com/johannschopplich/cacao-kit-frontend/tree/chore/without-i18n
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-kql',
    '@nuxt/image',
  ],

  // Temporarily disabled for Netlify compatibility testing
  // experimental: {
  //   viewTransition: true,
  // },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-01-01',

  future: {
    compatibilityVersion: 4,
  },

  devtools: {
    enabled: true,
  },

  // Static site generation configuration
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: false, // Disable automatic route discovery to avoid problematic routes
      failOnError: false, // Don't fail the build on prerender errors
      ignore: ['/api/**'], // Ignore API routes during prerendering
    },
    // Additional Netlify optimizations
    experimental: {
      wasm: false,
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: '',
    },
  },

  kql: {
    auth: 'bearer',
    prefetch: {
      kirbyStatic: prefetchQuery,
      // Currently only used to infer the type of the `site` query
      kirbySite: siteQuery,
    },
  },

  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.json',
      },
      {
        code: 'de',
        file: 'de.json',
      },
    ],
    defaultLocale: 'en',
    lazy: true,
    strategy: 'prefix',
    compilation: {
      strictMessage: false,
    },
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: 'root',
    },
    bundle: {
      fullInstall: false,
      dropMessageCompiler: true,
    },
  },

  vite: {
    server: {
      // This is only required for the `pnpm dev:tunnel` command
      // to proxy Kirby requests, especially images
      proxy: {
        '/__kirby': {
          target: process.env.KIRBY_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/__kirby/, ''),
        },
      },
    },
  },
})
