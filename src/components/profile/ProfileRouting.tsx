import React from "react";
import { SavedProfiles } from "../SavedProfiles";
import { SavedIcebreakers } from "../SavedIcebreakers";
import { ProfileContent } from "./ProfileContent";

interface ProfileRoutingProps {
  showProfiles: boolean;
  showSavedIcebreakers: boolean;
  setShowProfiles: (show: boolean) => void;
  setShowSavedIcebreakers: (show: boolean) => void;
  handleSelectProfile: (profile: any) => void;
  contentProps: any; // We'll type this properly in the next iteration
}

export const ProfileRouting: React.FC<ProfileRoutingProps> = ({
  showProfiles,
  showSavedIcebreakers,
  setShowProfiles,
  setShowSavedIcebreakers,
  handleSelectProfile,
  contentProps,
}) => {
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

  return <ProfileContent {...contentProps} />;
};