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
                temperature: isFirstTime ? Math.min(question.temperature + 0.2, 1) : question.temperature
              }
            };
          }
          return acc;
        }, {});

      const systemPrompt = isFirstTime 
        ? "You are a witty and creative conversation starter. Generate unique, amusing, and slightly flirty first-time ice breakers that are memorable and fun. Be creative and playful, but keep it tasteful."
        : "You are a charming and witty conversation expert. Generate unique, clever, and engaging ice breakers with a touch of humor. Make them memorable and interesting.";

      const { data, error } = await supabase.functions.invoke('generate-icebreaker', {
        body: { 
          answers: filledFields,
          isFirstTime,
          systemPrompt,
          temperature: isFirstTime ? 0.9 : 0.7
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