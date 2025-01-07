import React from "react";
import { FormSection } from "./forms/FormSection";
import { UserTraitsForm } from "./forms/UserTraitsForm";
import { TargetTraitsForm } from "./forms/TargetTraitsForm";
import { GeneralInfoForm } from "./forms/GeneralInfoForm";
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
  isFirstTime
}) => {
  return (
    <section className="w-full space-y-3">
      <FormSection title="About You">
        <UserTraitsForm 
          userProfile={userProfile} 
          onUpdate={onUpdate}
          includeRelationship={true}
        />
      </FormSection>

      <FormSection title="About Them">
        <TargetTraitsForm userProfile={userProfile} onUpdate={onUpdate} />
      </FormSection>

      <FormSection title="General Information">
        <GeneralInfoForm userProfile={userProfile} onUpdate={onUpdate} />
      </FormSection>

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