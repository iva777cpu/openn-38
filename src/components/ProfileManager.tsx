import React, { useEffect } from "react";
import { ProfileRouting } from "./profile/ProfileRouting";
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
  const {
    persistedIcebreakers,
    isFirstTime,
    setIsFirstTime,
    handleIcebreakersUpdate,
    clearIcebreakers,
  } = useIcebreakersState(currentProfile);

  // Reset scroll position when showing forms
  useEffect(() => {
    if (!showProfiles && !showSavedIcebreakers) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [showProfiles, showSavedIcebreakers]);

  // Save form data to localStorage
  useEffect(() => {
    if (currentProfile && Object.keys(currentProfile).length > 0) {
      localStorage.setItem('currentProfile', JSON.stringify(currentProfile));
    }
  }, [currentProfile]);

  // Save icebreakers to localStorage
  useEffect(() => {
    if (persistedIcebreakers.length > 0) {
      localStorage.setItem('currentIcebreakers', JSON.stringify(persistedIcebreakers));
    }
  }, [persistedIcebreakers]);

  // Clear data only when explicitly requested (new profile or loading existing)
  useEffect(() => {
    if (selectedProfileId === null && Object.keys(currentProfile).length === 0) {
      localStorage.removeItem('currentProfile');
      localStorage.removeItem('currentIcebreakers');
      clearIcebreakers();
    }
  }, [selectedProfileId, currentProfile, clearIcebreakers]);

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
    isFirstTime,
    setIsFirstTime,
    persistedIcebreakers,
    handleIcebreakersUpdate,
  };

  return (
    <ProfileRouting
      showProfiles={showProfiles}
      showSavedIcebreakers={showSavedIcebreakers}
      setShowProfiles={setShowProfiles}
      setShowSavedIcebreakers={setShowSavedIcebreakers}
      handleSelectProfile={handleSelectProfile}
      contentProps={contentProps}
    />
  );
};