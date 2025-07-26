<script setup lang="ts">
/**
 * Layouts Component
 *
 * This component renders flexible layout structures from Kirby CMS.
 * It supports various layout configurations including:
 * - Different width settings (full, wide, narrow)
 * - Column-based layouts with customizable widths
 * - Background colors and gradients
 * - Alignment and padding options
 */
import type { KirbyLayout } from '#nuxt-kql'

/**
 * Defines the structure of a gradient stop with color and position
 */
interface GradientStop {
  color: string // CSS color value
  position: number // Position in percentage (0-100)
}

/**
 * Defines the available attributes for layout customization
 */
interface LayoutAttributes {
  width?: 'full' | 'wide' | 'narrow' | string // Controls the max-width of the layout
  background?: string // Background color name or value
  padding?: string | boolean // Controls padding (true/false or custom value)
  alignment?: 'left' | 'middle' | 'right' | string // Text and content alignment
  styles?: string // Custom CSS styles
  classes?: string // Custom CSS classes
  gradient?: GradientStop[] // Gradient configuration
  gradient_alignment?:
  | 'up'
  | 'right-up'
  | 'right'
  | 'right-down'
  | 'down'
  | 'left-down'
  | 'left'
  | 'left-up' // Gradient direction
  fullscreen?: boolean // Whether the layout should be fullscreen
  customtextcolor?: string // Custom text color for the section
}

/**
 * Extends the KirbyLayout type to include our custom attributes
 */
interface KirbyLayoutWithAttrs extends KirbyLayout {
  attrs: LayoutAttributes
}

/**
 * Component props
 */
const _props = defineProps<{
  layouts: KirbyLayoutWithAttrs[] // Array of layout configurations
}>()

/**
 * Get the current page data to access generaltextcolor
 */
const page = usePage()

/**
 * Compute the effective text color for a layout
 * Priority: layout.attrs.customtextcolor > page.generaltextcolor > null (use default)
 */
const getEffectiveTextColor = (layout: KirbyLayoutWithAttrs): string | null => {
  // Helper function to check if a color value is valid (not empty, null, or undefined)
  const isValidColor = (color: string | undefined | null): color is string => {
    if (color == null) return false

    const trimmed = color.trim()

    // Check for empty or invalid values
    if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') {
      return false
    }

    // Filter out suspicious debugging colors that might come from browser extensions
    const suspiciousColors = ['#fc00bd', 'rgb(252, 0, 189)', 'hsl(312, 100%, 49%)']
    if (suspiciousColors.includes(trimmed.toLowerCase())) {
      console.warn('Filtered out suspicious color value:', trimmed)
      return false
    }

    return true
  }

  // Check layout-specific custom text color first
  if (isValidColor(layout.attrs.customtextcolor)) {
    return layout.attrs.customtextcolor
  }

  // Fall back to page-wide general text color (with safe access)
  const generalTextColor = page.value?.generaltextcolor
  if (isValidColor(generalTextColor)) {
    return generalTextColor
  }

  // Debug logging for development
  if (import.meta.dev && (layout.attrs.customtextcolor || generalTextColor)) {
    console.log('Color values debug:', {
      customtextcolor: layout.attrs.customtextcolor,
      generaltextcolor: generalTextColor,
      customValid: isValidColor(layout.attrs.customtextcolor),
      generalValid: isValidColor(generalTextColor)
    })
  }

  // No valid color found - return null to use default styling
  return null
}

/**
 * Check if a layout is the first one on the page
 *
 * @param layoutIndex - Index of the current layout
 * @returns boolean indicating if this is the first layout
 */
const isFirstLayout = (layoutIndex: number): boolean => {
  return layoutIndex === 0
}

/**
 * Check if padding is enabled for a layout
 *
 * @param padding - The padding value from layout attributes
 * @returns boolean indicating if padding is enabled
 */
const isPaddingEnabled = (padding?: string | boolean): boolean => {
  // Padding is enabled when it's true, "true", or not explicitly set to false
  return (
    padding === true ||
    padding === 'true' ||
    (padding !== false && padding !== 'false')
  )
}

/**
 * Calculates the column span based on a fraction string (e.g., "1/3")
 *
 * @param width - Fraction string in format "numerator/denominator"
 * @param totalColumns - Total number of columns in the grid (default: 12)
 * @returns The number of columns to span
 */
const calculateColumnSpan = (
  width: `${string}/${string}`,
  totalColumns = 12,
): number => {
  const [numerator, denominator] = width.split('/')
  if (!numerator || !denominator) return totalColumns
  return Math.round(
    totalColumns * (Number.parseInt(numerator) / Number.parseInt(denominator)),
  )
}

