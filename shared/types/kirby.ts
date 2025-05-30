export interface ResolvedKirbyImage {
  url: string
  width: number
  height: number
  srcset: string
  alt: string | null
  focus?: string
  focusX?: number
  focusY?: number
  copyright?: string
}

export interface ImageBlock {
  location?: 'web' | string
  src?: string
  alt?: string
  caption?: string
  resolved?: {
    image?: ResolvedKirbyImage[]
  }
}
