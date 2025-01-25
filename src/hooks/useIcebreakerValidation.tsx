import { questions } from "@/utils/questions";

export const useIcebreakerValidation = () => {
  const validateAndProcessFields = (userProfile: Record<string, string>) => {
    const filledFields = Object.entries(userProfile)
      .filter(([_, value]) => value && value.toString().trim() !== '')
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

    return filledFields;
  };

  return {
    validateAndProcessFields
  };
};