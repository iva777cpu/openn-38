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
}) => {
  return (
    <main className="container mx-auto px-4 pt-8 pb-8">
      {showProfiles ? (
        <SavedProfiles 
          onSelectProfile={handleSelectProfile} 
          onBack={() => setShowProfiles(false)}
        />
      ) : showSavedIcebreakers ? (
        <SavedIcebreakers 
          onBack={() => setShowSavedIcebreakers(false)}
        />
      ) : (
        <>
          <ProfileHeader
            onSaveProfile={onSaveProfile}
            selectedProfileId={selectedProfileId}
            onSaveChanges={handleSaveChanges}
          />
          <ProfileForm userProfile={currentProfile} onUpdate={handleUpdateProfile} />
        </>
      )}
      <SaveProfileDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        profileData={currentProfile}
      />
    </main>
  );
};