import { questions } from "@/utils/questions";

export const useIcebreakerValidation = () => {
  const validateAndProcessFields = (userProfile: Record<string, string>) => {
    const filledFields = Object.entries(userProfile)
      .filter(([_, value]) => {
        // Strictly check for non-empty strings after trimming
        const trimmedValue = value?.toString().trim();
        return trimmedValue !== undefined && trimmedValue !== null && trimmedValue !== '';
      })
      .reduce((acc, [key, value]) => {
        const question = [...questions.userTraits, ...questions.targetTraits, ...questions.generalInfo]
          .find(q => q.id === key);
        
        if (question) {
          console.log(`Processing field ${key}:`, {
            value: value.trim(),
            prompt: question.prompt,
            priority: question.priority,
            questionText: question.text
          });
          
          return {
            ...acc,
            [key]: {
              value: value.trim(),
              prompt: question.prompt,
              priority: question.priority,
              questionText: question.text
            }
          };
        }
        console.log(`Warning: No question definition found for field ${key}`);
        return acc;
      }, {});

    // Log the final filtered fields for debugging
    console.log('Final filtered fields:', JSON.stringify(filledFields, null, 2));
    return filledFields;
  };

  return {
    validateAndProcessFields
  };
};