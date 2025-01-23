import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

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
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSelection(message.id);
  };

  return (
    <Card
      className={`p-4 cursor-pointer transition-colors ${
        isSelected
          ? "bg-[#47624B] text-[#E5D4BC]"
          : "bg-[#47624B] dark:bg-[#2D4531] text-[#E5D4BC] hover:bg-[#3d5941] dark:hover:bg-[#3d5941]"
      }`}
    >
      <div className="flex items-start gap-2">
        <div onClick={handleCheckboxClick} className="cursor-pointer">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(message.id)}
            className="first-time-checkbox mt-1"
          />
        </div>
        <p className="flex-1" onClick={() => onToggleSelection(message.id)}>{message.message_text}</p>
      </div>
    </Card>
  );
};