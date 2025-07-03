<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Animation state
const currentLogo = ref('snau') // Initially set to SNAU but will change immediately
const rotation = ref(0)

let animationTimer = null
let initialDelay = null

// Define the animation sequence
const animationSequence = [
  { logo: 'regentaucher', rotation: 1 },
  { logo: 'wunderwesten', rotation: 2 },
  { logo: 'snau', rotation: 0 },
]

let currentIndex = 0

// Function to handle a single step in the logo rotation animation
const animateNextLogo = () => {
  currentIndex = (currentIndex + 1) % animationSequence.length
  const { logo, rotation: newRotation } = animationSequence[currentIndex]

  currentLogo.value = logo
  rotation.value = newRotation

  // Schedule the next animation step
  animationTimer = setTimeout(animateNextLogo, 5000)
}

// Function to start the animation
const startAnimation = () => {
  // Start with regentaucher after a very brief delay (just enough for component to render)
  initialDelay = setTimeout(() => {
    currentLogo.value = 'regentaucher'
    rotation.value = 1
    currentIndex = 0

    // Schedule the first animation step after 5 seconds
    animationTimer = setTimeout(animateNextLogo, 5000)
  }, 50) // Very short delay
}

// Start the animation on component mount
onMounted(() => {
  startAnimation()
})

// Clean up on component unmount
onBeforeUnmount(() => {
  if (animationTimer) {
    clearTimeout(animationTimer)
  }
  if (initialDelay) {
    clearTimeout(initialDelay)
  }
})
</script>

<template>
  <NuxtLink to="/">
    <div class="relative w-8 h-8 md:w-10 md:h-10">
      <!-- Background SVG 1 -->
      <svg
        width="60"
        height="60"
        viewBox="0 0 185 185"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="logo-bg-a absolute top-1/2 left-1/2 scale-[0.5] md:scale-[0.65] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 text-black dark:text-white"
        :class="[
          {
            'rotate-11': rotation === 0,
            'rotate-[21deg]': rotation === 1,
            'rotate-[31deg]': rotation === 2,
          },
        ]"
      >
        <path
          d="M184.43 92.2201L171.39 71.0001L172.08 46.1101L150.18 34.2601L138.33 12.3601L113.44 13.0501L92.22 6.10352e-05L71 13.0401L46.11 12.3501L34.26 34.2501L12.36 46.1101L13.04 71.0001L0 92.2201L13.04 113.43L12.35 138.32L34.25 150.17L46.1 172.07L70.99 171.39L92.21 184.43L113.42 171.39L138.31 172.07L150.16 150.17L172.06 138.32L171.37 113.43L184.41 92.2201H184.43Z"
          fill="currentColor"
        />
      </svg>

      <!-- Background SVG 2 -->
      <svg
        width="70"
        height="70"
        viewBox="0 0 185 185"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="scale-[0.5] md:scale-[0.65] logo-bg-b absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50 transition-transform duration-1000 text-black dark:text-white"
        :class="[
          {
            'rotate-0': rotation === 0,
            'rotate-[10deg]': rotation === 1,
            'rotate-[20deg]': rotation === 2,
          },
        ]"
      >
        <path
          d="M184.43 92.2201L171.39 71.0001L172.08 46.1101L150.18 34.2601L138.33 12.3601L113.44 13.0501L92.22 6.10352e-05L71 13.0401L46.11 12.3501L34.26 34.2501L12.36 46.1101L13.04 71.0001L0 92.2201L13.04 113.43L12.35 138.32L34.25 150.17L46.1 172.07L70.99 171.39L92.21 184.43L113.42 171.39L138.31 172.07L150.16 150.17L172.06 138.32L171.37 113.43L184.41 92.2201H184.43Z"
          fill="currentColor"
        />
      </svg>

      <!-- SNAU Logo -->
      <svg
        width="16"
        height="25"
        viewBox="0 0 16 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="logo-snau scale-[0.5] md:scale-[0.65] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 text-white dark:text-black"
        :class="[
          {
            'opacity-100': currentLogo === 'snau',
            'opacity-0': currentLogo !== 'snau',
          },
        ]"
      >
        <path
          d="M14.578 6.45L13.606 6.774C12.58 3.696 10.636 1.428 7.882 1.428C5.83 1.428 4.372 2.994 4.372 5.208C4.372 7.746 6.586 9.096 8.854 10.068C12.958 11.796 15.496 13.74 15.496 17.304C15.496 22.11 11.068 24.648 6.856 24.648C4.156 24.648 1.834 23.676 0.97 22.974C0.592 22.218 0.106 18.546 0.0520001 16.71L1.078 16.494C2.05 20.004 4.534 23.19 7.828 23.19C9.826 23.19 11.662 21.732 11.662 19.302C11.662 16.872 10.096 15.522 7.342 14.226C4.264 12.768 0.862 10.932 0.862 6.936C0.862 3.156 4.048 0.0239981 8.854 0.0239981C11.014 0.0239981 12.418 0.55999 13.498 0.941999C13.876 2.13 14.416 5.208 14.578 6.45Z"
          fill="currentColor"
        />
      </svg>

      <!-- Regentaucher Logo -->
      <svg
        width="18"
        height="25"
        viewBox="0 0 18 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="logo-regentaucher scale-[0.5] md:scale-[0.65] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 text-white dark:text-black"
        :class="[
          {
            'opacity-100': currentLogo === 'regentaucher',
            'opacity-0': currentLogo !== 'regentaucher',
          },
        ]"
      >
        <path
          d="M8.342 6.802H8.45C9.908 4.264 12.284 1.024 14.876 1.024C16.604 1.024 17.792 2.428 17.792 3.616C17.792 4.588 17.144 5.56 16.172 6.046C15.578 6.316 15.092 6.262 14.822 5.938C14.012 5.182 13.418 4.804 12.5 4.804C11.204 4.804 9.638 6.262 8.342 9.232V19.654C8.342 23.326 8.612 23.704 12.716 23.974V25H0.674V23.974C3.86 23.704 4.292 23.326 4.292 19.708V8.152C4.292 4.588 4.022 4.372 0.998 3.94V3.076C3.482 2.698 5.75 2.05 8.342 0.861999V6.802Z"
          fill="currentColor"
        />
      </svg>

      <!-- Wunderwesten Logo -->
      <svg
        width="37"
        height="25"
        viewBox="0 0 37 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="logo-wunderwesten scale-[0.5] md:scale-[0.65] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 text-white dark:text-black"
        :class="[
          {
            'opacity-100': currentLogo === 'wunderwesten',
            'opacity-0': currentLogo !== 'wunderwesten',
          },
        ]"
      >
        <path
          d="M36.558 0.671999V1.698C33.912 2.076 33.48 2.778 32.4 5.64C30.888 9.636 28.35 17.412 25.92 24.648H24.732C22.68 18.978 20.412 13.578 18.09 7.746C15.984 13.362 13.824 18.654 11.718 24.648H10.53C8.586 18.168 6.48 11.742 4.266 5.208C3.294 2.4 2.916 2.022 0.378 1.698V0.671999H11.178V1.698C7.884 2.238 7.668 2.562 8.424 4.992C9.72 9.258 11.124 13.524 12.636 17.952H12.744C14.688 12.714 16.74 7.098 18.9 0.941999H19.98C21.978 6.558 24.246 12.282 26.568 18.168H26.676C27.918 14.172 29.376 9.528 30.402 5.316C31.104 2.562 30.726 2.238 27.216 1.698V0.671999H36.558Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </NuxtLink>
</template>
