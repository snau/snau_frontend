import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

export function useHeader(site: Ref<any>) {
  const isOpen = ref(false)
  const isLargeScreen = ref(false)

  function handleScreenResize() {
    isLargeScreen.value = window.innerWidth >= 768
  }

  onMounted(() => {
    handleScreenResize()
    window.addEventListener('resize', handleScreenResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleScreenResize)
  })

  // Close mobile nav on large screens
  watch(isLargeScreen, (isLarge) => {
    if (isLarge) {
      isOpen.value = false
    }
  })

  const listedChildren = computed(() => {
    const children = site.value?.children ?? []
    return [
      { title: 'Home', uri: '' },
      ...children.filter((child: any) => child.isListed),
    ]
  })

  // Fixed for better i18n compatibility
  const navigationLinks = computed(() => {
    return listedChildren.value.map((child: any) => {
      // Special case for home - use the root path
      if (!child.uri) {
        return {
          label: child.title,
          to: '/',
          children: child.children || [],
        }
      }

      // For other pages, use the slug format expected by [...slug].vue
      return {
        label: child.title,
        to: `/${child.uri}`,
        children: child.children || [],
      }
    })
  })

  function handleNavigation() {
    isOpen.value = false
  }

  return {
    isOpen,
    isLargeScreen,
    navigationLinks,
    handleNavigation,
  }
}
