import React, { useState, useEffect, useRef } from "react";
import { ProfileForm } from "./ProfileForm";
import { SaveProfileDialog } from "./SaveProfileDialog";
import { SavedProfiles } from "./SavedProfiles";
import { SavedIcebreakers } from "./SavedIcebreakers";
import { ProfileHeader } from "./ProfileHeader";
import { Checkbox } from "./ui/checkbox";

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
  const formRef = useRef<HTMLDivElement>(null);

  const handleIcebreakersUpdate = (icebreakers: string[]) => {
    console.log('Updating icebreakers in ProfileManager:', icebreakers);
    setPersistedIcebreakers(icebreakers);
  };

  // Clear icebreakers when profile changes
  useEffect(() => {
    console.log('Profile changed, clearing icebreakers');
    setPersistedIcebreakers([]);
  }, [currentProfile]);

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
    <div className="w-full pt-6 px-4" ref={formRef}>
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
      <div className="flex items-center space-x-2 mb-4 justify-start w-full">
        <Checkbox 
          id="firstTime" 
          checked={isFirstTime}
          onCheckedChange={(checked) => {
            console.log('First time checkbox changed:', checked);
            setIsFirstTime(checked as boolean);
          }}
          className="first-time-checkbox"
        />
        <label 
          htmlFor="firstTime"
          className="text-[15px] font-semibold text-[#47624B] dark:text-[#EDEDDD]"
        >
          First time approaching this person?
        </label>
      </div>
      <ProfileForm 
        userProfile={currentProfile} 
        onUpdate={handleUpdateProfile}
        persistedIcebreakers={persistedIcebreakers}
        onIcebreakersUpdate={handleIcebreakersUpdate}
        isFirstTime={isFirstTime}
      />
      <div className="text-xs text-[#47624B] dark:text-[#EDEDDD] mt-6 text-left">
        hey its Edda, the developer :D I&apos;d really appreciate your thoughts on the app :3<br />
        (pls give my app a good rating :D :3 )<br />
        I&apos;ll be updating the app to improve it and add the extra features that I have in mind.<br />
        my email in case you want to reach me: Novatica78@gmail.com
      </div>
      <SaveProfileDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        profileData={currentProfile}
      />
    </div>
  );
};