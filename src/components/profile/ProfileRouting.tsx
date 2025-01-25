import React from "react";
import { SavedIcebreakers } from "../SavedIcebreakers";
import { SavedProfiles } from "../SavedProfiles";
import { ProfileContent } from "./ProfileContent";

interface ProfileRoutingProps {
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
    checkAuth: (action: () => void) => Promise<void>;
  };
  persistedIcebreakers: string[];
  handleIcebreakersUpdate: (icebreakers: string[]) => void;
  clearIcebreakers: () => void;
  checkAuth: (action: () => void) => Promise<void>;
  onNewProfile: () => void;
}

export const ProfileRouting: React.FC<ProfileRoutingProps> = ({
  showProfiles,
  showSavedIcebreakers,
  setShowProfiles,
  setShowSavedIcebreakers,
  handleSelectProfile,
  contentProps,
  persistedIcebreakers,
  handleIcebreakersUpdate,
  clearIcebreakers,
  checkAuth,
  onNewProfile,
}) => {
  if (showProfiles) {
    return (
      <SavedProfiles
        onSelectProfile={(profile) => {
          handleSelectProfile(profile);
          setShowProfiles(false);
        }}
        onBack={() => setShowProfiles(false)}
        onNewProfile={onNewProfile}
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
      {...contentProps}
      persistedIcebreakers={persistedIcebreakers}
      handleIcebreakersUpdate={handleIcebreakersUpdate}
    />
  );
};