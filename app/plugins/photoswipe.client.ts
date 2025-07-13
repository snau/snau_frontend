import PhotoSwipeLightbox from 'photoswipe/lightbox'
import type { NuxtApp } from '#app'
import 'photoswipe/style.css'

// Nuxt plugin that initialises a global PhotoSwipeLightbox instance on every page
export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  let lightbox: PhotoSwipeLightbox | undefined

  // Re-create lightbox whenever page navigation finishes so that
  // newly rendered images are picked up automatically.
  nuxtApp.hook('page:finish', () => {
    // Destroy previous instance to avoid duplicates and memory leaks
    if (lightbox) {
      lightbox.destroy()
    }

    // Create a new instance. We treat every element that has the
    // `.pswp-gallery` class as an individual gallery and every anchor
    // (`<a>`) inside it as a slide.
    lightbox = new PhotoSwipeLightbox({
      gallery: '.pswp-gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })

    lightbox.init()
  })
})
