export function useFormatDate() {
  const dateFormatter = new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formatDateShort = (date: Date | string) => {
    try {
      // Handle both Date objects and date strings
      const dateObj = date instanceof Date ? date : new Date(date)

      // Check if the date is valid
      if (Number.isNaN(dateObj.getTime())) {
        console.warn('Invalid date provided to formatDateShort:', date)
        return 'Invalid Date'
      }

      return dateFormatter.format(dateObj)
    } catch (error) {
      console.error('Error formatting date:', error, 'Date value:', date)
      return 'Invalid Date'
    }
  }

  return {
    formatDateShort,
  }
}
