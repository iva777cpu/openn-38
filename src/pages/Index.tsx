import React, { useState, useEffect } from "react";
import { SideMenu } from "@/components/SideMenu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ProfileManager } from "@/components/ProfileManager";

// Move profile state interface to a separate types file later if it grows
interface ProfileState {
  userAge: string;
  userGender: string;
  impression: string;
  targetAge: string;
  targetGender: string;
  targetPersonality: string;
  mood: string;
  origin: string;
  loves: string;
  dislikes: string;
  hobbies: string;
  books: string;
  music: string;
  humor: string;
  zodiac: string;
  mbti: string;
  style: string;
  situation: string;
  previousTopics: string;
}

const emptyProfile: ProfileState = {
  userAge: "",
  userGender: "",
  impression: "",
  targetAge: "",
  targetGender: "",
  targetPersonality: "",
  mood: "",
  origin: "",
  loves: "",
  dislikes: "",
  hobbies: "",
  books: "",
  music: "",
  humor: "",
  zodiac: "",
  mbti: "",
  style: "",
  situation: "",
  previousTopics: "",
};

const Index = () => {
  const [currentProfile, setCurrentProfile] = useState<ProfileState>(emptyProfile);
  const [originalProfile, setOriginalProfile] = useState<ProfileState>(emptyProfile);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [showSavedIcebreakers, setShowSavedIcebreakers] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedProfileName, setSelectedProfileName] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          throw error;
        }

        if (!session) {
          console.log("No active session, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("Authentication successful");
      } catch (error) {
        console.error("Failed to check auth status:", error);
        toast({
          title: "Error",
          description: "Failed to verify authentication status",
          variant: "destructive",
        });
        navigate("/login");
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const hasChanges = JSON.stringify(currentProfile) !== JSON.stringify(originalProfile);

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
    setShowProfiles(false);
    setShowSavedIcebreakers(false);
    setSelectedProfileId(null);
    setSelectedProfileName("");
    setMenuOpen(false);
    toast({
      title: "New Profile Created",
      description: "Start filling out the form for your new profile.",
    });
  };

  const handleSaveProfile = () => {
    console.log("Opening save profile dialog");
    setSaveDialogOpen(true);
    setMenuOpen(false);
  };

  const handleViewSavedMessages = () => {
    console.log("Viewing saved messages");
    setShowSavedIcebreakers(true);
    setShowProfiles(false);
    setMenuOpen(false);
  };

  const handleSelectProfile = (profile: any) => {
    console.log("Selecting profile:", profile.id);
    const profileData = {
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
    setShowProfiles(false);
    setShowSavedIcebreakers(false);
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
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await supabase.auth.signOut();
      setMenuOpen(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#303D24]">
      <SideMenu
        onNewProfile={handleNewProfile}
        onSaveProfile={handleSaveProfile}
        onViewSavedMessages={handleViewSavedMessages}
        onViewProfiles={() => {
          setShowProfiles(true);
          setShowSavedIcebreakers(false);
          setMenuOpen(false);
        }}
        onLogout={handleLogout}
        open={menuOpen}
        onOpenChange={setMenuOpen}
      />
      <ProfileManager
        currentProfile={currentProfile}
        saveDialogOpen={saveDialogOpen}
        setSaveDialogOpen={setSaveDialogOpen}
        showProfiles={showProfiles}
        showSavedIcebreakers={showSavedIcebreakers}
        selectedProfileId={selectedProfileId}
        handleUpdateProfile={handleUpdateProfile}
        handleSelectProfile={handleSelectProfile}
        handleSaveChanges={handleSaveChanges}
        setShowProfiles={setShowProfiles}
        setShowSavedIcebreakers={setShowSavedIcebreakers}
        onSaveProfile={handleSaveProfile}
        hasChanges={hasChanges}
        selectedProfileName={selectedProfileName}
      />
    </div>
  );
};

export default Index;