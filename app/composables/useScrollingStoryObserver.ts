import { onBeforeUnmount, onMounted, ref } from 'vue'

interface LeftContent {
  coverimage: {
    url?: string
  } | null
  id: string
}

interface RightContent {
  markerReference: string
}

/**
 * Composable for managing Intersection Observer in ScrollingStory
 */
export function useScrollingStoryObserver(
  leftContent: LeftContent[],
  rightContent: RightContent[],
) {
  // Track the currently visible content section
  const currentMarkerIndex = ref(0)
  // Track which image should be displayed
  const currentImageId = ref<string | null>(null)

  // Intersection Observer instance
  let observer: IntersectionObserver | null = null

  /**
   * Sets up the Intersection Observer to track scroll position and trigger content updates
   * Handles the synchronization between scrolled content and displayed images
   */
  const setupObserver = () => {
    // Set initial image ID if available
    if (rightContent[0]?.markerReference) {
      currentImageId.value = rightContent[0].markerReference
    }

    // Preload images to prevent flickering during transitions
    leftContent.forEach(({ coverimage }) => {
      if (coverimage?.url) {
        const img = new Image()
        img.src = coverimage.url
      }
    })

    try {
      // Initialize Intersection Observer to track scroll position
      observer = new IntersectionObserver(
        (entries) => {
          let mostVisibleEntry: IntersectionObserverEntry | null = null

          for (const entry of entries) {
            if (
              !mostVisibleEntry ||
              entry.intersectionRatio > mostVisibleEntry.intersectionRatio
            ) {
              mostVisibleEntry = entry
            }
          }

          if (mostVisibleEntry?.isIntersecting) {
            const marker = mostVisibleEntry.target as HTMLElement
            const indexAttr = marker.dataset.index
            const markerContent = marker.dataset.markerContent

            if (indexAttr !== undefined) {
              const newIndex = Number.parseInt(indexAttr, 10)
              if (currentMarkerIndex.value !== newIndex) {
                currentMarkerIndex.value = newIndex
                currentImageId.value = markerContent || null
              }
            }
          }
        },
        {
          rootMargin: '-20% 0px',
          threshold: [0, 0.25, 0.5],
        },
      )

      // Attach observer to all content markers
      const markers = document.querySelectorAll<HTMLElement>('.contentMarker')
      markers.forEach((marker, index) => {
        marker.dataset.index = String(index)
        observer?.observe(marker)
      })
    } catch (error) {
      console.error('Error setting up intersection observer:', error)
    }
  }

  /**
   * Clean up observer
   */
  const cleanupObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(setupObserver)
  onBeforeUnmount(cleanupObserver)

  return {
    currentMarkerIndex,
    currentImageId,
    setupObserver,
    cleanupObserver,
  }
}
