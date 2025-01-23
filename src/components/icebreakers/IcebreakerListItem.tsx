import React, { useState } from "react";
import { Save, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface IcebreakerListItemProps {
  message: string;
  onSave?: (message: string) => Promise<void>;
  showSaveButton?: boolean;
}

export const IcebreakerListItem: React.FC<IcebreakerListItemProps> = ({
  message,
  onSave,
  showSaveButton = true,
}) => {
  const [isReporting, setIsReporting] = useState(false);

  const handleReport = async () => {
    setIsReporting(true);
    try {
      const { error } = await supabase.functions.invoke('report-message', {
        body: { message }
      });

      if (error) throw error;

      toast.success("Message reported", {
        position: "top-center",
        style: {
          background: "#47624B",
          color: "#E5D4BC",
        }
      });
    } catch (error) {
      console.error("Error reporting message:", error);
      toast.error("Failed to report message", {
        position: "top-center",
        style: {
          background: "#47624B",
          color: "#E5D4BC",
        }
      });
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="relative group flex items-start gap-2 p-4 rounded-lg bg-[#E5D4BC] dark:bg-[#2D4531] text-[#1A2A1D] dark:text-[#E5D4BC]">
      <p className="flex-1 whitespace-pre-wrap">{message}</p>
      <div className="flex items-center gap-3">
        {showSaveButton && onSave && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-[#47624B]/20"
            onClick={() => onSave(message)}
          >
            <Save className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-[#47624B]/20 opacity-40 hover:opacity-100 transition-opacity"
          onClick={handleReport}
          disabled={isReporting}
        >
          <Flag className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};