import React from "react";
import { Button } from "../ui/button";
import { useIcebreakerGeneration } from "@/hooks/useIcebreakerGeneration";
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
  const { isLoading, generateIcebreakers } = useIcebreakerGeneration(
    userProfile,
    isFirstTime,
    onIcebreakersGenerated
  );

  const handleGenerate = async () => {
    if (Object.values(userProfile).every(value => !value)) {
      toast.error("hey! fill in some information first! xD", {
        duration: 3000,
      });
      return;
    }
    await generateIcebreakers();
  };

  return (
    <div>
      <Button 
        onClick={handleGenerate} 
        disabled={isLoading}
        className="w-full mb-4 bg-[#2D4531] text-[#EDEDDD] hover:bg-[#2D4531] border border-[#EDEDDD]"
      >
        {isLoading ? (
          <span className="flex items-center">
            Generating
            <span className="loading-dots ml-1 text-[8px]">...</span>
          </span>
        ) : (
          "Generate Ice Breakers"
        )}
      </Button>
    </div>
  );
};