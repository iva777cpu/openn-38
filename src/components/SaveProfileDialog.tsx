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
      <DialogContent className="bg-[#E5D4BC] dark:bg-[#2D4531] text-[#1A2A1D] dark:text-[#E5D4BC] border-[#1A2A1D]">
        <DialogHeader>
          <DialogTitle>Save Profile</DialogTitle>
          <DialogDescription className="text-[#1A2A1D] dark:text-[#E5D4BC] opacity-90">
            Enter a name for this profile
          </DialogDescription>
        </DialogHeader>

        <SaveProfileForm
          profileName={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />

        <DialogFooter>
          <Button
            onClick={handleSaveProfile}
            disabled={!profileName}
            className="bg-[#1A2A1D] text-[#E5D4BC] hover:bg-[#2D4531] w-full sm:w-auto"
          >
            Save Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};