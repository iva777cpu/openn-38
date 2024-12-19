import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ProfileHeaderProps {
  onSaveProfile: () => void;
  selectedProfileId: string | null;
  onSaveChanges: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onSaveProfile,
  selectedProfileId,
  onSaveChanges,
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-center text-[#EDEDDD]">Openera</h1>
      {selectedProfileId && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={onSaveChanges}
            className="bg-[#EDEDDD] text-[#1A2A1D] hover:bg-[#2D4531] hover:text-[#EDEDDD]"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};