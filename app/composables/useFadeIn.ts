import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export function useFadeIn() {
  const target = ref(null)
  const isVisible = ref(false)

  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isVisible.value = true
        // Optional: Stop observing once the element is visible
        stop()
      }
    },
    { threshold: 0.1 } // Trigger when 10% of the element is visible
  )

  return {
    target,
    isVisible,
  }
}
