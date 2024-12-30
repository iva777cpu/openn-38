import React from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { MenuButton } from "./menu/MenuButton";
import { MenuContent } from "./menu/MenuContent";

interface SideMenuProps {
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewSavedMessages: () => void;
  onViewProfiles: () => void;
  onLogout: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  onNewProfile,
  onSaveProfile,
  onViewSavedMessages,
  onViewProfiles,
  onLogout,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <MenuButton />
      <DialogContent className="bg-[#EDEDDD] dark:bg-[#2D4531] text-[#2D4531] dark:text-[#EDEDDD] border-[#2D4531] dark:border-[#EDEDDD] p-0">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <MenuContent
          onNewProfile={onNewProfile}
          onSaveProfile={onSaveProfile}
          onViewSavedMessages={onViewSavedMessages}
          onViewProfiles={onViewProfiles}
          onLogout={onLogout}
        />
      </DialogContent>
    </Dialog>
  );
};