import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExplanationState {
  [key: string]: {
    text: string;
    loading: boolean;
    generated: boolean;
  };
}

export const useExplanations = (savedIcebreakers: Set<string>) => {
  const [explanations, setExplanations] = useState<ExplanationState>({});

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

  const generateExplanation = async (icebreaker: string, onSave?: (explanation: string) => void) => {
    if (explanations[icebreaker]?.generated) return;

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

      if (onSave) {
        onSave(explanation);
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

  const clearExplanations = () => {
    setExplanations({});
    localStorage.removeItem('currentExplanations');
  };

  return {
    explanations,
    generateExplanation,
    clearExplanations
  };
};