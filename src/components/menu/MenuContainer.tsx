import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { MenuButton } from "./MenuButton";
import { MenuContent } from "./MenuContent";
import { useThemePreference } from "@/hooks/useThemePreference";

interface MenuContainerProps {
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewSavedMessages: () => void;
  onViewProfiles: () => void;
  onLogout: () => void;
  onDeleteAccount: () => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MenuContainer: React.FC<MenuContainerProps> = ({
  onNewProfile,
  onSaveProfile,
  onViewSavedMessages,
  onViewProfiles,
  onLogout,
  onDeleteAccount,
  open,
  onOpenChange,
}) => {
  const { isDarkMode, toggleTheme } = useThemePreference();

  const handleNewProfile = () => {
    onNewProfile();
    onOpenChange(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <div className="absolute top-4 right-4">
        <SheetTrigger asChild>
          <MenuButton onClick={() => {}} />
        </SheetTrigger>
      </div>
      <SheetContent className="bg-[#47624B] dark:bg-[#2D4531] border-[#1A2A1D]">
        <MenuContent
          isDarkMode={isDarkMode}
          onNewProfile={handleNewProfile}
          onSaveProfile={() => {
            onSaveProfile();
            onOpenChange(false);
          }}
          onViewProfiles={() => {
            onViewProfiles();
            onOpenChange(false);
          }}
          onViewSavedMessages={() => {
            onViewSavedMessages();
            onOpenChange(false);
          }}
          onToggleTheme={toggleTheme}
          onLogout={() => {
            onLogout();
            onOpenChange(false);
          }}
          onDeleteAccount={onDeleteAccount}
        />
      </SheetContent>
    </Sheet>
  );
};