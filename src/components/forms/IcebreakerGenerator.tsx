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
    getAnonGenerations,
    setAnonGenerations,
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
        if (remainingGenerations <= 0) {
          toast.error("You've reached your daily generation limit!", {
            duration: 3000,
          });
          return;
        }
        await updateGenerationCount.mutateAsync();
      } else {
        const anonCount = getAnonGenerations();
        if (anonCount >= 1) {
          checkAuth(() => {});
          return;
        }
        setAnonGenerations(anonCount + 1);
      }
      
      await generateIcebreakers();
    };

    if (isAuthenticated) {
      await handleGenerateAction();
    } else {
      const anonCount = getAnonGenerations();
      if (anonCount >= 1) {
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