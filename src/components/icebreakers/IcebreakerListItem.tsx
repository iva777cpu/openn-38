import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { BookmarkIcon } from "lucide-react";

interface SavedMessage {
  id: string;
  message_text: string;
  created_at: string;
  is_edited: boolean;
  user_id: string;
}

interface IcebreakerListItemProps {
  message: SavedMessage;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
}

export const IcebreakerListItem: React.FC<IcebreakerListItemProps> = ({
  message,
  isSelected,
  onToggleSelection,
}) => {
  return (
    <Card
      className={`p-4 cursor-pointer transition-colors ${
        isSelected
          ? "bg-[#47624B] text-[#E5D4BC]"
          : "bg-[#E5D4BC] text-[#1B4233] hover:bg-[#D4C3AB]"
      }`}
      onClick={() => onToggleSelection(message.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="flex-1">{message.message_text}</p>
        <Button
          variant="ghost"
          size="icon"
          className={`shrink-0 ${
            isSelected
              ? "text-[#E5D4BC] hover:text-[#E5D4BC]"
              : "text-[#1B4233] hover:text-[#1B4233]"
          }`}
        >
          <BookmarkIcon className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};