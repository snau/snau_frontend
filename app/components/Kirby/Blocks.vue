<script setup lang="ts">
import type { KirbyBlock } from '#nuxt-kql'
import type { Component } from 'vue'
import {
  LazyKirbyBlockAccordion,
  LazyKirbyBlockButtons,
  LazyKirbyBlockContentTeaser,
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
  LazyKirbyBlockMarkdown,
  LazyKirbyBlockParcours,
  LazyKirbyBlockPortfolio,
  LazyKirbyBlockQuote,
  LazyKirbyBlockScrollingStory,
  LazyKirbyBlockSpacing,
  LazyKirbyBlockStorystart,
  LazyKirbyBlockTeaser,
  LazyKirbyBlockText,
  LazyKirbyBlockVideo,
  FadeIn,
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
  markdown: LazyKirbyBlockMarkdown,
  quote: LazyKirbyBlockQuote,
  text: LazyKirbyBlockText,
  // Custom blocks
  accordion: LazyKirbyBlockAccordion,
  buttons: LazyKirbyBlockButtons,
  hero: LazyKirbyBlockHero,
  latest: LazyKirbyBlockLatest,
  intro: LazyKirbyBlockIntro,
  spacing: LazyKirbyBlockSpacing,
  storystart: LazyKirbyBlockStorystart,
  parcours: LazyKirbyBlockParcours,
  teaser: LazyKirbyBlockTeaser,
  info: LazyKirbyBlockInfo,
  video: LazyKirbyBlockVideo,
  'interview-footer': LazyKirbyBlockInterviewFooter,
  'interviews-grid': LazyKirbyBlockPortfolio,
  'interview-header': LazyKirbyBlockInterviewHeader,
  'scrolling-story': LazyKirbyBlockScrollingStory,
  contentTeaser: LazyKirbyBlockContentTeaser,
}

const content = ref<HTMLElement | undefined>()
useInternalLinks(content)
</script>

<template>
  <div ref="content">
    <template v-for="(block, index) in blocks" :key="index">
      <FadeIn>
        <component :is="blockComponents[block.type]" :block="block" />
      </FadeIn>
    </template>
  </div>
</template>
