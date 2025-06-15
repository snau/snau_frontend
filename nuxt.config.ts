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

  // SSR is the default, remove static site generation configuration
  nitro: {
    // preset: 'static', // Removed for SSR
    // output: { // Output configuration is usually not needed for Netlify SSR
    //   dir: '.output',
    //   publicDir: '.output/public',
    // },
    // prerender: { // Removed for SSR
    //   routes: [
    //     '/',
    //     '/portfolio',
    //     '/wantalon',
    //     '/interviews',
    //     '/kontakt',
    //     '/interviews/reiner-eckel',
    //     '/portfolio/beat-toniolo',
    //     '/de',
    //     '/de/portfolio',
    //     '/de/wantalon',
    //     '/de/interviews',
    //     '/de/kontakt',
    //     '/de/interviews/reiner-eckel',
    //     '/de/portfolio/beat-toniolo',
    //   ],
    //   crawlLinks: false,
    //   failOnError: false,
    //   ignore: ['/api/**'],
    // },
    // Additional Netlify optimizations (can be kept if they don't conflict)
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
