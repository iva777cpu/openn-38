import React from "react";
import { SavedIcebreakers } from "../SavedIcebreakers";
import { SavedProfiles } from "../SavedProfiles";
import { ProfileContent } from "./ProfileContent";
import { ProfileStateExtendedProps } from "./ProfileStateManager";

interface ProfileRoutingProps extends ProfileStateExtendedProps {
  showProfiles: boolean;
  showSavedIcebreakers: boolean;
  setShowProfiles: (show: boolean) => void;
  setShowSavedIcebreakers: (show: boolean) => void;
  handleSelectProfile: (profile: any) => void;
  contentProps: {
    currentProfile: Record<string, string>;
    saveDialogOpen: boolean;
    setSaveDialogOpen: (open: boolean) => void;
    selectedProfileId: string | null;
    handleUpdateProfile: (field: string, value: string) => void;
    handleSaveChanges: () => void;
    onSaveProfile: () => void;
    hasChanges?: boolean;
    selectedProfileName?: string;
  };
}

export const ProfileRouting: React.FC<ProfileRoutingProps> = ({
  showProfiles,
  showSavedIcebreakers,
  setShowProfiles,
  setShowSavedIcebreakers,
  handleSelectProfile,
  contentProps,
  isFirstTime,
  setIsFirstTime,
  persistedIcebreakers,
  handleIcebreakersUpdate,
  clearIcebreakers,
}) => {
  if (showProfiles) {
    return (
      <SavedProfiles
        onSelectProfile={handleSelectProfile}
        setShowProfiles={setShowProfiles}
      />
    );
  }

  if (showSavedIcebreakers) {
    return <SavedIcebreakers setShowSavedIcebreakers={setShowSavedIcebreakers} />;
  }

  return (
    <ProfileContent
      {...contentProps}
      isFirstTime={isFirstTime}
      setIsFirstTime={setIsFirstTime}
      persistedIcebreakers={persistedIcebreakers}
      handleIcebreakersUpdate={handleIcebreakersUpdate}
    />
  );
};