import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SideMenu } from "@/components/SideMenu";
import { SavedIcebreakers } from "@/components/SavedIcebreakers";
import { SavedProfiles } from "@/components/SavedProfiles";
import { ProfileManager } from "@/components/ProfileManager";
import { useProfileManagement } from "@/hooks/useProfileManagement";

interface MainLayoutProps {
  onDeleteAccount: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export const MainLayout = ({ onDeleteAccount, onSignOut }: MainLayoutProps) => {
  const navigate = useNavigate();
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
    await onSignOut();
    navigate("/login");
  };

  const handleNewProfile = () => {
    handleNewProfileFromHook();
    setShowProfiles(false);
    setShowSavedIcebreakers(false);
  };

  return (
    <div className="min-h-screen relative">
      <SideMenu
        onNewProfile={handleNewProfile}
        onSaveProfile={() => setSaveDialogOpen(true)}
        onViewSavedMessages={() => setShowSavedIcebreakers(true)}
        onViewProfiles={() => setShowProfiles(true)}
        onLogout={handleLogout}
        onDeleteAccount={onDeleteAccount}
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
      />

      {showProfiles ? (
        <SavedProfiles 
          onBack={() => setShowProfiles(false)}
          onSelectProfile={handleSelectProfile}
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
          onSaveProfile={() => setSaveDialogOpen(true)}
          hasChanges={hasChanges}
          selectedProfileName={selectedProfileName}
        />
      )}
    </div>
  );
};