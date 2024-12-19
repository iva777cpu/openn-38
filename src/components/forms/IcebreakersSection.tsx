import React from "react";
import { Button } from "../ui/button";
import { BookmarkPlus } from "lucide-react";

interface IcebreakersSectionProps {
  icebreakers: string[];
  onSave: (icebreaker: string) => void;
}

export const IcebreakersSection: React.FC<IcebreakersSectionProps> = ({ icebreakers, onSave }) => {
  return (
    <div className="space-y-4">
      {icebreakers.map((icebreaker, index) => (
        <div key={index} className="p-4 bg-[#2D4531] rounded-md flex justify-between items-start">
          <span>{icebreaker}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSave(icebreaker)}
            className="ml-2 text-[#EDEDDD] hover:bg-[#1A2A1D]"
          >
            <BookmarkPlus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};