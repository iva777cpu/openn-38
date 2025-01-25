import { useState, useEffect } from "react";
import { ProfileState, emptyProfile } from "@/types/profile";
import { useIcebreakers } from "./useIcebreakers";

export const useProfileState = () => {
  const [currentProfile, setCurrentProfile] = useState<ProfileState>(() => {
    const savedProfile = localStorage.getItem('currentProfile');
    return savedProfile ? JSON.parse(savedProfile) : emptyProfile;
  });
  
  const [originalProfile, setOriginalProfile] = useState<ProfileState>(emptyProfile);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedProfileName, setSelectedProfileName] = useState<string>("");
  const { clearAllIcebreakers } = useIcebreakers();

  const handleUpdateProfile = (field: string, value: string) => {
    console.log(`Updating profile field: ${field} with value: ${value}`);
    setCurrentProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewProfile = () => {
    console.log("Creating new profile - clearing all state");
    localStorage.removeItem('currentProfile');
    localStorage.removeItem('currentIcebreakers');
    setCurrentProfile(emptyProfile);
    setOriginalProfile(emptyProfile);
    setSelectedProfileId(null);
    setSelectedProfileName("");
    clearAllIcebreakers();
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