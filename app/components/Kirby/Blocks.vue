<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { Component } from 'vue'
import {
  LazyKirbyBlockAccordion,
  LazyKirbyBlockHeading,
  LazyKirbyBlockHero,
  LazyKirbyBlockImage,
  LazyKirbyBlockInfo,
  LazyKirbyBlockInterviewFooter,
  LazyKirbyBlockInterviewHeader,
  LazyKirbyBlockIntro,
  LazyKirbyBlockLatest,
  LazyKirbyBlockLine,
  LazyKirbyBlockList,
  LazyKirbyBlockParcours,
  LazyKirbyBlockPortfolio,
  LazyKirbyBlockQuote,
  LazyKirbyBlockScrollingStory,
  LazyKirbyBlockStorystart,
  LazyKirbyBlockTeamStructure,
  LazyKirbyBlockTeaser,
  LazyKirbyBlockText,
  LazyKirbyBlockVideo,
} from '#components'

defineProps<{
  blocks: KirbyBlock<string>[]
}>()

const blockComponents: Record<string, Component> = {
  // Built-in Kirby blocks
  heading: LazyKirbyBlockHeading,
  image: LazyKirbyBlockImage,
  line: LazyKirbyBlockLine,
  list: LazyKirbyBlockList,
  quote: LazyKirbyBlockQuote,
  text: LazyKirbyBlockText,
  // Custom blocks
  accordion: LazyKirbyBlockAccordion,
  hero: LazyKirbyBlockHero,
  latest: LazyKirbyBlockLatest,
  intro: LazyKirbyBlockIntro,
  storystart: LazyKirbyBlockStorystart,
  parcours: LazyKirbyBlockParcours,
  teaser: LazyKirbyBlockTeaser,
  info: LazyKirbyBlockInfo,
  video: LazyKirbyBlockVideo,
  'interview-footer': LazyKirbyBlockInterviewFooter,
  'interviews-grid': LazyKirbyBlockPortfolio,
  'interview-header': LazyKirbyBlockInterviewHeader,
  'scrolling-story': LazyKirbyBlockScrollingStory,
  'team-structure': LazyKirbyBlockTeamStructure,
}

const content = ref<HTMLElement | undefined>()
useInternalLinks(content)
</script>

<template>
  <div ref="content">
    <template v-for="(block, index) in blocks" :key="index">
      <component :is="blockComponents[block.type]" :block="block" />
    </template>
  </div>
</template>
