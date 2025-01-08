import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { questions } from "@/utils/questions";

export const useIcebreakerGeneration = (
  userProfile: Record<string, string>,
  isFirstTime: boolean,
  onIcebreakersGenerated: (icebreakers: string[]) => void
) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateIcebreakers = async () => {
    console.log('Starting icebreaker generation with profile:', userProfile);
    console.log('Is first time?:', isFirstTime);
    
    setIsLoading(true);
    try {
      // Only include filled fields to reduce token usage
      const filledFields = Object.entries(userProfile)
        .filter(([_, value]) => value && value.toString().trim() !== '')
        .reduce((acc, [key, value]) => {
          const question = [...questions.userTraits, ...questions.targetTraits, ...questions.generalInfo]
            .find(q => q.id === key);
          
          if (question) {
            const adjustedTemperature = isFirstTime ? 
              Math.min(0.9, question.temperature + 0.2) : 
              question.temperature;

            console.log(`Field ${key} temperature:`, {
              base: question.temperature,
              adjusted: adjustedTemperature,
              isFirstTime,
              value,
              prompt: question.prompt
            });

            return {
              ...acc,
              [key]: {
                value,
                prompt: question.prompt,
                temperature: adjustedTemperature,
                category: key.startsWith('user') ? 'user' : 
                         key.startsWith('target') ? 'target' : 'general'
              }
            };
          }
          return acc;
        }, {});

      console.log('Filtered fields with temperatures:', filledFields);

      const { data, error } = await supabase.functions.invoke('generate-icebreaker', {
        body: { 
          answers: filledFields,
          isFirstTime,
          temperature: isFirstTime ? 0.9 : 0.5
        }
      });

      if (error) {
        console.error('Error from Supabase function:', error);
        throw error;
      }
      
      console.log('Raw AI response:', data);

      if (!data?.icebreakers) {
        throw new Error('Invalid response format from AI');
      }

      const newIcebreakers = data.icebreakers
        .split(/\d+\./)
        .filter(Boolean)
        .map((text: string) => text.trim());
      
      console.log('Processed icebreakers:', newIcebreakers);
      
      if (newIcebreakers.length === 0) {
        throw new Error('No icebreakers generated');
      }

      onIcebreakersGenerated(newIcebreakers);

    } catch (error) {
      console.error('Error generating icebreakers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateIcebreakers
  };
};