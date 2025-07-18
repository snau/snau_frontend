import type {
  KirbyLayout,
  KirbyQueryResponse,
  KirbyQuerySchema,
} from '#nuxt-kql'

export interface KirbyAboutData {
  uri: string
  title: string
  intendedTemplate: string
  description: string
  texttest: string
  layouts: KirbyLayout[]
  address: string
  email: string
  phone: string
  social: {
    platform: string
    url: string
  }[]
  cover?: {
    url: string
  }
  images: {
    uuid: string
    srcset: string
    width: number
    height: number
    alt: string
    meintest: string
    focus: string
    focusX: string
    focusY: string
  }[]
}

export type KirbyAboutResponse = KirbyQueryResponse<KirbyAboutData>

export const aboutQuery: KirbyQuerySchema = {
  query: 'page("about")',
  select: {
    uri: true,
    title: true,
    intendedTemplate: true,
    description: true,
    texttest: true,
    layouts: 'page.layouts.toResolvedLayouts',
    address: 'page.address.kirbytext',
    email: true,
    phone: true,
    social: 'page.social.toStructure',
    cover: {
      query: 'page.cover.toFile?.resize(1200)',
      select: ['url'],
    },
    // Retrieve all images from the page to resolve a UUID from
    // e.g. a structure field to a file object
    images: {
      query: 'page.files.template("image")',
      select: [
        'uuid',
        'srcset',
        'width',
        'height',
        'alt',
        'meintest',
        'focus',
        'focusX',
        'focusY',
      ],
    },
  },
}
