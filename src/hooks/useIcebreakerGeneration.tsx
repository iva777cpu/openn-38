import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { questions } from "@/utils/questions";
import { toast } from "sonner";

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
          // Find the question definition that matches this field
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

      console.log('Filtered and processed fields:', JSON.stringify(filledFields, null, 2));

      const { data, error } = await supabase.functions.invoke('generate-icebreaker', {
        body: { 
          answers: filledFields,
          isFirstTime
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

      const newIcebreakers = data.icebreakers.split(/\d+\./).filter(Boolean).map((text: string) => text.trim());
      console.log('Processed icebreakers:', newIcebreakers);
      
      if (newIcebreakers.length === 0) {
        throw new Error('No icebreakers generated');
      }

      onIcebreakersGenerated(newIcebreakers);

    } catch (error) {
      console.error('Error generating icebreakers:', error);
      toast.error('Failed to generate icebreakers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateIcebreakers
  };
};