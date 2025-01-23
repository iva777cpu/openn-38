import React from "react";
import { ProfileRouting } from "./profile/ProfileRouting";
import { ProfileStateManager } from "./profile/ProfileStateManager";
import { useIcebreakersState } from "./profile/useIcebreakersState";

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
  checkAuth: (action: () => void) => Promise<void>;
}

export const ProfileManager: React.FC<ProfileManagerProps> = (props) => {
  const {
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
    checkAuth,
  } = props;

  const {
    persistedIcebreakers,
    handleIcebreakersUpdate,
    clearIcebreakers,
  } = useIcebreakersState(currentProfile);

  // Wrap handleSelectProfile to clear icebreakers when switching profiles
  const handleProfileSelect = (profile: any) => {
    clearIcebreakers(); // Clear icebreakers before switching profiles
    handleSelectProfile(profile);
  };

  const contentProps = {
    currentProfile,
    saveDialogOpen,
    setSaveDialogOpen,
    selectedProfileId,
    handleUpdateProfile,
    handleSaveChanges,
    onSaveProfile,
    hasChanges,
    selectedProfileName,
    checkAuth,
  };

  return (
    <ProfileStateManager
      currentProfile={currentProfile}
      showProfiles={showProfiles}
      showSavedIcebreakers={showSavedIcebreakers}
    >
      <ProfileRouting
        showProfiles={showProfiles}
        showSavedIcebreakers={showSavedIcebreakers}
        setShowProfiles={setShowProfiles}
        setShowSavedIcebreakers={setShowSavedIcebreakers}
        handleSelectProfile={handleProfileSelect}
        contentProps={contentProps}
        persistedIcebreakers={persistedIcebreakers}
        handleIcebreakersUpdate={handleIcebreakersUpdate}
        clearIcebreakers={clearIcebreakers}
        checkAuth={checkAuth}
      />
    </ProfileStateManager>
  );
};