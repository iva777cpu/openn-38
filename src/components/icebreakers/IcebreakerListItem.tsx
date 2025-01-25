import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface SavedMessage {
  id: string;
  message_text: string;
  created_at: string;
  is_edited: boolean;
  explanation: string | null;
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
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(message.explanation);

  const handleExplanationClick = async () => {
    if (explanation || isLoadingExplanation) return;
    
    setIsLoadingExplanation(true);
    console.log("Generating explanation for message:", message.message_text);
    
    try {
      const response = await fetch("/api/generate-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: message.message_text,
          prompt: "explain this reference, assume that I know nothing about the references made"
        }),
      });

      if (!response.ok) throw new Error("Failed to generate explanation");
      
      const data = await response.json();
      console.log("Received explanation:", data.explanation);
      
      // Update the explanation in the database
      const { error: updateError } = await supabase
        .from("saved_messages")
        .update({ explanation: data.explanation })
        .eq("id", message.id);

      if (updateError) throw updateError;
      
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Failed to generate explanation:", error);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

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
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(message.id)}
            className="first-time-checkbox mt-1 border-[#2D4531] dark:border-[#E5D4BC]"
          />
          <div className="flex-1">
            <p>{message.message_text}</p>
            {explanation && (
              <p className="mt-2 text-[13px] italic text-[#E5D4BC] opacity-80">
                {explanation}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 p-0",
              {
                "opacity-50 cursor-not-allowed": explanation !== null,
                "hover:bg-[#3d5941] dark:hover:bg-[#3d5941]": explanation === null
              }
            )}
            onClick={handleExplanationClick}
            disabled={explanation !== null || isLoadingExplanation}
          >
            <div className="relative">
              <HelpCircle 
                className={cn(
                  "h-5 w-5 text-[#E5D4BC]",
                  { "animate-spin": isLoadingExplanation }
                )}
              />
              {isLoadingExplanation && (
                <div className="absolute inset-0 border-2 border-t-transparent border-[#E5D4BC] rounded-full animate-spin" />
              )}
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );
};