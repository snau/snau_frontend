export const useMobileMenu = () => {
  const isOpen = useState('mobileMenu', () => false)

  // Function to update scroll locking
  const updateScrollLock = (isMenuOpen: boolean) => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('overflow-hidden', isMenuOpen)
      document.documentElement.classList.toggle(
        'pr-[--scrollbar-width]',
        isMenuOpen,
      )
    }
  }

  // Watch for changes to isOpen state
  watch(isOpen, (newValue) => {
    updateScrollLock(newValue)
  })

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  return { isOpen, toggle }
}
