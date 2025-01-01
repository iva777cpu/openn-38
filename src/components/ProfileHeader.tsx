import React from "react";
import { Button } from "./ui/button";
import { Save } from "lucide-react";

interface ProfileHeaderProps {
  onSaveProfile: () => void;
  selectedProfileId: string | null;
  onSaveChanges: () => void;
  profileName?: string;
  hasChanges?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onSaveProfile,
  selectedProfileId,
  onSaveChanges,
  profileName,
  hasChanges,
}) => {
  return (
    <header className="flex items-center justify-between w-full mb-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold text-[#47624B] dark:text-[#EDEDDD]">
          {selectedProfileId ? profileName : "New Profile"}
        </h1>
        {hasChanges && (
          <span className="text-xs text-[#47624B] dark:text-[#EDEDDD]">
            (unsaved changes)
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {selectedProfileId ? (
          hasChanges && (
            <Button
              onClick={onSaveChanges}
              className="bg-[#47624B] text-[#EDEDDD] hover:bg-[#2D4531] px-2 py-1 rounded-md text-xs h-auto flex items-center gap-1"
            >
              <Save className="h-3 w-3" />
              <span>Save Changes</span>
            </Button>
          )
        ) : (
          <Button
            onClick={onSaveProfile}
            className="bg-[#47624B] text-[#EDEDDD] hover:bg-[#2D4531] px-2 py-1 rounded-md text-xs h-auto flex items-center gap-1"
          >
            <Save className="h-3 w-3" />
            <span>Save Profile</span>
          </Button>
        )}
      </div>
    </header>
  );
};