export type SpacingSize = 'small' | 'medium' | 'large' | 'xlarge'
export type MobileSpacing = 'same' | 'smaller' | 'hidden'

export interface SpacingBlock {
  id: string
  type: 'spacing'
  content: {
    size: SpacingSize
    mobile: MobileSpacing
  }
}
