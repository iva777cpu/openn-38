import React from "react";
import { FormSection } from "./forms/FormSection";
import { ProfileFormSections } from "./forms/ProfileFormSections";
import { IcebreakerSection } from "./forms/IcebreakerSection";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormProps {
  userProfile: Record<string, string>;
  onUpdate: (field: string, value: string) => void;
  persistedIcebreakers: string[];
  onIcebreakersUpdate: (icebreakers: string[]) => void;
  isFirstTime: boolean;
  checkAuth: (action: () => void) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ 
  userProfile, 
  onUpdate,
  onIcebreakersUpdate,
  isFirstTime,
  persistedIcebreakers,
  checkAuth
}) => {
  const navigate = useNavigate();

  return (
    <section className="w-full space-y-3">
      <ProfileFormSections 
        userProfile={userProfile}
        onUpdate={onUpdate}
        checkAuth={checkAuth}
      />

      <FormSection title="Ice Breakers">
        <IcebreakerSection 
          userProfile={userProfile}
          onIcebreakersUpdate={onIcebreakersUpdate}
          isFirstTime={isFirstTime}
          checkAuth={checkAuth}
        />
      </FormSection>
    </section>
  );
};