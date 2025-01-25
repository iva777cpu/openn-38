import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useIcebreakers = () => {
  const [savedIcebreakers, setSavedIcebreakers] = useState<Set<string>>(new Set());
  const [icebreakers, setIcebreakers] = useState<string[]>(() => {
    const stored = localStorage.getItem('currentIcebreakers');
    return stored ? JSON.parse(stored) : [];
  });

  // Save icebreakers to localStorage whenever they change
  useEffect(() => {
    if (icebreakers.length > 0) {
      localStorage.setItem('currentIcebreakers', JSON.stringify(icebreakers));
    }
  }, [icebreakers]);

  const clearAllIcebreakers = useCallback(() => {
    console.log('Clearing all icebreakers and removing from localStorage');
    setIcebreakers([]);
    localStorage.removeItem('currentIcebreakers');
  }, []);

  const toggleIcebreaker = async (icebreaker: string, explanation?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (savedIcebreakers.has(icebreaker)) {
        const { error } = await supabase
          .from('saved_messages')
          .delete()
          .eq('user_id', user.id)
          .eq('message_text', icebreaker);

        if (error) throw error;

        setSavedIcebreakers(prev => {
          const newSet = new Set(prev);
          newSet.delete(icebreaker);
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from('saved_messages')
          .insert([{ 
            user_id: user.id, 
            message_text: icebreaker,
            explanation: explanation 
          }]);

        if (error) throw error;

        setSavedIcebreakers(prev => new Set([...prev, icebreaker]));
      }
    } catch (error) {
      console.error('Error toggling icebreaker:', error);
    }
  };

  return {
    savedIcebreakers,
    icebreakers,
    setIcebreakers,
    clearAllIcebreakers,
    toggleIcebreaker
  };
};