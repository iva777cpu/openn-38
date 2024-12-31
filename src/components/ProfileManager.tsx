import React, { useState, useEffect } from "react";
import { SavedProfiles } from "./SavedProfiles";
import { SavedIcebreakers } from "./SavedIcebreakers";
import { ProfileContent } from "./profile/ProfileContent";
import { useIcebreakers } from "@/hooks/useIcebreakers";

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
  const [isFirstTime, setIsFirstTime] = useState(false);
  const { setIcebreakers } = useIcebreakers();

  const handleIcebreakersUpdate = (icebreakers: string[]) => {
    console.log('Updating icebreakers in ProfileManager:', icebreakers);
    setPersistedIcebreakers(icebreakers);
  };

  // Clear icebreakers when profile changes, creating new profile, or showing forms
  useEffect(() => {
    console.log('Profile changed or new profile created, clearing icebreakers');
    setPersistedIcebreakers([]);
    setIcebreakers([]); // Clear icebreakers in the global state
    setIsFirstTime(false);
  }, [currentProfile, setIcebreakers]);

  // Reset scroll position when showing forms
  useEffect(() => {
    if (!showProfiles && !showSavedIcebreakers) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      console.log("Reset scroll position");
    }
  }, [showProfiles, showSavedIcebreakers]);

  if (showProfiles) {
    return (
      <SavedProfiles 
        onSelectProfile={(profile) => {
          handleSelectProfile(profile);
          setShowProfiles(false);
        }}
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
    <ProfileContent
      currentProfile={currentProfile}
      saveDialogOpen={saveDialogOpen}
      setSaveDialogOpen={setSaveDialogOpen}
      selectedProfileId={selectedProfileId}
      handleUpdateProfile={handleUpdateProfile}
      handleSaveChanges={handleSaveChanges}
      onSaveProfile={onSaveProfile}
      hasChanges={hasChanges}
      selectedProfileName={selectedProfileName}
      isFirstTime={isFirstTime}
      setIsFirstTime={setIsFirstTime}
      persistedIcebreakers={persistedIcebreakers}
      handleIcebreakersUpdate={handleIcebreakersUpdate}
    />
  );
};