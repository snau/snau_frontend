export function useFormatDate() {
  const dateFormatter = new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formatDateShort = (date: Date) => dateFormatter.format(date)

  return {
    formatDateShort,
  }
}
