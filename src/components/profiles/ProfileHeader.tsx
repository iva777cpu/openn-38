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
          className="text-[#1A2A1D] dark:text-[#EDEDDD] hover:bg-[#2D4531] mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-[#1A2A1D] dark:text-[#EDEDDD]">Profiles</h1>
      </header>

      {selectedCount > 0 && onDeleteSelected && (
        <Button
          onClick={onDeleteSelected}
          className="delete-selected-button"
        >
          Delete Selected ({selectedCount})
        </Button>
      )}
    </>
  );
};