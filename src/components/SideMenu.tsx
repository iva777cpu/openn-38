import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, Plus, Save, BookmarkPlus, Users, LogOut, Sun, Moon } from "lucide-react";

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
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-[#EDEDDD] hover:bg-[#2D4531] dark:text-[#EDEDDD]"
        >
          {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="p-2 text-[#EDEDDD] hover:bg-[#2D4531] dark:text-[#EDEDDD]"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent className="bg-[#2D4531] border-[#1A2A1D] dark:bg-[#2D4531]">
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
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Saved Icebreakers
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