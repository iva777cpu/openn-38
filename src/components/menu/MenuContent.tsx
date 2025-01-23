import { Button } from "@/components/ui/button";
import { Plus, Save, Users, BookmarkPlus, LogOut, Sun, Moon } from "lucide-react";

interface MenuContentProps {
  isDarkMode: boolean;
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewProfiles: () => void;
  onViewSavedMessages: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const MenuContent = ({
  isDarkMode,
  onNewProfile,
  onSaveProfile,
  onViewProfiles,
  onViewSavedMessages,
  onToggleTheme,
  onLogout,
}: MenuContentProps) => (
  <div className="space-y-4 mt-8">
    <Button
      variant="ghost"
      className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
      onClick={onNewProfile}
    >
      <Plus className="mr-2 h-4 w-4" />
      New Profile
    </Button>
    <Button
      variant="ghost"
      className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
      onClick={onSaveProfile}
    >
      <Save className="mr-2 h-4 w-4" />
      Save Profile
    </Button>
    <Button
      variant="ghost"
      className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
      onClick={onViewProfiles}
    >
      <Users className="mr-2 h-4 w-4" />
      Profiles
    </Button>
    <Button
      variant="ghost"
      className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
      onClick={onViewSavedMessages}
    >
      <BookmarkPlus className="mr-2 h-4 w-4" />
      Saved Icebreakers
    </Button>
    <Button
      variant="ghost"
      className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
      onClick={onToggleTheme}
    >
      {isDarkMode ? (
        <>
          <Sun className="mr-2 h-4 w-4" />
          Light Mode
        </>
      ) : (
        <>
          <Moon className="mr-2 h-4 w-4" />
          Dark Mode
        </>
      )}
    </Button>
    <Button
      variant="ghost"
      className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
      onClick={onLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  </div>
);