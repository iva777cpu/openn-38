import { Button } from "@/components/ui/button";
import { Plus, Save, Users, BookmarkPlus } from "lucide-react";

interface MenuActionsProps {
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewProfiles: () => void;
  onViewSavedMessages: () => void;
}

export const MenuActions = ({
  onNewProfile,
  onSaveProfile,
  onViewProfiles,
  onViewSavedMessages,
}: MenuActionsProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};