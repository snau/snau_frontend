import type { KirbyQueryResponse, KirbyQuerySchema } from '#nuxt-kql'

export type KirbyInterviewData = {
  uri: string
  title: string
  categories: string[]
  tags: string[]
  role: string
  backgroundcolor: string
  secondarybackgroundcolor: string
  textcolor: string
  secondarytextcolor: string
  description: string
  date: string
  intro: string
  cover?: {
    width: number
    height: number
    url: string
    alt: string
    src: string
    srcset: string
  }
}[]

export type KirbyInterviewsResponse = KirbyQueryResponse<KirbyInterviewData>

export const interviewsQuery: KirbyQuerySchema = {
  query: 'page("interviews").children.listed',
  select: {
    uri: true,
    title: true,
    categories: 'page.categories.split',
    tags: 'page.tags.split',
    role: true,
    backgroundcolor: true,
    secondarybackgroundcolor: true,
    textcolor: true,
    secondarytextcolor: true,
    description: true,
    date: true,
    intro: true,
    cover: {
      query: 'page.cover.toFile.resize(300, 600)',
      select: ['width', 'height', 'url', 'alt', 'src', 'srcset'],
    },
  },
}
