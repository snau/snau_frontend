<script setup lang="ts">
// This Nuxt page will render every Kirby page

import type { KirbySharedPageData } from '~/queries'
import { getPageQuery } from '~/queries'

const { locale, localeCodes } = useI18n()
const route = useRoute()

// Extract the non-localized slug
const pageUri = getNonLocalizedSlug(route.params.slug || '', localeCodes.value)

let data, fetchError

try {
  const { data: pageData, error: pageError } = await useKql(
    getPageQuery(pageUri || 'home'),
    { language: locale.value },
  )

  data = pageData.value
  fetchError = pageError.value

  // If page content is empty, try to load the error page
  if (!data?.result) {
    try {
      const { data: errorPageData, error: errorPageError } = await useKql(
        getPageQuery('error'),
        { language: locale.value },
      )
      data = errorPageData.value
      fetchError = errorPageError.value
      const event = useRequestEvent()
      if (event) setResponseStatus(event, 404)
    } catch (errorPageFetchError) {
      console.error('Failed to fetch error page:', errorPageFetchError)
      data = null
      fetchError = null
    }
  }
} catch (error) {
  console.error('Failed to fetch page data:', error)
  data = null
  fetchError = null
}

// Store page data if available
const page = data?.result
if (page) {
  setPage(page)
} else {
  // Provide minimal page data for static generation
  const fallbackPage: KirbySharedPageData = {
    uri: pageUri || 'home',
    title: 'Page',
    intendedTemplate: 'default',
    description: '',
    biography: '',
    biolinks: [],
    date: new Date().toISOString(),
    backgroundcolor: '',
    secondarybackgroundcolor: '',
    textcolor: '',
    secondarytextcolor: '',
    intro: '',
    role: '',
    blocks: [],
    layouts: [],
    i18nMeta: {},
  }
  setPage(fallbackPage)
}
</script>

<template>
  <div>
    <KirbyLayouts v-if="page?.layouts?.length" :layouts="page.layouts" />
    <KirbyBlocks v-else-if="page?.blocks" :blocks="page.blocks" />
    <div v-else-if="fetchError" class="error-fallback">
      <h1>Page Not Found</h1>
      <p>
        The requested page is currently unavailable. Please try again later.
      </p>
    </div>
    <div v-else class="error-fallback">
      <h1>Content Unavailable</h1>
      <p>Content is currently being loaded. Please try again later.</p>
    </div>
    <DevOnly>
      <AppDebugHelper :error="fetchError" />
    </DevOnly>
  </div>
</template>
