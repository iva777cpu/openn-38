import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { IcebreakerItem } from "./IcebreakerItem";

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

  // Load explanations from localStorage when component mounts
  useEffect(() => {
    const savedExplanations = localStorage.getItem('currentExplanations');
    if (savedExplanations) {
      setExplanations(JSON.parse(savedExplanations));
    }
  }, []);

  // Save explanations to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(explanations).length > 0) {
      localStorage.setItem('currentExplanations', JSON.stringify(explanations));
    }
  }, [explanations]);

  // Clear explanations when icebreakers change
  useEffect(() => {
    if (icebreakers.length === 0) {
      setExplanations({});
      localStorage.removeItem('currentExplanations');
    }
  }, [icebreakers]);

  const handleReport = async (icebreaker: string) => {
    if (reportedMessages.has(icebreaker)) return;

    try {
      const explanation = explanations[icebreaker]?.text;
      const { error } = await supabase.functions.invoke('report-message', {
        body: { message: icebreaker, explanation }
      });

      if (error) throw error;
      
      setReportedMessages(prev => new Set([...prev, icebreaker]));
      toast.success("Message reported successfully");
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

      // If the icebreaker is saved, update its explanation in the database
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

      // Automatically save the explanation with the icebreaker if it's already saved
      if (savedIcebreakers.has(icebreaker)) {
        onToggleSave(icebreaker, explanation);
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
        <IcebreakerItem
          key={index}
          icebreaker={icebreaker}
          explanation={explanations[icebreaker]?.text || ''}
          isSelected={savedIcebreakers.has(icebreaker)}
          isReported={reportedMessages.has(icebreaker)}
          isExplanationLoading={explanations[icebreaker]?.loading || false}
          isExplanationGenerated={explanations[icebreaker]?.generated || false}
          onToggleSave={() => onToggleSave(icebreaker, explanations[icebreaker]?.text)}
          onGenerateExplanation={() => generateExplanation(icebreaker)}
          onReport={() => handleReport(icebreaker)}
        />
      ))}
    </div>
  );
};