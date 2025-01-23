import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { toast } from "sonner";
import { ProfileManager } from "@/components/ProfileManager";
import { SideMenu } from "@/components/SideMenu";
import { SavedIcebreakers } from "@/components/SavedIcebreakers";
import { SavedProfiles } from "@/components/SavedProfiles";

interface IndexProps {
  onDeleteAccount: () => Promise<void>;
}

export default function Index({ onDeleteAccount }: IndexProps) {
  const navigate = useNavigate();
  useAuthCheck();
  
  const [showProfiles, setShowProfiles] = useState(false);
  const [showSavedIcebreakers, setShowSavedIcebreakers] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if the API call fails, we want to clear local state
      localStorage.clear();
    } finally {
      // Always navigate to login page
      navigate("/login");
    }
  };

  const handleNewProfile = () => {
    setShowProfiles(false);
    setShowSavedIcebreakers(false);
  };

  const handleSaveProfile = () => {
    setShowProfiles(true);
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
        <SavedProfiles onClose={() => setShowProfiles(false)} />
      ) : showSavedIcebreakers ? (
        <SavedIcebreakers onClose={() => setShowSavedIcebreakers(false)} />
      ) : (
        <ProfileManager />
      )}
    </div>
  );
}