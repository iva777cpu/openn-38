import { useState } from "react";
import { SideMenu } from "@/components/SideMenu";
import { SavedIcebreakers } from "@/components/SavedIcebreakers";
import { SavedProfiles } from "@/components/SavedProfiles";
import { ProfileManager } from "@/components/ProfileManager";
import { useProfileManagement } from "@/hooks/useProfileManagement";
import { supabase } from "@/integrations/supabase/client";
import { AuthDialog } from "@/components/AuthDialog";

interface MainLayoutProps {
  onDeleteAccount: () => Promise<void>;
  onSignOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const MainLayout = ({ onDeleteAccount, onSignOut, isAuthenticated }: MainLayoutProps) => {
  const [showProfiles, setShowProfiles] = useState(false);
  const [showSavedIcebreakers, setShowSavedIcebreakers] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

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

  const checkAuth = async (action: () => void) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setPendingAction(() => action);
      setShowAuthDialog(true);
      return;
    }
    action();
  };

  const handleNewProfile = () => {
    handleNewProfileFromHook();
    setShowProfiles(false);
    setShowSavedIcebreakers(false);
  };

  const handleViewSection = (section: 'profiles' | 'icebreakers') => {
    if (section === 'profiles') {
      setShowSavedIcebreakers(false);
      setShowProfiles(true);
    } else {
      setShowProfiles(false);
      setShowSavedIcebreakers(true);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative">
      <SideMenu
        onNewProfile={handleNewProfile}
        onSaveProfile={() => checkAuth(() => setSaveDialogOpen(true))}
        onViewSavedMessages={() => handleViewSection('icebreakers')}
        onViewProfiles={() => handleViewSection('profiles')}
        onLogout={onSignOut}
        onDeleteAccount={onDeleteAccount}
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        isAuthenticated={isAuthenticated}
      />

      {showProfiles ? (
        <SavedProfiles 
          onBack={() => setShowProfiles(false)}
          onSelectProfile={(profile) => {
            handleSelectProfile(profile);
            setShowProfiles(false);
          }}
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
          onSaveProfile={() => checkAuth(() => setSaveDialogOpen(true))}
          hasChanges={hasChanges}
          selectedProfileName={selectedProfileName}
          checkAuth={checkAuth}
        />
      )}

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={(open) => {
          setShowAuthDialog(open);
          if (!open) setPendingAction(null);
        }} 
      />
    </div>
  );
};