/**
 * Maps width settings to corresponding CSS classes
 * Uses CSS variables for consistent sizing across the application
 */
const widthClassMap = {
  full: 'w-full', // Full width of the container
  wide: 'max-w-[var(--ui-width-wide)] mx-auto', // Wide but constrained width
  narrow: 'max-w-[var(--ui-width-narrow)] mx-auto', // Narrow width
  default: 'max-w-[var(--ui-width-medium)] mx-auto', // Default width (medium)
} as const

/**
 * Maps alignment settings to corresponding CSS classes
 */
const alignmentClassMap = {
  left: 'text-left justify-start', // Left-aligned content
  middle: 'text-center justify-center', // Center-aligned content
  right: 'text-right justify-end', // Right-aligned content
  default: 'text-left justify-start', // Default alignment
} as const

/**
 * Maps background color names to corresponding CSS classes
 */
const backgroundConfigMap = {
  dark: 'bg-neutral-900 text-white', // Dark background with light text
  light: 'bg-white', // Light background
  primary: 'bg-red-500 text-white', // Primary brand color
  secondary: 'bg-secondary text-white', // Secondary brand color
} as const

/**
 * Maps gradient alignment to CSS gradient direction
 */
const gradientDirectionMap = {
  up: 'to top',
  'right-up': 'to top right',
  right: 'to right',
  'right-down': 'to bottom right',
  down: 'to bottom',
  'left-down': 'to bottom left',
  left: 'to left',
  'left-up': 'to top left',
} as const

/**
 * Returns the appropriate width class based on the layout's width attribute
 *
 * @param width - The width value from layout attributes
 * @returns CSS class string for the specified width
 */
const getWidthClass = (width?: LayoutAttributes['width']): string => {
  if (!width) return widthClassMap.default
  return (
    widthClassMap[width as keyof typeof widthClassMap] ?? widthClassMap.default
  )
}

/**
 * Returns the appropriate alignment class based on the layout's alignment attribute
 *
 * @param alignment - The alignment value from layout attributes
 * @returns CSS class string for the specified alignment
 */
const getAlignmentClass = (
  alignment?: LayoutAttributes['alignment'],
): string => {
  if (!alignment) return alignmentClassMap.default
  return (
    alignmentClassMap[alignment as keyof typeof alignmentClassMap] ??
    alignmentClassMap.default
  )
}

/**
 * Returns the appropriate background class based on the layout's background attribute
 *
 * @param layout - The layout configuration
 * @returns CSS class string for the specified background
 */
const getBackgroundClass = (layout: KirbyLayoutWithAttrs): string => {
  // Skip if using gradient instead
  if (layout.attrs.gradient && layout.attrs.gradient.length > 0) {
    return ''
  }

  // No background specified
  if (!layout.attrs.background) return ''

  // Use predefined background if available
  if (layout.attrs.background in backgroundConfigMap) {
    return backgroundConfigMap[
      layout.attrs.background as keyof typeof backgroundConfigMap
    ]
  }

  // Fallback to dynamic background class
  return `bg-${layout.attrs.background}`
}

/**
 * Generates a CSS gradient style string from gradient stops
 *
 * @param gradient - Array of gradient stops
 * @param alignment - Gradient direction alignment
 * @returns CSS style string for the gradient
 */
const getGradientStyle = (
  gradient?: GradientStop[],
  alignment: LayoutAttributes['gradient_alignment'] = 'down',
): string => {
  if (!gradient || gradient.length === 0) return ''

  // Calculate positions automatically based on number of stops
  const totalStops = gradient.length

  // Create the gradient string with automatically calculated positions
  const gradientStops = gradient
    .map((stop, index) => {
      // Calculate position: evenly distribute stops from 0% to 100%
      const position =
        totalStops === 1
          ? 0 // Single color = solid color
          : Math.round((index / (totalStops - 1)) * 100)

      return `${stop.color} ${position}%`
    })
    .join(', ')

  const direction = gradientDirectionMap[alignment] || 'to bottom'
  return `background: linear-gradient(${direction}, ${gradientStops});`
}

/**
 * Returns the appropriate padding classes based on the layout's padding attribute
 * Now includes special handling for first layout with padding enabled
 *
 * @param padding - The padding value from layout attributes
 * @param isFirst - Whether this is the first layout on the page
 * @returns CSS class string for the specified padding
 */
const getPaddingClass = (
  padding?: string | boolean,
  isFirst: boolean = false,
): string => {
  // No padding when explicitly set to false
  if (padding === false || padding === 'false') {
    return 'py-0 px-0'
  }

  // Special handling for first layout with padding enabled
  if (isFirst && isPaddingEnabled(padding)) {
    return 'pb-4 px-6 md:pb-8'
  }

  // Default responsive padding
  return 'py-4 px-6 md:py-8'
}

