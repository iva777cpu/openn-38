import React, { useState } from "react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { questions } from "@/utils/questions";

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

      const systemPrompt = isFirstTime 
        ? "You are a witty and creative conversation starter. Generate unique, amusing, and playfully flirty first-time ice breakers that are memorable and fun. Consider the target's personality traits, interests, and the situation when crafting responses. Be creative and playful, avoiding clichés. Feel free to tease or make light-hearted jokes about their dislikes. Match your tone to their sense of humor when possible. Mix between casual questions (0.5), fun facts (0.8), light-hearted statements (0.5), and friendly banter (0.8). Keep responses under 30 words. Return exactly 3 numbered ice breakers. No introductory text or emojis."
        : "You are a charming and witty conversation expert. Generate unique, clever, and engaging ice breakers with personality. Consider all provided information about both people and the situation. Make responses interesting and fun, with playful teasing when appropriate. Avoid being cheesy or cliché. Reference previous topics naturally and adapt to their humor style. Mix formats and tones appropriately. Keep responses under 30 words. Return exactly 3 numbered ice breakers. No introductory text or emojis.";

      const { data, error } = await supabase.functions.invoke('generate-icebreaker', {
        body: { 
          answers: filledFields,
          isFirstTime,
          systemPrompt,
          temperature: isFirstTime ? 0.9 : 0.5
        }
      });

      if (error) throw error;
      
      const newIcebreakers = data.icebreakers.split(/\d+\./).filter(Boolean).map((text: string) => text.trim());
      onIcebreakersGenerated(newIcebreakers);
      localStorage.setItem('persistedIcebreakers', JSON.stringify(newIcebreakers));
    } catch (error) {
      console.error('Error generating icebreakers:', error);
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