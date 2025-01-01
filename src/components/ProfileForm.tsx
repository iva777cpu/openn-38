import React, { useEffect } from "react";
import { Card } from "./ui/card";
import { UserTraitsForm } from "./forms/UserTraitsForm";
import { TargetTraitsForm } from "./forms/TargetTraitsForm";
import { GeneralInfoForm } from "./forms/GeneralInfoForm";
import { IcebreakerGenerator } from "./forms/IcebreakerGenerator";
import { IcebreakerList } from "./icebreakers/IcebreakerList";
import { useIcebreakers } from "@/hooks/useIcebreakers";

interface ProfileFormProps {
  userProfile: Record<string, string>;
  onUpdate: (field: string, value: string) => void;
  persistedIcebreakers: string[];
  onIcebreakersUpdate: (icebreakers: string[]) => void;
  isFirstTime: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  userProfile, 
  onUpdate,
  onIcebreakersUpdate,
  persistedIcebreakers,
  isFirstTime
}) => {
  const { savedIcebreakers, icebreakers, setIcebreakers, clearAllIcebreakers, toggleIcebreaker } = useIcebreakers();

  // Clear icebreakers when userProfile changes or is empty
  useEffect(() => {
    console.log("ProfileForm: userProfile changed", userProfile);
    if (Object.keys(userProfile).length === 0) {
      console.log("ProfileForm: Clearing icebreakers due to empty profile");
      clearAllIcebreakers();
      setIcebreakers([]);
    } else if (persistedIcebreakers.length > 0) {
      console.log("ProfileForm: Setting persisted icebreakers", persistedIcebreakers);
      setIcebreakers(persistedIcebreakers);
    }
  }, [userProfile, persistedIcebreakers, clearAllIcebreakers, setIcebreakers]);

  const handleIcebreakersGenerated = (newIcebreakers: string[]) => {
    console.log("ProfileForm: New icebreakers generated", newIcebreakers);
    setIcebreakers(newIcebreakers);
    onIcebreakersUpdate(newIcebreakers);
  };

  return (
    <section className="w-full space-y-3">
      <Card className="w-full p-3 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD]">
        <h2 className="text-lg font-semibold mb-3">About You</h2>
        <UserTraitsForm userProfile={userProfile} onUpdate={onUpdate} />
      </Card>

      <Card className="w-full p-3 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD]">
        <h2 className="text-lg font-semibold mb-3">About Them</h2>
        <TargetTraitsForm userProfile={userProfile} onUpdate={onUpdate} />
      </Card>

      <Card className="w-full p-3 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD]">
        <h2 className="text-lg font-semibold mb-3">General Information</h2>
        <GeneralInfoForm userProfile={userProfile} onUpdate={onUpdate} />
      </Card>

      <Card className="w-full p-3 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD]">
        <h2 className="text-lg font-semibold mb-3">Ice Breakers</h2>
        <IcebreakerGenerator 
          userProfile={userProfile}
          onIcebreakersGenerated={handleIcebreakersGenerated}
          isFirstTime={isFirstTime}
        />
        <IcebreakerList 
          icebreakers={icebreakers}
          savedIcebreakers={savedIcebreakers}
          onToggleSave={toggleIcebreaker}
        />
      </Card>
    </section>
  );
};