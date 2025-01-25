import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { BookmarkPlus, Flag, CircleHelp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface IcebreakerListProps {
  icebreakers: string[];
  savedIcebreakers: Set<string>;
  onToggleSave: (icebreaker: string, explanation?: string) => void;
}

interface ExplanationState {
  [key: string]: string;
}

export const IcebreakerList: React.FC<IcebreakerListProps> = ({
  icebreakers,
  savedIcebreakers,
  onToggleSave,
}) => {
  const [reportedIcebreakers, setReportedIcebreakers] = useState<Set<string>>(new Set());
  const [loadingExplanations, setLoadingExplanations] = useState<Set<string>>(new Set());
  const [explanations, setExplanations] = useState<ExplanationState>(() => {
    const stored = localStorage.getItem('currentExplanations');
    return stored ? JSON.parse(stored) : {};
  });

  // Save explanations to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(explanations).length > 0) {
      localStorage.setItem('currentExplanations', JSON.stringify(explanations));
    }
  }, [explanations]);

  // Clear explanations when icebreakers array is empty
  useEffect(() => {
    if (icebreakers.length === 0) {
      setExplanations({});
      localStorage.removeItem('currentExplanations');
    }
  }, [icebreakers]);

  const handleReport = async (icebreaker: string) => {
    if (reportedIcebreakers.has(icebreaker)) return;

    try {
      const { data, error } = await supabase.functions.invoke('report-message', {
        body: { 
          message: icebreaker,
          explanation: explanations[icebreaker] 
        }
      });

      if (error) throw error;

      console.log("Response from report-message function:", data);
      setReportedIcebreakers(prev => new Set([...prev, icebreaker]));

      toast.success("Message reported successfully", {
        position: "top-center",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error reporting message:', error);
      toast.error("Failed to report message. Please try again later.");
    }
  };

  const handleExplanationRequest = async (icebreaker: string) => {
    if (explanations[icebreaker]) return;
    
    setLoadingExplanations(prev => new Set([...prev, icebreaker]));
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-explanation', {
        body: { message: icebreaker }
      });

      if (error) throw error;

      console.log("Explanation response:", data);
      
      const newExplanation = data.explanation;
      setExplanations(prev => {
        const updated = { ...prev, [icebreaker]: newExplanation };
        localStorage.setItem('currentExplanations', JSON.stringify(updated));
        return updated;
      });

      // If the icebreaker is already saved, update it with the explanation
      if (savedIcebreakers.has(icebreaker)) {
        onToggleSave(icebreaker, newExplanation);
      }

    } catch (error) {
      console.error('Error generating explanation:', error);
      toast.error("Failed to generate explanation. Please try again.");
    } finally {
      setLoadingExplanations(prev => {
        const newSet = new Set(prev);
        newSet.delete(icebreaker);
        return newSet;
      });
    }
  };

  if (icebreakers.length === 0) return null;

  return (
    <div className="space-y-2">
      {icebreakers.map((icebreaker, index) => (
        <div key={index} className="p-4 bg-[#47624B] dark:bg-[#2D4531] rounded-md flex flex-col border border-[#E5D4BC]">
          <div className="flex justify-between items-start">
            <span className="text-[15px] text-[#E5D4BC]">{icebreaker}</span>
            <div className="flex flex-col gap-2 ml-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleSave(icebreaker, explanations[icebreaker])}
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
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save icebreaker</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleExplanationRequest(icebreaker)}
                      disabled={!!explanations[icebreaker] || reportedIcebreakers.has(icebreaker)}
                      className={`transition-all ${
                        loadingExplanations.has(icebreaker)
                          ? 'cursor-not-allowed'
                          : explanations[icebreaker] || reportedIcebreakers.has(icebreaker)
                          ? 'bg-[#1A2A1D] opacity-60 cursor-not-allowed'
                          : 'hover:bg-[#1A2A1D] opacity-60 hover:opacity-100'
                      }`}
                    >
                      {loadingExplanations.has(icebreaker) ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#E5D4BC]" />
                      ) : (
                        <CircleHelp className={`h-4 w-4 stroke-[#E5D4BC] ${
                          explanations[icebreaker] ? 'fill-[#E5D4BC]' : ''
                        }`} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get explanation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleReport(icebreaker)}
                      disabled={reportedIcebreakers.has(icebreaker)}
                      className={`transition-all ${
                        reportedIcebreakers.has(icebreaker)
                          ? 'bg-[#1A2A1D] opacity-60 cursor-not-allowed'
                          : 'hover:bg-[#1A2A1D] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Flag className={`h-4 w-4 stroke-[#E5D4BC] ${
                        reportedIcebreakers.has(icebreaker) ? 'fill-[#E5D4BC]' : ''
                      }`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Report message</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          {explanations[icebreaker] && (
            <div className="mt-2 text-[13px] text-[#E5D4BC] italic">
              {explanations[icebreaker]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
