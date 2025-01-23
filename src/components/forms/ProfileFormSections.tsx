import React from "react";
import { FormSection } from "./FormSection";
import { UserTraitsForm } from "./UserTraitsForm";
import { TargetTraitsForm } from "./TargetTraitsForm";
import { GeneralInfoForm } from "./GeneralInfoForm";

interface ProfileFormSectionsProps {
  userProfile: Record<string, string>;
  onUpdate: (field: string, value: string) => void;
}

export const ProfileFormSections = ({ userProfile, onUpdate }: ProfileFormSectionsProps) => {
  return (
    <>
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
    </>
  );
};