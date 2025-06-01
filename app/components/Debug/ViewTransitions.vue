<script setup lang="ts">
import { onMounted, ref } from 'vue'

const debugInfo = ref({
  supported: false,
  userAgent: '',
  currentURL: '',
  viewTransitionNames: [] as string[],
})

onMounted(() => {
  // Check browser support
  debugInfo.value.supported =
    typeof document.startViewTransition !== 'undefined'
  debugInfo.value.userAgent = navigator.userAgent
  debugInfo.value.currentURL = window.location.href

  // Find all elements with view-transition-name
  const elements = document.querySelectorAll('[style*="view-transition-name"]')
  debugInfo.value.viewTransitionNames = Array.from(elements).map((el) => {
    const style = getComputedStyle(el)
    return style.getPropertyValue('view-transition-name') || 'none'
  })

  // Log to console for debugging (development only)
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('🔍 View Transitions Debug:', debugInfo.value)
  }
})
</script>

<template>
  <div
    v-if="import.meta.env.DEV"
    class="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs z-50 max-w-sm"
  >
    <h3 class="font-bold mb-2">View Transitions Debug</h3>
    <div class="space-y-1">
      <div>
        <strong>Supported:</strong>
        <span :class="debugInfo.supported ? 'text-green-400' : 'text-red-400'">
          {{ debugInfo.supported ? 'Yes' : 'No' }}
        </span>
      </div>
      <div>
        <strong>Browser:</strong> {{ debugInfo.userAgent.substring(0, 50) }}...
      </div>
      <div><strong>URL:</strong> {{ debugInfo.currentURL }}</div>
      <div>
        <strong>Transition Names:</strong>
        {{ debugInfo.viewTransitionNames.length }}
      </div>
      <div
        v-if="debugInfo.viewTransitionNames.length > 0"
        class="text-gray-300"
      >
        {{ debugInfo.viewTransitionNames.join(', ') }}
      </div>
    </div>
  </div>
</template>
