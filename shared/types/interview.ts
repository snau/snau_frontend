export interface Interview {
  uri: string
  title: string
  date: string
  intro: string
  categories: string[]
  tags: string[]
  cover?: {
    url: string
    srcset: string
    alt: string
  }
}
