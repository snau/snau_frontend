import type { KirbyQuerySchema } from '#nuxt-kql'

export const siteQuery: KirbyQuerySchema = {
  query: 'site',
  select: {
    title: true,
    description: true,
    children: {
      query: 'site.children',
      select: {
        uri: true,
        title: true,
        isListed: true,
        // IMPORTANT: Fetch sub-children for each child page
        children: {
          query: 'page.children',
          select: {
            uri: true,
            title: true,
            isListed: true,
          },
        },
      },
    },
    cover: {
      query: 'site.cover.toFile?.resize(1200)',
      select: ['url'],
    },
  },
}
