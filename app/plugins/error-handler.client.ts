export default defineNuxtPlugin(() => {
  // Global error handler for client-side errors
  if (import.meta.client) {
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error)
      if (event.error?.message?.includes('includes')) {
        console.error('Includes error details:', {
          message: event.error.message,
          stack: event.error.stack,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        })
      }
    })

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      if (event.reason?.message?.includes('includes')) {
        console.error('Promise rejection includes error:', event.reason)
      }
    })
  }
})
