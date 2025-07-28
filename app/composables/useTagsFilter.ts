export function useTags(interviews: Ref<any[]>) {
  const selectedTag = ref('')

  const uniqueTags = computed(() => {
    const tags = new Set<string>([''])
    interviews.value?.forEach((interview) => {
      interview.tags?.forEach((tag: string) => tags.add(tag))
    })
    return Array.from(tags)
  })

  const tagDisplayNames = computed(() => ({
    '': 'All Tags',
    ...Object.fromEntries(
      uniqueTags.value.filter(Boolean).map((tag) => [
        tag,
        tag
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      ]),
    ),
  }))

  const tagsWithInterviews = computed(() => {
    const tags = uniqueTags.value.filter((tag) => tag !== '')
    return [''].concat(
      tags.filter((tag) =>
        interviews.value?.some((interview) => interview.tags?.includes(tag)),
      ),
    )
  })

  return {
    selectedTag,
    tagDisplayNames,
    tagsWithInterviews,
  }
}
