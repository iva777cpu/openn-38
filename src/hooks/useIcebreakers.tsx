import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useIcebreakers = () => {
  const [savedIcebreakers, setSavedIcebreakers] = useState<Set<string>>(new Set());
  const [icebreakers, setIcebreakers] = useState<string[]>([]);

  useEffect(() => {
    console.log('Initializing useIcebreakers hook');
    loadSavedIcebreakers();
  }, []);

  const loadSavedIcebreakers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found, skipping saved icebreakers load');
        return;
      }

      console.log('Loading saved icebreakers for user:', user.id);
      const { data, error } = await supabase
        .from('saved_messages')
        .select('message_text')
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('Loaded saved icebreakers:', data);
      setSavedIcebreakers(new Set(data.map(item => item.message_text)));
    } catch (error) {
      console.error('Error loading saved icebreakers:', error);
    }
  };

  const clearAllIcebreakers = () => {
    console.log('Clearing all icebreakers');
    setIcebreakers([]);
    // Don't clear savedIcebreakers as those are persisted in the database
  };

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