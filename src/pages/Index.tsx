import React, { useState, useEffect } from "react";
import { SideMenu } from "@/components/SideMenu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ProfileManager } from "@/components/ProfileManager";

const emptyProfile = {
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
  const [currentProfile, setCurrentProfile] = useState(emptyProfile);
  const [originalProfile, setOriginalProfile] = useState(emptyProfile);
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const hasChanges = JSON.stringify(currentProfile) !== JSON.stringify(originalProfile);

  const handleUpdateProfile = (field: string, value: string) => {
    setCurrentProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewProfile = () => {
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
    setSaveDialogOpen(true);
    setMenuOpen(false);
  };

  const handleViewSavedMessages = () => {
    setShowSavedIcebreakers(true);
    setShowProfiles(false);
    setMenuOpen(false);
  };

  const handleSelectProfile = (profile: any) => {
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
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
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