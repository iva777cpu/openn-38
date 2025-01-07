import React from "react";
import { Button } from "../ui/button";
import { BookmarkPlus } from "lucide-react";

interface IcebreakerListProps {
  icebreakers: string[];
  savedIcebreakers: Set<string>;
  onToggleSave: (icebreaker: string) => void;
}

export const IcebreakerList: React.FC<IcebreakerListProps> = ({
  icebreakers,
  savedIcebreakers,
  onToggleSave,
}) => {
  if (icebreakers.length === 0) return null;

  return (
    <div className="space-y-2">
      {icebreakers.map((icebreaker, index) => (
        <div key={index} className="p-4 bg-[#47624B] dark:bg-[#2D4531] rounded-md flex justify-between items-start border border-[#E5D4BC]">
          <span className="text-[15px] text-[#E5D4BC]">{icebreaker}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleSave(icebreaker)}
            className="ml-2 hover:bg-[#1A2A1D] transition-all"
          >
            <BookmarkPlus 
              className={`h-4 w-4 ${
                savedIcebreakers.has(icebreaker) 
                  ? 'fill-[#E5D4BC] stroke-[#E5D4BC]' 
                  : 'stroke-[#E5D4BC]'
              }`}
            />
          </Button>
        </div>
      ))}
    </div>
  );
};