export type SpacingSize = 'small' | 'medium' | 'large' | 'xlarge' | 'hidden'
// Mobile now uses the same explicit sizes as desktop
export type MobileSpacing = SpacingSize

export interface SpacingBlock {
  id: string
  type: 'spacing'
  content: {
    desktop: SpacingSize // explicit desktop size
    mobile: MobileSpacing // explicit mobile size
  }
}
