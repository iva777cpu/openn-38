import React, { useState } from "react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { questions } from "@/utils/questions";
import { toast } from "sonner";

interface IcebreakerGeneratorProps {
  userProfile: Record<string, string>;
  onIcebreakersGenerated: (icebreakers: string[]) => void;
  isFirstTime: boolean;
}

export const IcebreakerGenerator: React.FC<IcebreakerGeneratorProps> = ({
  userProfile,
  onIcebreakersGenerated,
  isFirstTime,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const generateIcebreakers = async () => {
    console.log('Starting icebreaker generation with profile:', userProfile);
    console.log('Is first time?:', isFirstTime);
    console.log('Retry count:', retryCount);
    
    setIsLoading(true);
    try {
      // Only include filled fields to reduce token usage
      const filledFields = Object.entries(userProfile)
        .filter(([_, value]) => value && value.toString().trim() !== '')
        .reduce((acc, [key, value]) => {
          const question = [...questions.userTraits, ...questions.targetTraits, ...questions.generalInfo]
            .find(q => q.id === key);
          
          if (question) {
            return {
              ...acc,
              [key]: {
                value,
                prompt: question.prompt,
                temperature: isFirstTime ? Math.min(0.9, question.temperature + 0.2) : question.temperature
              }
            };
          }
          return acc;
        }, {});

      console.log('Filtered filled fields:', filledFields);
      console.log('Number of filled fields:', Object.keys(filledFields).length);

      const systemPrompt = `You are a witty conversation expert. Generate engaging ice breakers that are clever and fun.
Mix formats: casual questions (0.5), fun facts (0.8), statements (0.5), friendly banter (0.8).
Keep each response under 25 words. If referencing specific content (books, mythology, celebrities, etc), add brief explanation (max 15 words) in parentheses.
Return exactly 3 numbered responses. No introductory text or emojis.
${isFirstTime ? 'Keep responses approachable for first-time interaction.' : 'Build on existing rapport.'}`

      console.log('System prompt:', systemPrompt);
      console.log('Sending request to Supabase function with payload:', {
        answers: filledFields,
        isFirstTime,
        systemPrompt,
        temperature: isFirstTime ? 0.9 : 0.5
      });

      const { data, error } = await supabase.functions.invoke('generate-icebreaker', {
        body: { 
          answers: filledFields,
          isFirstTime,
          systemPrompt,
          temperature: isFirstTime ? 0.9 : 0.5
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Raw AI response:', data);

      if (!data?.icebreakers) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from AI');
      }

      const newIcebreakers = data.icebreakers.split(/\d+\./).filter(Boolean).map((text: string) => text.trim());
      console.log('Processed icebreakers:', newIcebreakers);
      
      if (newIcebreakers.length === 0) {
        throw new Error('No icebreakers generated');
      }

      onIcebreakersGenerated(newIcebreakers);
      setRetryCount(0); // Reset retry count on success
      toast.success('Generated new icebreakers!');

    } catch (error) {
      console.error('Error generating icebreakers:', error);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        setRetryCount(prev => prev + 1);
        toast.error(`Failed to generate icebreakers. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => generateIcebreakers(), 1000); // Retry after 1 second
      } else {
        toast.error('Failed to generate icebreakers. Please try again later.');
        setRetryCount(0); // Reset retry count
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button 
        onClick={generateIcebreakers} 
        disabled={isLoading}
        className="w-full mb-4 bg-[#2D4531] text-[#EDEDDD] hover:bg-[#2D4531] border border-[#EDEDDD]"
      >
        {isLoading ? "Generating..." : "Generate Ice Breakers"}
      </Button>
    </div>
  );
};