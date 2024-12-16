import React, { useState, useEffect } from "react";
import { ProfileForm } from "@/components/ProfileForm";
import { SideMenu } from "@/components/SideMenu";
import { SaveProfileDialog } from "@/components/SaveProfileDialog";
import { SavedProfiles } from "@/components/SavedProfiles";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

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
    setMenuOpen(false);
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
    setSelectedProfileId(profile.id);
    setShowProfiles(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedProfileId) return;

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
          user_age: currentProfile.userAge,
          user_gender: currentProfile.userGender,
          target_age: currentProfile.targetAge,
          target_gender: currentProfile.targetGender,
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
          setMenuOpen(false);
        }}
        onLogout={handleLogout}
        open={menuOpen}
        onOpenChange={setMenuOpen}
      />
      <main className="container mx-auto pt-16 pb-8">
        {showProfiles ? (
          <SavedProfiles 
            onSelectProfile={handleSelectProfile} 
            onBack={() => setShowProfiles(false)}
          />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-8 text-[#EDEDDD]">Openera</h1>
            <ProfileForm userProfile={currentProfile} onUpdate={handleUpdateProfile} />
            {selectedProfileId && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleSaveChanges}
                  className="bg-[#2D4531] text-[#EDEDDD] hover:bg-[#1A2A1D]"
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