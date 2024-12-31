import React from "react";
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
  const { savedIcebreakers, icebreakers, setIcebreakers, toggleIcebreaker } = useIcebreakers();

  const handleIcebreakersGenerated = (newIcebreakers: string[]) => {
    setIcebreakers(newIcebreakers);
    onIcebreakersUpdate(newIcebreakers);
  };

  return (
    <section className="content-section space-y-4">
      <Card className="p-4 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD]">
        <h2 className="text-lg font-semibold mb-4">About You</h2>
        <UserTraitsForm userProfile={userProfile} onUpdate={onUpdate} />
      </Card>

      <Card className="p-4 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD]">
        <h2 className="text-lg font-semibold mb-4">About Them</h2>
        <TargetTraitsForm userProfile={userProfile} onUpdate={onUpdate} />
      </Card>

      <Card className="p-4 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD]">
        <h2 className="text-lg font-semibold mb-4">General Information</h2>
        <GeneralInfoForm userProfile={userProfile} onUpdate={onUpdate} />
      </Card>

      <Card className="p-4 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD]">
        <h2 className="text-lg font-semibold mb-4">Ice Breakers</h2>
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