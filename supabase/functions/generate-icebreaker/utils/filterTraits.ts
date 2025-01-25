export const filterTraits = (answers: Record<string, any>) => {
  const filterEntries = (entries: [string, any][], keyCheck: (key: string) => boolean) => 
    entries.filter(([key, value]) => {
      const isEmpty = !value?.value || value.value.toString().trim() === '';
      return !isEmpty && keyCheck(key);
    }).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value
    }), {});

  const userTraits = filterEntries(
    Object.entries(answers),
    (key) => key.startsWith('user')
  );

  const targetTraits = filterEntries(
    Object.entries(answers),
    (key) => key.startsWith('target') || 
      ['zodiac', 'mbti', 'style', 'humor', 'loves', 'dislikes', 'hobbies', 'books', 'music', 'mood'].includes(key)
  );

  const situationInfo = filterEntries(
    Object.entries(answers),
    (key) => ['situation', 'previousTopics'].includes(key)
  );

  return { userTraits, targetTraits, situationInfo };
};