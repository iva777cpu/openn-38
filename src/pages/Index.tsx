import React, { useState, useEffect } from "react";
import { ProfileForm } from "@/components/ProfileForm";
import { SideMenu } from "@/components/SideMenu";
import { SaveProfileDialog } from "@/components/SaveProfileDialog";
import { SavedProfiles } from "@/components/SavedProfiles";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const emptyProfile = {
  userAge: "",
  userGender: "",
  targetAge: "",
  targetGender: "",
};

const Index = () => {
  const [currentProfile, setCurrentProfile] = useState(emptyProfile);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
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
    toast({
      title: "New Profile Created",
      description: "Start filling out the form for your new profile.",
    });
  };

  const handleSaveProfile = () => {
    setSaveDialogOpen(true);
  };

  const handleViewSavedMessages = () => {
    toast({
      title: "Coming Soon",
      description: "Saved messages feature will be available soon.",
    });
  };

  const handleSelectProfile = (profile: any) => {
    setCurrentProfile({
      userAge: profile.user_age || "",
      userGender: profile.user_gender || "",
      targetAge: profile.target_age || "",
      targetGender: profile.target_gender || "",
    });
    setShowProfiles(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
        onViewProfiles={() => setShowProfiles(true)}
        onLogout={handleLogout}
      />
      <main className="container mx-auto pt-16 pb-8">
        <h1 className="text-2xl font-bold text-center mb-8">Openera</h1>
        {showProfiles ? (
          <SavedProfiles onSelectProfile={handleSelectProfile} />
        ) : (
          <ProfileForm userProfile={currentProfile} onUpdate={handleUpdateProfile} />
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