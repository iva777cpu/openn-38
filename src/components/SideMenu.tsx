import React from "react";
import { MenuContainer } from "./menu/MenuContainer";

interface SideMenuProps {
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewSavedMessages: () => void;
  onViewProfiles: () => void;
  onLogout: () => void;
  onDeleteAccount: () => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated: boolean;
}

export const SideMenu: React.FC<SideMenuProps> = (props) => {
  return <MenuContainer {...props} />;
};