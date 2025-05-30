<script setup lang="ts">
// This file handles the homepage route

import { getPageQuery } from '~/queries'

const { locale } = useI18n()

// Fetch the home page data
const { data: pageData, error: pageError } = await useKql(
  getPageQuery('home'),
  { language: locale.value },
)

const data = pageData.value
const fetchError = pageError.value

// Store page data
const page = data?.result
setPage(page)
</script>

<template>
  <div>
    <KirbyLayouts v-if="page?.layouts?.length" :layouts="page.layouts" />
    <KirbyBlocks v-else-if="page?.blocks" :blocks="page.blocks" />
    <DevOnly>
      <AppDebugHelper :error="fetchError" />
    </DevOnly>
  </div>
</template>
