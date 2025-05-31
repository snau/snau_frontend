import { computed } from 'vue'

interface RightContent {
  backgroundcolor?: string
  secondarybackgroundcolor?: string
  textcolor?: string
}

/**
 * Composable for managing dynamic background styles in ScrollingStory
 */
export function useScrollingStoryBackground(
  currentMarkerIndex: Ref<number>,
  rightContent: RightContent[],
) {
  /**
   * Compute dynamic background styles based on current content section
   */
  const backgroundStyle = computed(() => {
    const index = currentMarkerIndex.value
    if (index === -1 || index >= rightContent.length) return {}

    const content = rightContent[index]
    if (!content) return {}

    const {
      backgroundcolor = 'transparent',
      secondarybackgroundcolor = '',
      textcolor = 'inherit',
    } = content

    const hasGradient =
      secondarybackgroundcolor && secondarybackgroundcolor.trim()

    return {
      ...(hasGradient
        ? {
            background: `linear-gradient(to bottom, ${backgroundcolor}, ${secondarybackgroundcolor})`,
          }
        : { backgroundColor: backgroundcolor }),
      color: textcolor,
      transition: 'background 0.5s ease-in-out, color 0.5s ease-in-out',
    }
  })

  return {
    backgroundStyle,
  }
}
