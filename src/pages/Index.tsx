import React, { useState } from "react";
import { SideMenu } from "@/components/SideMenu";
import { supabase } from "@/integrations/supabase/client";
import { ProfileManager } from "@/components/ProfileManager";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useProfileManagement } from "@/hooks/useProfileManagement";

const Index = () => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const [showSavedIcebreakers, setShowSavedIcebreakers] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    currentProfile,
    selectedProfileId,
    selectedProfileName,
    hasChanges,
    handleUpdateProfile,
    handleNewProfile,
    handleSelectProfile,
    handleSaveChanges,
  } = useProfileManagement();

  useAuthCheck();

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

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await supabase.auth.signOut();
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNewProfile = () => {
    setShowProfiles(false);
    setShowSavedIcebreakers(false);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#EDEDDD] dark:bg-[#303D24] text-[#2D4531] dark:text-[#EDEDDD]">
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
