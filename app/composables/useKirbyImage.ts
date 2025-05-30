import type { ImageBlock } from '../../shared/types/kirby'

export function useKirbyImage(content: ImageBlock) {
  const getImageSource = () => ({
    src: content.location === 'web' ? content.src : undefined,
    srcset:
      content.location !== 'web'
        ? content.resolved?.image?.[0]?.srcset
        : undefined,
  })

  const getImageMeta = () => ({
    width: content.resolved?.image?.[0]?.width,
    height: content.resolved?.image?.[0]?.height,
    alt: content.alt || content.resolved?.image?.[0]?.alt || '',
    copyright: content.resolved?.image?.[0]?.copyright,
  })

  return {
    getImageSource,
    getImageMeta,
  }
}
