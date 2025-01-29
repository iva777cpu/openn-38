import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useIcebreakerValidation } from "./useIcebreakerValidation";

interface GenerateResponse {
  error?: string;
  icebreakers?: string[];
}

export const useIcebreakerGeneration = (
  userProfile: Record<string, string>,
  isFirstTime: boolean,
  onIcebreakersGenerated: (icebreakers: string[]) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { validateAndProcessFields } = useIcebreakerValidation();

  const generateIcebreakers = async (): Promise<GenerateResponse | undefined> => {
    console.log('Starting icebreaker generation with profile:', userProfile);
    console.log('Is first time?:', isFirstTime);
    
    setIsLoading(true);
    try {
      const filledFields = validateAndProcessFields(userProfile);
      console.log('Filtered and processed fields:', JSON.stringify(filledFields, null, 2));

      const { data, error } = await supabase.functions.invoke('generate-icebreaker', {
        body: { 
          answers: filledFields,
          isFirstTime
        }
      });

      if (error) throw error;
      
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
      return { icebreakers: newIcebreakers };

    } catch (error) {
      console.error('Error generating icebreakers:', error);
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'Failed to generate icebreakers. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    generateIcebreakers
  };
};