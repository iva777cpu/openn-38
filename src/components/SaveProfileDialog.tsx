import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { SaveProfileForm } from "./SaveProfileForm";
import { useProfileSaving } from "@/hooks/useProfileSaving";

interface SaveProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: Record<string, string>;
}

export const SaveProfileDialog: React.FC<SaveProfileDialogProps> = ({
  open,
  onOpenChange,
  profileData,
}) => {
  const [profileName, setProfileName] = useState("");
  const { saveProfile } = useProfileSaving();

  const handleSaveProfile = async () => {
    const success = await saveProfile(profileName, profileData);
    if (success) {
      onOpenChange(false);
      setProfileName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#EDEDDD] dark:bg-[#2D4531] text-[#1A2A1D] dark:text-[#EDEDDD] border-[#1A2A1D]">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle className="text-[#1A2A1D] dark:text-[#EDEDDD]">Save Profile</DialogTitle>
          <DialogDescription className="text-[#1A2A1D] dark:text-[#EDEDDD] opacity-90">
            Enter a name for this profile.
          </DialogDescription>
        </DialogHeader>
        <SaveProfileForm
          profileName={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />
        <DialogFooter className="sm:justify-center">
          <Button
            onClick={handleSaveProfile}
            disabled={!profileName}
            className="bg-[#1A2A1D] text-[#EDEDDD] hover:bg-[#2D4531]"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};