import React from "react";
import { IcebreakerGenerator } from "./IcebreakerGenerator";
import { IcebreakerList } from "../icebreakers/IcebreakerList";
import { useIcebreakers } from "@/hooks/useIcebreakers";

interface IcebreakerSectionProps {
  userProfile: Record<string, string>;
  onIcebreakersUpdate: (icebreakers: string[]) => void;
  isFirstTime: boolean;
  checkAuth: (action: () => void) => Promise<void>;
}

export const IcebreakerSection: React.FC<IcebreakerSectionProps> = ({
  userProfile,
  onIcebreakersUpdate,
  isFirstTime,
  checkAuth,
}) => {
  const { savedIcebreakers, icebreakers, setIcebreakers, toggleIcebreaker } = useIcebreakers();

  const handleIcebreakersGenerated = (newIcebreakers: string[]) => {
    console.log("IcebreakerSection: New icebreakers generated", newIcebreakers);
    setIcebreakers(newIcebreakers);
    onIcebreakersUpdate(newIcebreakers);
  };

  return (
    <>
      <IcebreakerGenerator 
        userProfile={userProfile}
        onIcebreakersGenerated={handleIcebreakersGenerated}
        isFirstTime={isFirstTime}
      />
      <IcebreakerList 
        icebreakers={icebreakers}
        savedIcebreakers={savedIcebreakers}
        onToggleSave={(icebreaker) => checkAuth(() => toggleIcebreaker(icebreaker))}
      />
    </>
  );
};