import { useState } from "react";
import { ProfileState, emptyProfile } from "@/types/profile";

export const useProfileState = () => {
  const [currentProfile, setCurrentProfile] = useState<ProfileState>(emptyProfile);
  const [originalProfile, setOriginalProfile] = useState<ProfileState>(emptyProfile);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedProfileName, setSelectedProfileName] = useState<string>("");

  const handleUpdateProfile = (field: string, value: string) => {
    console.log(`Updating profile field: ${field} with value: ${value}`);
    setCurrentProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewProfile = () => {
    console.log("Creating new profile - clearing all state");
    setCurrentProfile(emptyProfile);
    setOriginalProfile(emptyProfile);
    setSelectedProfileId(null);
    setSelectedProfileName("");
  };

  return {
    currentProfile,
    originalProfile,
    selectedProfileId,
    selectedProfileName,
    setCurrentProfile,
    setOriginalProfile,
    setSelectedProfileId,
    setSelectedProfileName,
    handleUpdateProfile,
    handleNewProfile,
  };
};