import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, Plus, Save, MessageCircle, Users, LogOut } from "lucide-react";

interface SideMenuProps {
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewSavedMessages: () => void;
  onViewProfiles: () => void;
  onLogout: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  onNewProfile,
  onSaveProfile,
  onViewSavedMessages,
  onViewProfiles,
  onLogout,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="fixed top-4 right-4 p-2 text-[#EDEDDD] hover:bg-[#2D4531]"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-[#2D4531] border-[#1A2A1D]">
        <div className="space-y-4 mt-8">
          <Button
            variant="ghost"
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#1A2A1D]"
            onClick={onNewProfile}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#1A2A1D]"
            onClick={onSaveProfile}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#1A2A1D]"
            onClick={onViewProfiles}
          >
            <Users className="mr-2 h-4 w-4" />
            Profiles
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#1A2A1D]"
            onClick={onViewSavedMessages}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Saved Messages
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#1A2A1D]"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};