export interface Button {
  text: string
  link: {
    href: string
    type: string
    popup: boolean
    title: string
  } | null
  style: 'primary' | 'secondary' | 'tertiary' | 'quartiary' | 'white' | 'black'
}

export interface ButtonsBlock {
  id: string
  type: 'buttons'
  content: {
    title: string | null
    buttons: Button[]
  }
}
