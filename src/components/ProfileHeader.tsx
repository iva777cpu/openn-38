import React from "react";
import { Button } from "@/components/ui/button";
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
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#EDEDDD]">Openera</h1>
      </div>
      <div className="flex justify-between items-center">
        {profileName && (
          <h2 className="text-lg text-[#EDEDDD] font-medium">
            {profileName}
          </h2>
        )}
        {selectedProfileId && hasChanges && (
          <Button
            onClick={onSaveChanges}
            className="bg-[#EDEDDD] text-[#1A2A1D] hover:bg-[#2D4531] hover:text-[#EDEDDD] px-3 py-1.5 h-auto"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
};