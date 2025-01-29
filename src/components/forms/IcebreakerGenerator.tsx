import React from "react";
import { toast } from "sonner";
import { useIcebreakerGeneration } from "@/hooks/useIcebreakerGeneration";
import { useGenerationCount } from "@/hooks/useGenerationCount";
import { GenerateButton } from "../icebreakers/GenerateButton";

interface IcebreakerGeneratorProps {
  userProfile: Record<string, string>;
  onIcebreakersGenerated: (icebreakers: string[]) => void;
  isFirstTime: boolean;
  checkAuth: (action: () => void) => Promise<void>;
  isAuthenticated: boolean;
}

export const IcebreakerGenerator: React.FC<IcebreakerGeneratorProps> = ({
  userProfile,
  onIcebreakersGenerated,
  isFirstTime,
  checkAuth,
  isAuthenticated,
}) => {
  const { isLoading, generateIcebreakers } = useIcebreakerGeneration(
    userProfile,
    isFirstTime,
    onIcebreakersGenerated
  );

  const {
    remainingGenerations,
    formattedResetTime,
    updateGenerationCount,
  } = useGenerationCount(isAuthenticated);

  const handleGenerate = async () => {
    if (Object.values(userProfile).every(value => !value)) {
      toast.error("hey! fill in some information first! xD", {
        duration: 3000,
      });
      return;
    }

    const handleGenerateAction = async () => {
      if (isAuthenticated) {
        if (remainingGenerations >= 6) {
          toast.error("You've reached your daily generation limit!", {
            duration: 3000,
          });
          return;
        }
      } else {
        if (remainingGenerations >= 1) {
          checkAuth(() => {});
          return;
        }
      }
      
      try {
        await updateGenerationCount.mutateAsync();
        const result = await generateIcebreakers();
        
        if (result?.error) {
          toast.error(result.error, {
            duration: 5000,
          });
          return;
        }
        
      } catch (error) {
        // Error is already handled in updateGenerationCount
        return;
      }
    };

    if (isAuthenticated) {
      await handleGenerateAction();
    } else {
      const currentGenerations = remainingGenerations;
      if (currentGenerations >= 1) {
        checkAuth(handleGenerateAction);
      } else {
        await handleGenerateAction();
      }
    }
  };

  return (
    <GenerateButton
      isLoading={isLoading}
      isAuthenticated={isAuthenticated}
      remainingGenerations={remainingGenerations}
      formattedResetTime={formattedResetTime}
      onClick={handleGenerate}
    />
  );
};