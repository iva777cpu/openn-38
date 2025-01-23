import React from "react";
import { FormSection } from "./forms/FormSection";
import { ProfileFormSections } from "./forms/ProfileFormSections";
import { IcebreakerSection } from "./forms/IcebreakerSection";

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
  isFirstTime,
  persistedIcebreakers
}) => {
  return (
    <section className="w-full space-y-3">
      <ProfileFormSections 
        userProfile={userProfile}
        onUpdate={onUpdate}
      />

      <FormSection title="Ice Breakers">
        <IcebreakerSection 
          userProfile={userProfile}
          onIcebreakersUpdate={onIcebreakersUpdate}
          isFirstTime={isFirstTime}
        />
      </FormSection>
    </section>
  );
};