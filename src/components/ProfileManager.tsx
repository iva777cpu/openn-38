import React, { useState, useEffect } from "react";
import { ProfileForm } from "./ProfileForm";
import { SaveProfileDialog } from "./SaveProfileDialog";
import { SavedProfiles } from "./SavedProfiles";
import { SavedIcebreakers } from "./SavedIcebreakers";
import { ProfileHeader } from "./ProfileHeader";

interface ProfileManagerProps {
  currentProfile: Record<string, string>;
  saveDialogOpen: boolean;
  setSaveDialogOpen: (open: boolean) => void;
  showProfiles: boolean;
  showSavedIcebreakers: boolean;
  selectedProfileId: string | null;
  handleUpdateProfile: (field: string, value: string) => void;
  handleSelectProfile: (profile: any) => void;
  handleSaveChanges: () => void;
  setShowProfiles: (show: boolean) => void;
  setShowSavedIcebreakers: (show: boolean) => void;
  onSaveProfile: () => void;
  hasChanges?: boolean;
  selectedProfileName?: string;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  currentProfile,
  saveDialogOpen,
  setSaveDialogOpen,
  showProfiles,
  showSavedIcebreakers,
  selectedProfileId,
  handleUpdateProfile,
  handleSelectProfile,
  handleSaveChanges,
  setShowProfiles,
  setShowSavedIcebreakers,
  onSaveProfile,
  hasChanges,
  selectedProfileName,
}) => {
  const [persistedIcebreakers, setPersistedIcebreakers] = useState<string[]>([]);

  useEffect(() => {
    // Load persisted form data on component mount
    const savedFormData = localStorage.getItem('currentFormData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      Object.entries(parsedData).forEach(([field, value]) => {
        handleUpdateProfile(field, value as string);
      });
    }
  }, []);

  useEffect(() => {
    // Save form data whenever it changes
    localStorage.setItem('currentFormData', JSON.stringify(currentProfile));
  }, [currentProfile]);

  const handleIcebreakersUpdate = (icebreakers: string[]) => {
    setPersistedIcebreakers(icebreakers);
    localStorage.setItem('persistedIcebreakers', JSON.stringify(icebreakers));
  };

  if (showProfiles) {
    return (
      <SavedProfiles 
        onSelectProfile={handleSelectProfile} 
        onBack={() => setShowProfiles(false)}
      />
    );
  }

  if (showSavedIcebreakers) {
    return (
      <SavedIcebreakers 
        onBack={() => setShowSavedIcebreakers(false)}
      />
    );
  }

  return (
    <>
      <ProfileHeader
        onSaveProfile={onSaveProfile}
        selectedProfileId={selectedProfileId}
        onSaveChanges={handleSaveChanges}
        profileName={selectedProfileName}
        hasChanges={hasChanges}
      />
      <div className="text-xs text-[#47624B] dark:text-[#EDEDDD] text-left mb-4">
        Share as much or as little as you'd like
      </div>
      <ProfileForm 
        userProfile={currentProfile} 
        onUpdate={handleUpdateProfile}
        persistedIcebreakers={persistedIcebreakers}
        onIcebreakersUpdate={handleIcebreakersUpdate}
      />
      <SaveProfileDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        profileData={currentProfile}
      />
    </>
  );
};