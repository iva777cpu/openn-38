import React, { useEffect } from "react";
import { FormSection } from "./forms/FormSection";
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
  const { savedIcebreakers, icebreakers, setIcebreakers, toggleIcebreaker, clearAllIcebreakers } = useIcebreakers();

  // Clear icebreakers on mount and when profile changes
  useEffect(() => {
    clearAllIcebreakers();
    setIcebreakers([]);
  }, [userProfile, clearAllIcebreakers, setIcebreakers]);

  const handleIcebreakersGenerated = (newIcebreakers: string[]) => {
    console.log("ProfileForm: New icebreakers generated", newIcebreakers);
    setIcebreakers(newIcebreakers);
    onIcebreakersUpdate(newIcebreakers);
  };

  return (
    <section className="w-full space-y-3">
      <FormSection title="About You">
        <UserTraitsForm 
          userProfile={userProfile} 
          onUpdate={onUpdate}
          includeRelationship={true} // Add this prop
        />
      </FormSection>

      <FormSection title="About Them">
        <TargetTraitsForm userProfile={userProfile} onUpdate={onUpdate} />
      </FormSection>

      <FormSection title="General Information">
        <GeneralInfoForm userProfile={userProfile} onUpdate={onUpdate} />
      </FormSection>

      <FormSection title="Ice Breakers">
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
      </FormSection>
    </section>
  );
};