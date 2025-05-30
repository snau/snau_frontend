import process from 'node:process'
import { watch } from 'vue'

export function useInvert() {
  const page = usePage()

  // Watch for changes in the page's invert value
  watch(
    () => page.value?.invert,
    (newValue) => {
      if (process.client) {
        // Remove existing invert classes
        document.body.classList.remove('nav-light', 'nav-dark')

        // Add new invert class if value exists
        if (newValue) {
          document.body.classList.add(`nav-${newValue}`)
        }
      }
    },
    { immediate: true },
  )

  return {
    invert: computed(() => page.value?.invert),
  }
}
