import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useIcebreakers = () => {
  const [savedIcebreakers, setSavedIcebreakers] = useState<Set<string>>(new Set());
  const [icebreakers, setIcebreakers] = useState<string[]>(() => {
    const saved = localStorage.getItem('currentIcebreakers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    loadSavedIcebreakers();
  }, []);

  useEffect(() => {
    if (icebreakers.length > 0) {
      localStorage.setItem('currentIcebreakers', JSON.stringify(icebreakers));
    }
  }, [icebreakers]);

  const loadSavedIcebreakers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_messages')
        .select('message_text')
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedIcebreakers(new Set(data.map(item => item.message_text)));
    } catch (error) {
      console.error('Error loading saved icebreakers:', error);
    }
  };

  const clearAllIcebreakers = useCallback(() => {
    setIcebreakers([]);
    localStorage.removeItem('currentIcebreakers');
  }, []);

  const toggleIcebreaker = async (icebreaker: string) => {
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
          .insert([{ user_id: user.id, message_text: icebreaker }]);

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