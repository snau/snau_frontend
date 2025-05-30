export function useCategories(interviews: Ref<any[]>) {
  const selectedCategory = ref('')

  const uniqueCategories = computed(() => {
    const categories = new Set<string>([''])
    interviews.value?.forEach((interview) => {
      interview.categories.forEach((category: string) =>
        categories.add(category),
      )
    })
    return Array.from(categories)
  })

  const categoryDisplayNames = computed(() => ({
    '': 'Alle Themenbereiche',
    ...Object.fromEntries(
      uniqueCategories.value.filter(Boolean).map((category) => [
        category,
        category
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      ]),
    ),
  }))

  const categoriesWithInterviews = computed(() => {
    const categories = uniqueCategories.value.filter((cat) => cat !== '')
    return [''].concat(
      categories.filter((category) =>
        interviews.value?.some((interview) =>
          interview.categories.includes(category),
        ),
      ),
    )
  })

  return {
    selectedCategory,
    categoryDisplayNames,
    categoriesWithInterviews,
  }
}
