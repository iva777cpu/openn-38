import React from "react";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";

interface IcebreakerListItemProps {
  message: {
    id: string;
    message_text: string;
    explanation?: string;
  };
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
}

export const IcebreakerListItem: React.FC<IcebreakerListItemProps> = ({
  message,
  isSelected,
  onToggleSelection,
}) => {
  return (
    <Card className="p-4 bg-[#47624B] dark:bg-[#2D4531] border border-[#E5D4BC]">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelection(message.id)}
          className="mt-1 border-[#E5D4BC] bg-transparent"
        />
        <div className="flex-grow">
          <p className="text-[15px] text-[#E5D4BC]">{message.message_text}</p>
          {message.explanation && (
            <p className="mt-2 text-[13px] text-[#E5D4BC] italic">
              {message.explanation}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};