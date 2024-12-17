import React, { useState, useEffect } from "react";
import { ProfileForm } from "@/components/ProfileForm";
import { SideMenu } from "@/components/SideMenu";
import { SaveProfileDialog } from "@/components/SaveProfileDialog";
import { SavedProfiles } from "@/components/SavedProfiles";
import { SavedIcebreakers } from "@/components/SavedIcebreakers";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

const emptyProfile = {
  userAge: "",
  userGender: "",
  impression: "",
  targetAge: "",
  targetGender: "",
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
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [showSavedIcebreakers, setShowSavedIcebreakers] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
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

  const handleUpdateProfile = (field: string, value: string) => {
    setCurrentProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewProfile = () => {
    setCurrentProfile(emptyProfile);
    setShowProfiles(false);
    setShowSavedIcebreakers(false);
    setSelectedProfileId(null);
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
    setCurrentProfile({
      userAge: profile.user_age || "",
      userGender: profile.user_gender || "",
      impression: profile.user_impression || "",
      targetAge: profile.target_age || "",
      targetGender: profile.target_gender || "",
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
    });
    setSelectedProfileId(profile.id);
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
    <div className="min-h-screen bg-[#303D24] text-[#EDEDDD]">
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
      <main className="container mx-auto px-4 pt-8 pb-8">
        {showProfiles ? (
          <SavedProfiles 
            onSelectProfile={handleSelectProfile} 
            onBack={() => setShowProfiles(false)}
          />
        ) : showSavedIcebreakers ? (
          <SavedIcebreakers 
            onBack={() => setShowSavedIcebreakers(false)}
          />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-8 text-[#EDEDDD]">Openera</h1>
            <ProfileForm userProfile={currentProfile} onUpdate={handleUpdateProfile} />
            {selectedProfileId && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleSaveChanges}
                  className="w-full max-w-md bg-[#EDEDDD] text-[#1A2A1D] hover:bg-[#2D4531] hover:text-[#EDEDDD]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <SaveProfileDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        profileData={currentProfile}
      />
    </div>
  );
};

export default Index;