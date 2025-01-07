import React from "react";
import { ProfileForm } from "../ProfileForm";
import { SaveProfileDialog } from "../SaveProfileDialog";
import { Checkbox } from "../ui/checkbox";
import { ProfileHeader } from "../ProfileHeader";

interface ProfileContentProps {
  currentProfile: Record<string, string>;
  saveDialogOpen: boolean;
  setSaveDialogOpen: (open: boolean) => void;
  selectedProfileId: string | null;
  handleUpdateProfile: (field: string, value: string) => void;
  handleSaveChanges: () => void;
  onSaveProfile: () => void;
  hasChanges?: boolean;
  selectedProfileName?: string;
  isFirstTime: boolean;
  setIsFirstTime: (value: boolean) => void;
  persistedIcebreakers: string[];
  handleIcebreakersUpdate: (icebreakers: string[]) => void;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({
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
}) => {
  return (
    <div className="w-full pt-6 px-4">
      <ProfileHeader
        onSaveProfile={onSaveProfile}
        selectedProfileId={selectedProfileId}
        onSaveChanges={handleSaveChanges}
        profileName={selectedProfileName}
        hasChanges={hasChanges}
      />
      <div className="text-xs text-[#47624B] dark:text-[#E5D4BC] text-left mb-4">
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
          className="text-[15px] font-semibold text-[#47624B] dark:text-[#E5D4BC]"
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
      <div className="text-xs text-[#47624B] dark:text-[#E5D4BC] mt-6 text-left">
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