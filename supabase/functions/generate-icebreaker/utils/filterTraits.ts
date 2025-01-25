export const filterTraits = (answers: Record<string, any>) => {
  console.log('Filtering traits from raw answers:', answers);

  const filterEntries = (entries: [string, any][], keyCheck: (key: string) => boolean) => {
    const filtered = entries.filter(([key, value]) => {
      const isEmpty = !value?.value || value.value.toString().trim() === '';
      const shouldInclude = !isEmpty && keyCheck(key);
      console.log(`Filtering ${key}:`, { 
        isEmpty, 
        shouldInclude, 
        value,
        priority: value?.priority,
        prompt: value?.prompt 
      });
      return shouldInclude;
    }).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value
    }), {});

    console.log('Filtered entries:', filtered);
    return filtered;
  };

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

  console.log('Final filtered traits:', {
    userTraits,
    targetTraits,
    situationInfo
  });

  return { userTraits, targetTraits, situationInfo };
};