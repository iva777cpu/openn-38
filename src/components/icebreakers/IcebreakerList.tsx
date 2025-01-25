import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { BookmarkPlus, Flag, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LoadingDots } from "../ui/loading-dots";

interface IcebreakerListProps {
  icebreakers: string[];
  savedIcebreakers: Set<string>;
  onToggleSave: (icebreaker: string, explanation?: string) => void;
}

interface ExplanationState {
  [key: string]: {
    text: string;
    loading: boolean;
    generated: boolean;
  };
}

export const IcebreakerList: React.FC<IcebreakerListProps> = ({
  icebreakers,
  savedIcebreakers,
  onToggleSave,
}) => {
  const [reportedMessages, setReportedMessages] = useState<Set<string>>(new Set());
  const [explanations, setExplanations] = useState<ExplanationState>({});

  // Persist explanations in localStorage
  useEffect(() => {
    const savedExplanations = localStorage.getItem('currentExplanations');
    if (savedExplanations) {
      setExplanations(JSON.parse(savedExplanations));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(explanations).length > 0) {
      localStorage.setItem('currentExplanations', JSON.stringify(explanations));
    }
  }, [explanations]);

  // Clear explanations when icebreakers change
  useEffect(() => {
    setExplanations({});
    localStorage.removeItem('currentExplanations');
  }, [icebreakers]);

  const handleReport = async (icebreaker: string) => {
    if (reportedMessages.has(icebreaker)) {
      return;
    }

    try {
      const explanation = explanations[icebreaker]?.text;
      const { data, error } = await supabase.functions.invoke('report-message', {
        body: { 
          message: icebreaker,
          explanation 
        }
      });

      if (error) {
        console.error('Error from report-message function:', error);
        throw error;
      }

      console.log("Response from report-message function:", data);
      
      setReportedMessages(prev => new Set([...prev, icebreaker]));

      toast.success("Message reported successfully", {
        position: "top-center",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error reporting message:', error);
      toast.error("Failed to report message. Please try again later.");
    }
  };

  const generateExplanation = async (icebreaker: string) => {
    if (explanations[icebreaker]?.generated || reportedMessages.has(icebreaker)) {
      return;
    }

    setExplanations(prev => ({
      ...prev,
      [icebreaker]: { text: '', loading: true, generated: false }
    }));

    try {
      const { data, error } = await supabase.functions.invoke('generate-explanation', {
        body: { message: icebreaker }
      });

      if (error) throw error;

      const explanation = data.explanation;
      
      setExplanations(prev => ({
        ...prev,
        [icebreaker]: { text: explanation, loading: false, generated: true }
      }));

      // If the icebreaker is already saved, update it with the explanation
      if (savedIcebreakers.has(icebreaker)) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('saved_messages')
            .update({ explanation })
            .eq('user_id', user.id)
            .eq('message_text', icebreaker);
        }
      }

    } catch (error) {
      console.error('Error generating explanation:', error);
      toast.error("Failed to generate explanation. Please try again later.");
      setExplanations(prev => ({
        ...prev,
        [icebreaker]: { text: '', loading: false, generated: false }
      }));
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleSave(icebreaker, explanations[icebreaker]?.text)}
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
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => generateExplanation(icebreaker)}
                  disabled={explanations[icebreaker]?.generated || reportedMessages.has(icebreaker)}
                  className={`hover:bg-[#1A2A1D] transition-all ${
                    explanations[icebreaker]?.generated 
                      ? 'bg-[#1A2A1D]'
                      : reportedMessages.has(icebreaker)
                      ? 'opacity-50'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {explanations[icebreaker]?.loading ? (
                    <div className="h-4 w-4 animate-spin border-2 border-[#E5D4BC] border-t-transparent rounded-full" />
                  ) : (
                    <HelpCircle 
                      className={`h-4 w-4 stroke-[#E5D4BC] transition-all ${
                        explanations[icebreaker]?.generated ? 'fill-[#E5D4BC]' : ''
                      }`}
                    />
                  )}
                </Button>
              </div>
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReport(icebreaker)}
                  disabled={reportedMessages.has(icebreaker)}
                  className={`hover:bg-[#1A2A1D] transition-all ${
                    reportedMessages.has(icebreaker)
                      ? 'bg-[#1A2A1D] opacity-100'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Flag 
                    className={`h-4 w-4 ${
                      reportedMessages.has(icebreaker)
                        ? 'fill-[#E5D4BC] stroke-[#E5D4BC]'
                        : 'stroke-[#E5D4BC]'
                    }`}
                  />
                </Button>
                {reportedMessages.has(icebreaker) && (
                  <span className="text-[11px] text-[#E5D4BC] mt-1">reported</span>
                )}
              </div>
            </div>
          </div>
          {explanations[icebreaker]?.text && (
            <p className="text-[13px] text-[#E5D4BC] mt-2 italic">
              {explanations[icebreaker].text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};