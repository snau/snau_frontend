import { nextTick, onMounted, onUnmounted, ref } from 'vue'

interface MasonryGridOptions {
  columnWidth?: number // This will be the target width for each column
  gap?: number | string
  minColumns?: number
}

export function useMasonryGrid(options: MasonryGridOptions = {}) {
  const {
    columnWidth = 250, // Target column width
    gap = 16, // Default gap in pixels
    minColumns = 1,
  } = options

  const masonryGrid = ref<HTMLElement | null>(null)
  const isGridInitialized = ref(false)
  const loadedImagesCount = ref(0)
  const totalImagesCount = ref(0)

  const createMasonryGrid = () => {
    if (!masonryGrid.value) return

    const grid = masonryGrid.value
    const items = Array.from(grid.children) as HTMLElement[]

    // Calculate actual column width and number of columns
    const gridWidth = grid.offsetWidth
    const numColumns = Math.max(
      Math.floor((gridWidth + (typeof gap === 'number' ? gap : 0)) / (columnWidth + (typeof gap === 'number' ? gap : 0))),
      minColumns
    )
    const actualColumnWidth = (gridWidth - (numColumns - 1) * (typeof gap === 'number' ? gap : 0)) / numColumns

    // Initialize column heights
    const columnHeights = Array(numColumns).fill(0)

    // Set container styles
    grid.style.position = 'relative'
    grid.style.height = '0' // Will be updated later

    items.forEach((item) => {
      // Find the shortest column
      const minHeight = Math.min(...columnHeights)
      const columnIndex = columnHeights.indexOf(minHeight)

      // Set item position
      item.style.position = 'absolute'
      item.style.width = `${actualColumnWidth}px`
      item.style.left = `${columnIndex * (actualColumnWidth + (typeof gap === 'number' ? gap : 0))}px`
      item.style.top = `${minHeight}px`

      // Update column height
      columnHeights[columnIndex] += item.offsetHeight + (typeof gap === 'number' ? gap : 0)
    })

    // Set container height to the height of the tallest column
    grid.style.height = `${Math.max(...columnHeights)}px`

    // Show the grid immediately after layout is applied
    if (!isGridInitialized.value) {
      grid.style.opacity = '1'
      grid.style.visibility = 'visible'
      grid.style.transition = 'opacity 0.2s ease-out'
      isGridInitialized.value = true
    }
  }

  const handleImageLoaded = () => {
    loadedImagesCount.value++
    // Recalculate layout after images are loaded
    // This is crucial for correct masonry layout as item heights depend on image loads
    createMasonryGrid()
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
    // Initial layout after component is mounted
    createMasonryGrid()
  })

  // Recalculate on window resize
  if (import.meta.client) {
    window.addEventListener('resize', createMasonryGrid)
  }

  onUnmounted(() => {
    if (import.meta.client) {
      window.removeEventListener('resize', createMasonryGrid)
    }
  })

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