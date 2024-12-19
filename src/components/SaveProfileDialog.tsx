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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SaveProfileForm } from "./SaveProfileForm";

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
  const { toast } = useToast();

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

  const handleSaveProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save profiles",
          variant: "destructive",
        });
        return;
      }

      // Get a unique name for the profile
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

      toast({
        title: "Success",
        description: "Profile saved successfully",
      });
      onOpenChange(false);
      setProfileName("");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2D4531] text-[#EDEDDD] border-[#1A2A1D]">
        <DialogHeader>
          <DialogTitle>Save Profile</DialogTitle>
          <DialogDescription className="text-[#EDEDDD] opacity-90">
            Enter a name for this profile.
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
            className="bg-[#303D24] text-[#EDEDDD] hover:bg-[#1A2A1D]"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};