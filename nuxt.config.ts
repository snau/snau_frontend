import process from 'node:process'
import { prefetchQuery, siteQuery } from './app/queries'

export default defineNuxtConfig({
  app: {
    baseURL: '/',
    pageTransition: { name: 'fade', mode: 'out-in' },
  },
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-kql',
    '@nuxt/image',
    '@nuxtjs/mdc',
  ],

  image: {
    // Enable modern formats
    format: ['avif', 'webp', 'jpg', 'png'],
    // Quality settings
    quality: 80,
    // Enable responsive images
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    // Provider configuration
    providers: {
      // Use default provider for local images
    },
    // Presets for common use cases
    presets: {
      default: {
        modifiers: {
          format: 'avif,webp,jpg',
          quality: 80,
        },
      },
    },
  },

  // Ensure ssr is true (this is the default, but explicit is good)
  ssr: true,

  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-01-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: {
    enabled: true,
  },

  // Nitro configuration for static site generation
  nitro: {
    preset: 'cloudflare_pages', // This is the key change
    prerender: {
      routes: ['/sitemap.xml'],
      // Continue prerendering even if some routes fail
      failOnError: false,
      // Ignore 404 errors during prerendering
      ignore: [
        '/de/datenschutz',
        '/en/datenschutz',
        '/de/impressum',
        '/en/impressum',
      ],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: '',
    },
  },

  kql: {
    auth: 'bearer',
    // The prefetch is fine for SSR too, it will run on the server.
    prefetch: {
      kirbyStatic: prefetchQuery,
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
