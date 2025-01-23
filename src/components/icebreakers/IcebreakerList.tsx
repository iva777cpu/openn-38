import React from "react";
import { Button } from "../ui/button";
import { BookmarkPlus, Flag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const handleReport = async (icebreaker: string) => {
    try {
      const { error } = await supabase.functions.invoke('report-message', {
        body: { message: icebreaker }
      });

      if (error) throw error;

      toast.success("Message reported", {
        position: "top-center",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error reporting message:', error);
      toast.error("Failed to report message");
    }
  };

  if (icebreakers.length === 0) return null;

  return (
    <div className="space-y-2">
      {icebreakers.map((icebreaker, index) => (
        <div key={index} className="p-4 bg-[#47624B] dark:bg-[#2D4531] rounded-md flex justify-between items-start border border-[#E5D4BC]">
          <span className="text-[15px] text-[#E5D4BC]">{icebreaker}</span>
          <div className="flex flex-col gap-2 ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleSave(icebreaker)}
              className="hover:bg-[#1A2A1D] transition-all"
            >
              <BookmarkPlus 
                className={`h-4 w-4 ${
                  savedIcebreakers.has(icebreaker) 
                    ? 'fill-[#E5D4BC] stroke-[#E5D4BC]' 
                    : 'stroke-[#E5D4BC]'
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleReport(icebreaker)}
              className="hover:bg-[#1A2A1D] transition-all opacity-60 hover:opacity-100"
            >
              <Flag className="h-4 w-4 stroke-[#E5D4BC]" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};