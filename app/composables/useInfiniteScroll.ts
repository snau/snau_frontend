import { onMounted, onUnmounted, ref, watch } from 'vue'

export function useInfiniteScroll(options: {
  threshold?: number
  distance?: number
}) {
  const containerRef = ref<HTMLElement | null>(null)
  const loaderRef = ref<HTMLElement | null>(null)
  const isLoading = ref(false)
  const hasMore = ref(true)
  const currentPage = ref(1)
  const itemsPerPage = ref(24) // Preload more items but show them gradually
  const visibleItems = ref(new Set<string>()) // Track which items are visible

  // Create intersection observers
  let loadMoreObserver: IntersectionObserver | null = null
  let itemObserver: IntersectionObserver | null = null

  const loadMore = () => {
    if (!isLoading.value && hasMore.value) {
      isLoading.value = true

      // Simulate network delay to see the loading indicator
      setTimeout(() => {
        currentPage.value++
        isLoading.value = false
      }, 500)
    }
  }

  // Function to observe individual items
  const observeItem = (element: HTMLElement, id: string) => {
    if (!itemObserver) {
      itemObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const itemId = entry.target.getAttribute('data-item-id')
            if (!itemId) return

            if (entry.isIntersecting) {
              visibleItems.value.add(itemId)
              // Force a reactive update
              visibleItems.value = new Set(visibleItems.value)
            }
          })
        },
        {
          root: null,
          rootMargin: '50px',
          threshold: 0.1,
        },
      )
    }

    element.setAttribute('data-item-id', id)
    itemObserver.observe(element)
  }

  onMounted(() => {
    if (import.meta.client) {
      // Observer for infinite scroll
      loadMoreObserver = new IntersectionObserver(
        (entries) => {
          const target = entries[0]
          if (target?.isIntersecting) {
            loadMore()
          }
        },
        {
          root: null,
          rootMargin: `${options.distance || 200}px`,
          threshold: options.threshold || 0,
        },
      )

      // Observe the loader element
      if (loaderRef.value) {
        loadMoreObserver.observe(loaderRef.value)
      }

      // Re-observe when the loader element is re-rendered (e.g., after filters)
      watch(
        loaderRef,
        (el, oldEl) => {
          if (!loadMoreObserver) return
          if (oldEl) {
            try {
              loadMoreObserver.unobserve(oldEl)
            } catch {}
          }
          if (el) {
            loadMoreObserver.observe(el)
          }
        },
        { flush: 'post' },
      )
    }
  })

  onUnmounted(() => {
    loadMoreObserver?.disconnect()
    itemObserver?.disconnect()
  })

  return {
    containerRef,
    loaderRef,
    isLoading,
    hasMore,
    currentPage,
    itemsPerPage,
    loadMore,
    visibleItems,
    observeItem,
  }
}
