import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

interface ProfileHeaderProps {
  selectedCount: number;
  onBack: () => void;
  onDeleteSelected?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  selectedCount,
  onBack,
  onDeleteSelected,
}) => {
  return (
    <>
      <header className="flex items-center mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-[#303D24] dark:text-[#EDEDDD] hover:bg-[#2D4531] mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-[18px] font-bold text-[#303D24] dark:text-[#EDEDDD]">Profiles</h1>
      </header>

      {selectedCount > 0 && onDeleteSelected && (
        <div className="flex mb-4">
          <Button
            onClick={onDeleteSelected}
            className="bg-[#47624B] text-[#EDEDDD] hover:bg-[#2D4531] text-xs py-1 h-7 px-2"
          >
            Delete Selected ({selectedCount})
          </Button>
        </div>
      )}
    </>
  );
};