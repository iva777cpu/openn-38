import React from "react";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";

interface IcebreakerListItemProps {
  message: { id: string; message_text: string };
  isSelected: boolean;
  onToggleSelection: (messageId: string) => void;
}

export const IcebreakerListItem: React.FC<IcebreakerListItemProps> = ({
  message,
  isSelected,
  onToggleSelection,
}) => (
  <Card className="icebreaker-box p-3 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD] dark:text-[#E5D4BC]">
    <div className="flex items-start gap-2">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelection(message.id)}
        className="mt-1 border-[#EDEDDD] dark:border-[#E5D4BC]"
      />
      <p className="flex-grow text-[15px]">{message.message_text}</p>
    </div>
  </Card>
);