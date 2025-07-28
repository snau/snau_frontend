import type { KirbySite } from '#nuxt-kql'

/**
 * Access the global site context, similar to Kirby's `$site` global variable
 */
export function useSite() {
  return useState<Partial<KirbySite>>('app.site', () => ({
    title: 'SRW',
    description: 'Teamproduktivität leicht gemacht',
    children: [],
  }))
}
