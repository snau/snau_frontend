<script setup lang="ts">
// This component will receive props from the standard <img> attributes
const props = defineProps<{
  src: string
  alt: string
}>()

// Assumes your image variants are stored like 'image-480w.jpg', etc.
// And that your Kirby setup delivers image URLs from a CDN or a predictable path.
function generateSrcset() {
  if (!props.src || !props.src.includes('.')) return props.src

  const path = props.src.substring(0, props.src.lastIndexOf('.'))
  const extension = props.src.substring(props.src.lastIndexOf('.'))

  const widths = [480, 768, 1024, 1280]

  return widths.map((w) => `${path}-${w}w${extension} ${w}w`).join(', ')
}
</script>

<template>
  <figure class="responsive-image-figure">
    <img
      :src="src"
      :alt="alt"
      :srcset="generateSrcset()"
      sizes="(max-width: 768px) 100vw, 768px"
      loading="lazy"
      class="responsive-image"
    />
    <!-- Note: Standard markdown ![alt](src) doesn't support captions. -->
    <!-- The 'alt' text is used for accessibility, not display. -->
  </figure>
</template>

<style scoped>
.responsive-image-figure {
  margin: 2em 0;
  width: 100%;
}

.responsive-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  border-radius: 8px; /* Optional: matches Nuxt UI's aesthetic */
}
</style>
