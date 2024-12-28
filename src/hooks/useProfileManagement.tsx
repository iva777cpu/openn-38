import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileState, emptyProfile } from "@/types/profile";

export const useProfileManagement = () => {
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
    console.log("Creating new profile");
    setCurrentProfile(emptyProfile);
    setOriginalProfile(emptyProfile);
    setSelectedProfileId(null);
    setSelectedProfileName("");
  };

  const handleSelectProfile = (profile: any) => {
    console.log("Selecting profile:", profile.id);
    const profileData: ProfileState = {
      userAge: profile.user_age || "",
      userGender: profile.user_gender || "",
      impression: profile.user_impression || "",
      targetAge: profile.target_age || "",
      targetGender: profile.target_gender || "",
      targetPersonality: profile.target_personality || "",
      mood: profile.target_mood || "",
      origin: profile.target_origin || "",
      loves: profile.target_loves || "",
      dislikes: profile.target_dislikes || "",
      hobbies: profile.target_hobbies || "",
      books: profile.target_books || "",
      music: profile.target_music || "",
      humor: profile.target_humor || "",
      zodiac: profile.target_zodiac || "",
      mbti: profile.target_mbti || "",
      style: profile.target_style || "",
      situation: profile.situation || "",
      previousTopics: profile.previous_topics || "",
    };
    setCurrentProfile(profileData);
    setOriginalProfile(profileData);
    setSelectedProfileId(profile.id);
    setSelectedProfileName(profile.profile_name);
  };

  const handleSaveChanges = async () => {
    if (!selectedProfileId) return;

    try {
      console.log("Saving profile changes for ID:", selectedProfileId);
      const { error } = await supabase
        .from("user_profiles")
        .update({
          user_age: currentProfile.userAge,
          user_gender: currentProfile.userGender,
          user_impression: currentProfile.impression,
          target_age: currentProfile.targetAge,
          target_gender: currentProfile.targetGender,
          target_personality: currentProfile.targetPersonality,
          target_mood: currentProfile.mood,
          target_origin: currentProfile.origin,
          target_loves: currentProfile.loves,
          target_dislikes: currentProfile.dislikes,
          target_hobbies: currentProfile.hobbies,
          target_books: currentProfile.books,
          target_music: currentProfile.music,
          target_humor: currentProfile.humor,
          target_zodiac: currentProfile.zodiac,
          target_mbti: currentProfile.mbti,
          target_style: currentProfile.style,
          situation: currentProfile.situation,
          previous_topics: currentProfile.previousTopics,
        })
        .eq("id", selectedProfileId);

      if (error) throw error;

      setOriginalProfile(currentProfile);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const hasChanges = JSON.stringify(currentProfile) !== JSON.stringify(originalProfile);

  return {
    currentProfile,
    selectedProfileId,
    selectedProfileName,
    hasChanges,
    handleUpdateProfile,
    handleNewProfile,
    handleSelectProfile,
    handleSaveChanges,
  };
};