import React from "react";
import { Button } from "../ui/button";
import { useIcebreakerGeneration } from "@/hooks/useIcebreakerGeneration";

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
  const { isLoading, generateIcebreakers } = useIcebreakerGeneration(
    userProfile,
    isFirstTime,
    onIcebreakersGenerated
  );

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