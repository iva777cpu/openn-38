import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useProfileSaving = () => {
  const getUniqueProfileName = async (userId: string, baseName: string) => {
    let finalName = baseName;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const { data } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", userId)
        .eq("profile_name", finalName)
        .maybeSingle();

      if (!data) {
        isUnique = true;
      } else {
        finalName = `${baseName}_${counter}`;
        counter++;
      }
    }

    return finalName;
  };

  const saveProfile = async (profileName: string, profileData: Record<string, string>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to save profiles");
      }

      const uniqueName = await getUniqueProfileName(user.id, profileName);
      console.log("Generated unique profile name:", uniqueName);

      const { error } = await supabase.from("user_profiles").insert({
        user_id: user.id,
        profile_name: uniqueName,
        user_age: profileData.userAge,
        user_gender: profileData.userGender,
        user_impression: profileData.impression,
        target_age: profileData.targetAge,
        target_gender: profileData.targetGender,
        target_personality: profileData.targetPersonality,
        target_mood: profileData.mood,
        target_origin: profileData.origin,
        target_loves: profileData.loves,
        target_dislikes: profileData.dislikes,
        target_hobbies: profileData.hobbies,
        target_books: profileData.books,
        target_music: profileData.music,
        target_humor: profileData.humor,
        target_zodiac: profileData.zodiac,
        target_mbti: profileData.mbti,
        target_style: profileData.style,
        situation: profileData.situation,
        previous_topics: profileData.previousTopics,
      });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error saving profile:", error);
      return false;
    }
  };

  return { saveProfile };
};