/**
 * Combines all layout classes into a single array for the template
 *
 * @param layout - The layout configuration
 * @param layoutIndex - Index of the current layout
 * @returns Array of CSS classes for the layout
 */
const getLayoutClasses = (
  layout: KirbyLayoutWithAttrs,
  layoutIndex: number,
) => {
  // Start with custom classes if provided
  const classes = []

  if (layout.attrs.classes) {
    classes.push(layout.attrs.classes)
  }

  // Add functional classes
  classes.push(getAlignmentClass(layout.attrs.alignment))
  classes.push(
    getPaddingClass(layout.attrs.padding, isFirstLayout(layoutIndex)),
  )

  return classes
}

/**
 * Generates inline styles for the layout
 *
 * @param layout - The layout configuration
 * @returns CSS style string
 */
const getLayoutStyles = (layout: KirbyLayoutWithAttrs): string => {
  const styles: string[] = []

  // Add gradient if defined
  if (layout.attrs.gradient && layout.attrs.gradient.length > 0) {
    styles.push(
      getGradientStyle(layout.attrs.gradient, layout.attrs.gradient_alignment),
    )
  }

  // Add effective text color if defined (customtextcolor takes priority over generaltextcolor)
  const effectiveTextColor = getEffectiveTextColor(layout)
  if (effectiveTextColor) {
    styles.push(`color: ${effectiveTextColor}`)
  }

  // Add custom styles if defined
  if (layout.attrs.styles) {
    styles.push(layout.attrs.styles)
  }

  return styles.join('; ')
}

/**
 * Generates classes for a column based on its width
 *
 * @param width - Column width as a fraction string (e.g., "1/3")
 * @returns CSS class string for the column
 */
const getColumnClasses = (width: string): string => {
  const colSpan = calculateColumnSpan(width as `${string}/${string}`)
  return `column col-span-${colSpan} relative`
}

/**
 * Check if a layout contains a ScrollingStory block
 *
 * @param layout - The layout configuration
 * @returns boolean indicating if the layout contains a ScrollingStory block
 */
const hasScrollingStoryBlock = (layout: KirbyLayoutWithAttrs): boolean => {
  return layout.columns.some((column) =>
    column.blocks.some((block) => (block.type as string) === 'scrolling-story'),
  )
}

/**
 * Check if a layout contains a Hero block
 *
 * @param layout - The layout configuration
 * @returns boolean indicating if the layout contains a Hero block
 */
const hasHeroBlock = (layout: KirbyLayoutWithAttrs): boolean => {
  return layout.columns.some((column) =>
    column.blocks.some((block) => (block.type as string) === 'hero'),
  )
}
</script>

<template>
  <!-- Loop through each layout -->
  <section v-for="(layout, layoutIndex) in layouts" :id="layout.id" :key="layout.id" :class="[
    getBackgroundClass(layout),
    {
      'min-h-screen':
        layout.attrs.fullscreen &&
        isFirstLayout(layoutIndex) &&
        hasHeroBlock(layout),
    },
  ]" :style="getLayoutStyles(layout)" class="layout-section">
    <!-- Layout container with width control -->
    <div :class="[
      getWidthClass(layout.attrs.width),
      ...getLayoutClasses(layout, layoutIndex),
    ]" class="layout-container">
      <!-- Grid for columns -->
      <!-- Special spacing applied when:
           1. This is the first layout on the page (layoutIndex === 0)
           2. The layout has fullscreen attribute set to true
           3. The layout contains a ScrollingStory block or Hero block -->
      <div id="inner-container" class="grid grid-cols-12 gap-6" :class="{
        '-mt-20 lg:-mt-64 ':
          layout.attrs.fullscreen &&
          isFirstLayout(layoutIndex) &&
          (hasScrollingStoryBlock(layout) || hasHeroBlock(layout)),
      }">
        <!-- Loop through each column in the layout -->
        <div v-for="(column, columnIndex) in layout.columns" id="column-container" :key="columnIndex" :class="[
          getColumnClasses(column.width),
          {
            'h-auto': layout.attrs.fullscreen,
            'min-h-screen':
              layout.attrs.fullscreen &&
              isFirstLayout(layoutIndex) &&
              hasHeroBlock(layout),
          },
        ]" class="">
          <!-- Render blocks within the column -->
          <KirbyBlocks :blocks="column.blocks" :text-color="getEffectiveTextColor(layout) || undefined" />
        </div>
      </div>
    </div>
  </section>
</template>
