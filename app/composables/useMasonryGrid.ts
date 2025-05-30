import { nextTick, onMounted, onUpdated, ref } from 'vue'

interface MasonryGridOptions {
  columnWidth?: number
  gap?: number | string
  minColumns?: number
}

export function useMasonryGrid(options: MasonryGridOptions = {}) {
  const {
    columnWidth = 500,
    gap = 'var(--ui-gap-medium)',
    minColumns = 1,
  } = options

  const masonryGrid = ref<HTMLElement | null>(null)
  const isGridInitialized = ref(false)
  const loadedImagesCount = ref(0)
  const totalImagesCount = ref(0)

  const createMasonryGrid = () => {
    if (!masonryGrid.value) return

    const gridWidth = masonryGrid.value.offsetWidth
    const columns = Math.max(Math.floor(gridWidth / columnWidth), minColumns)

    // Apply initial styles to prevent flickering
    if (!isGridInitialized.value) {
      masonryGrid.value.style.opacity = '0'
      masonryGrid.value.style.visibility = 'hidden'
    }

    // Reset the grid layout
    masonryGrid.value.style.columnCount = columns.toString()
    masonryGrid.value.style.columnGap =
      typeof gap === 'number' ? `${gap}px` : gap
    masonryGrid.value.style.display = 'block'

    // Apply styles to each item
    const items = Array.from(masonryGrid.value.children)
    items.forEach((item, index) => {
      const htmlItem = item as HTMLElement
      htmlItem.style.gridRowStart = ''
      htmlItem.style.gridColumnStart = ''
      htmlItem.style.breakInside = 'avoid'
      htmlItem.style.marginBottom = typeof gap === 'number' ? `${gap}px` : gap
      htmlItem.dataset.visualIndex = (
        (index % columns) * Math.ceil(items.length / columns) +
        Math.floor(index / columns)
      ).toString()
    })

    // Show the grid immediately after layout is applied
    if (!isGridInitialized.value) {
      masonryGrid.value.style.opacity = '1'
      masonryGrid.value.style.visibility = 'visible'
      masonryGrid.value.style.transition = 'opacity 0.2s ease-out'
      isGridInitialized.value = true
    }
  }

  const handleImageLoaded = () => {
    loadedImagesCount.value++
    if (loadedImagesCount.value >= 2 && !isGridInitialized.value) {
      createMasonryGrid()
    }
  }

  const resetGrid = () => {
    loadedImagesCount.value = 0
    isGridInitialized.value = false
    nextTick(() => {
      setTimeout(createMasonryGrid, 100)
    })
  }

  // Initialize and update the masonry grid when needed
  onMounted(() => {
    setTimeout(createMasonryGrid, 500)
  })

  onUpdated(() => {
    createMasonryGrid()
  })

  // Update layout on window resize
  if (import.meta.client) {
    window.addEventListener('resize', createMasonryGrid)
  }

  return {
    masonryGrid,
    isGridInitialized,
    loadedImagesCount,
    totalImagesCount,
    handleImageLoaded,
    resetGrid,
    createMasonryGrid,
  }
}
