import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

interface SavedMessage {
  id: string;
  message_text: string;
  created_at: string;
  explanation?: string | null;
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
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(message.id)}
          className="first-time-checkbox mt-1 border-[#2D4531] dark:border-[#E5D4BC]"
        />
        <div className="flex-1">
          <p>{message.message_text}</p>
          {message.explanation && (
            <p className="text-sm mt-2 text-[#E5D4BC]/80">{message.explanation}</p>
          )}
        </div>
      </div>
    </Card>
  );
};