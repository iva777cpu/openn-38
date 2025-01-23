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
  return (
    <Card
      className={`p-4 cursor-pointer transition-colors ${
        isSelected
          ? "bg-[#47624B] text-[#E5D4BC]"
          : "bg-[#E5D4BC] dark:bg-[#2D4531] text-[#1B4233] dark:text-[#E5D4BC] hover:bg-[#D4C3AB] dark:hover:bg-[#3d5941]"
      }`}
      onClick={() => onToggleSelection(message.id)}
    >
      <div className="flex items-start gap-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(message.id)}
          className="border-[#E5D4BC] bg-transparent mt-1"
        />
        <p className="flex-1">{message.message_text}</p>
      </div>
    </Card>
  );
};