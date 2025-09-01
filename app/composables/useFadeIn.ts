import { useIntersectionObserver } from '@vueuse/core'
import { onMounted, onUnmounted, ref } from 'vue'

export function useFadeIn() {
  const target = ref(null)
  const isVisible = ref(false)
  let stopped = false

  const { stop } = useIntersectionObserver(
    target,
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) {
        isVisible.value = true
        // Optional: Stop observing once the element is visible
        stop()
        stopped = true
      }
    },
    { threshold: 0.1, rootMargin: '100px 0px' }, // Trigger a bit earlier
  )

  // Fallback for browsers/environments where IntersectionObserver is flaky
  const checkInView = () => {
    const el = target.value as HTMLElement | null
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vw = window.innerWidth || document.documentElement.clientWidth
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh * 0.95 && rect.bottom > 0 && rect.left < vw && rect.right > 0) {
      isVisible.value = true
      if (!stopped) stop()
      stopped = true
    }
  }

  const onScroll = () => {
    if (!isVisible.value) checkInView()
  }

  onMounted(() => {
    // Immediate check in case IO doesn't fire on initial paint (iOS Safari quirks)
    checkInView()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    // Last-resort timeout to ensure content is accessible
    window.setTimeout(() => {
      if (!isVisible.value) checkInView()
    }, 800)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return {
    target,
    isVisible,
  }
}
