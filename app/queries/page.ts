import type {
  KirbyBlock,
  KirbyLayout,
  KirbyQueryResponse,
  KirbyQuerySchema,
} from '#nuxt-kql'

// Define the BioLink interface
export interface BioLink {
  title: string
  url: string
}

export interface KirbySharedPageData {
  uri: string
  title: string
  pagetitle?: string
  intendedTemplate: string
  description: string
  biography: string
  biolinks: BioLink[] // Update the biolinks property to be an array of BioLink objects
  date: string
  backgroundcolor: string
  secondarybackgroundcolor: string
  textcolor: string
  secondarytextcolor: string
  colors: string
  intro: string
  role: string
  gradient: any[]
  gradient_alignment: string
  customtextcolor: string
  blocks: KirbyBlock<string>[]
  layouts: KirbyLayout[]
  invert?: 'light' | 'dark' // Add invert field with specific values
  cover?: {
    url: string
    alt?: string
    height?: number
    width?: number
    srcset: string
    focus?: number
    focusX?: number
    focusY?: number
  }
  i18nMeta: Record<string, { title: string; uri: string }>
}

export interface KirbyPageData extends KirbySharedPageData {
  blocks: KirbyBlock<string>[]
  layouts: KirbyLayout[]
}

export type KirbyPageResponse = KirbyQueryResponse<KirbyPageData>

export const sharedQuerySelects: KirbyQuerySchema['select'] = {
  uri: true,
  title: true,
  intendedTemplate: true,
  description: true,
  cover: {
    query: 'page.cover.toFile?.resize(1200)',
    select: ['url'],
  },
  // Optional: Get title and URI of the current page in all languages
  i18nMeta: true,
}

export function getPageQuery(pageId: string): KirbyQuerySchema {
  return {
    query: `page("${pageId}")`,
    select: {
      uri: true,
      title: true,
      pagetitle: true,
      intendedTemplate: true,
      description: true,
      biography: true,
      biolinks: true,
      date: true,
      backgroundcolor: true,
      secondarybackgroundcolor: true,
      textcolor: true,
      secondarytextcolor: true,
      colors: true,
      intro: true,
      role: true,
      gradient: 'page.gradient.toStructure',
      gradient_alignment: true,
      customtextcolor: true,
      invert: true, // Add invert field to query
      cover: {
        query: 'page.cover.toFile',
        select: [
          'url',
          'uuid',
          'srcset',
          'width',
          'height',
          'alt',
          'meintest',
          'background',
          'colors',
          'backgroundcolor',
          'textcolor',
          'focus',
          'focusX',
          'focusY',
        ],
      },
      // The `toResolvedBlocks` method is a custom Kirby field Method to
      // resolve images inside the image block from UUID to a file object
      blocks: 'page.blocks.toResolvedBlocks',
      layouts: 'page.layouts.toResolvedLayouts',
      ...sharedQuerySelects,
    },
  }
}
