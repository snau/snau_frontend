<script setup lang="ts">
// This file handles the homepage route

import type { KirbySharedPageData } from '~/queries'
import { getPageQuery } from '~/queries'

const { locale } = useI18n()

// Fetch the home page data with error handling
let pageData, pageError
try {
  const result = await useKql(getPageQuery('home'), { language: locale.value })
  pageData = result.data
  pageError = result.error
} catch (error) {
  console.error('Failed to fetch home page data:', error)
  pageData = ref(null)
  pageError = ref(null) // Set to null since we can't guarantee NuxtError type
}

const data = pageData.value
const fetchError = pageError.value

// Store page data if available
const page = data?.result
if (page) {
  setPage(page)
} else {
  // Provide minimal page data for static generation
  const fallbackPage: KirbySharedPageData = {
    uri: 'home',
    title: 'Home',
    intendedTemplate: 'home',
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
      <h1>Welcome</h1>
      <p>Content is currently unavailable. Please try again later.</p>
    </div>
    <DevOnly>
      <AppDebugHelper :error="fetchError" />
    </DevOnly>
  </div>
</template>
