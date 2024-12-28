import React, { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { questions } from "@/utils/questions";

interface IcebreakerGeneratorProps {
  userProfile: Record<string, string>;
  onIcebreakersGenerated: (icebreakers: string[]) => void;
}

export const IcebreakerGenerator: React.FC<IcebreakerGeneratorProps> = ({
  userProfile,
  onIcebreakersGenerated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

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
                temperature: question.temperature
              }
            };
          }
          return acc;
        }, {});

      const { data, error } = await supabase.functions.invoke('generate-icebreaker', {
        body: { 
          answers: filledFields,
          isFirstTime,
          temperature: 0.9
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
      <div className="flex items-center space-x-2 mb-4 justify-start">
        <Checkbox 
          id="firstTime" 
          checked={isFirstTime}
          onCheckedChange={(checked) => setIsFirstTime(checked as boolean)}
          className="bg-[#47624B] text-[#EDEDDD] border-[#47624B] data-[state=checked]:bg-[#47624B] data-[state=checked]:text-[#EDEDDD]"
        />
        <label 
          htmlFor="firstTime"
          className="text-[#47624B] dark:text-[#EDEDDD] text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          First time approaching this person?
        </label>
      </div>
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