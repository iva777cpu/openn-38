import React from "react";
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
      <div className="text-right mb-4">
        <span className="text-xs text-[#47624B] dark:text-[#EDEDDD]">
          Share as much or as little as you'd like
        </span>
      </div>
      <ProfileForm userProfile={currentProfile} onUpdate={handleUpdateProfile} />
      <SaveProfileDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        profileData={currentProfile}
      />
    </>
  );
};