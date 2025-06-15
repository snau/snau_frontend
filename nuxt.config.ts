import process from 'node:process'
import { prefetchQuery, siteQuery } from './app/queries'

export default defineNuxtConfig({
  app: {
    baseURL: '/',
  },
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

  nitro: {
    // THIS IS THE TEMPORARY CHANGE FOR DEBUGGING
    prerender: {
      // Disable the crawler
      crawlLinks: false,
      // Prerender NO routes, just the basic app shell
      routes: [],
    },
    // ... any other existing nitro settings
  },

  runtimeConfig: {
    public: {
      siteUrl: '',
    },
  },

  kql: {
    auth: 'bearer',
    // TEMPORARILY COMMENT OUT THIS BLOCK FOR DEBUGGING
    /*
    prefetch: {
      kirbyStatic: prefetchQuery,
      kirbySite: siteQuery,
    },
    */
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
    strategy: 'prefix_except_default',
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
    // base: '/', // Removed, less relevant for SSR default
    // build: { // Removed, less relevant for SSR default
    //   assetsDir: '_nuxt',
    // },
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
