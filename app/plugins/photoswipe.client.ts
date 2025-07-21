import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

// Nuxt plugin that initialises a global PhotoSwipeLightbox instance on every page
export default defineNuxtPlugin(() => {
  let lightbox: PhotoSwipeLightbox | undefined

  const initLightbox = () => {
    if (lightbox) {
      lightbox.destroy()
    }

    lightbox = new PhotoSwipeLightbox({
      gallery: '.pswp-gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),

      // Smooth animation settings
      showHideAnimationType: 'zoom',
      showAnimationDuration: 300,
      hideAnimationDuration: 300,

      // Preload adjacent images
      preload: [1, 2],

      // Consistent sizing
      initialZoomLevel: 'fit',
      secondaryZoomLevel: 1.5,

      // Disable zoom to prevent jitter
      wheelToZoom: false,

      // Better UX
      escKey: true,
      arrowKeys: true,
    })

    // Add smooth transition CSS
    const style = document.createElement('style')
    style.textContent = `
      .pswp {
        --pswp-transition-duration: 300ms;
      }
      
      .pswp__img {
        transition: opacity var(--pswp-transition-duration) ease;
      }
      
      .pswp__bg {
        transition: opacity var(--pswp-transition-duration) ease;
      }
    `
    document.head.appendChild(style)

    lightbox.init()
  }

  // Initialize immediately
  initLightbox()

  // Re-initialize on route changes
  if (import.meta.client) {
    window.addEventListener('nuxt:page:finish', initLightbox)
  }

  return {
    provide: {
      photoswipe: lightbox,
    },
  }
})
