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
      
      if (Object.keys(filledFields).length === 0) {
        toast.error('hey! fill in some information first! xD');
        setIsLoading(false);
        return;
      }

      const systemPrompt = `You are a charming conversation expert. Generate engaging ice breakers that are clever, charming, witty and fun.
Mix formats between different types of icebreakers with equal probability, such as:
- Teasing or banter (if appropriate)
- Playful questions that invite storytelling
- Interesting observations or compliments
- Shared experiences or hypotheticals
- Fun facts or statements
- other things...
dont generate too many questions
No introductory text or emojis.
Keep each icebreaker under 25 words. If referencing specific content (books, mythology, celebrities, etc), add brief explanation (max 15 words) in parentheses. so each of your responses can be a total of 40.
Return exactly 3 numbered responses.
${isFirstTime ? 'Keep responses approachable for first-time interaction.' : 'Build on existing rapport.'}`

      console.log('System prompt:', systemPrompt);

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
      toast.success('Generated new icebreakers!');

    } catch (error) {
      console.error('Error generating icebreakers:', error);
      toast.error('Failed to generate icebreakers. Please try again later.');
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