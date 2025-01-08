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
  } = props;

  const {
    persistedIcebreakers,
    isFirstTime,
    setIsFirstTime,
    handleIcebreakersUpdate,
    clearIcebreakers,
  } = useIcebreakersState(currentProfile);

  // Reset isFirstTime when selecting a new profile
  React.useEffect(() => {
    if (currentProfile.isFirstTime !== undefined) {
      console.log('Setting isFirstTime from profile:', currentProfile.isFirstTime);
      setIsFirstTime(currentProfile.isFirstTime === 'true');
    }
  }, [currentProfile, setIsFirstTime]);

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
        handleSelectProfile={handleSelectProfile}
        contentProps={contentProps}
        isFirstTime={isFirstTime}
        setIsFirstTime={setIsFirstTime}
        persistedIcebreakers={persistedIcebreakers}
        handleIcebreakersUpdate={handleIcebreakersUpdate}
        clearIcebreakers={clearIcebreakers}
      />
    </ProfileStateManager>
  );
};