import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { toast } from "sonner";
import { ProfileManager } from "@/components/ProfileManager";
import { SideMenu } from "@/components/SideMenu";
import { SavedIcebreakers } from "@/components/SavedIcebreakers";
import { SavedProfiles } from "@/components/SavedProfiles";
import { useProfileManagement } from "@/hooks/useProfileManagement";

interface IndexProps {
  onDeleteAccount: () => Promise<void>;
}

export default function Index({ onDeleteAccount }: IndexProps) {
  const navigate = useNavigate();
  useAuthCheck();
  
  const [showProfiles, setShowProfiles] = useState(false);
  const [showSavedIcebreakers, setShowSavedIcebreakers] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const {
    currentProfile,
    selectedProfileId,
    selectedProfileName,
    hasChanges,
    handleUpdateProfile,
    handleNewProfile: handleNewProfileFromHook,
    handleSelectProfile,
    handleSaveChanges,
  } = useProfileManagement();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and redirect regardless of API success
      localStorage.clear();
      navigate("/login");
    }
  };

  const handleNewProfile = () => {
    handleNewProfileFromHook();
    setShowProfiles(false);
    setShowSavedIcebreakers(false);
  };

  const handleSaveProfile = () => {
    setSaveDialogOpen(true);
    setShowProfiles(false);
    setShowSavedIcebreakers(false);
  };

  const handleViewSavedMessages = () => {
    setShowProfiles(false);
    setShowSavedIcebreakers(true);
  };

  const handleViewProfiles = () => {
    setShowProfiles(true);
    setShowSavedIcebreakers(false);
  };

  return (
    <div className="min-h-screen relative">
      <SideMenu
        onNewProfile={handleNewProfile}
        onSaveProfile={handleSaveProfile}
        onViewSavedMessages={handleViewSavedMessages}
        onViewProfiles={handleViewProfiles}
        onLogout={handleLogout}
        onDeleteAccount={onDeleteAccount}
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
      />

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
      )}
    </div>
  );
}