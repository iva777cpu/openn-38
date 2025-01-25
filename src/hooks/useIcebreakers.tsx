import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useIcebreakers = () => {
  const [savedIcebreakers, setSavedIcebreakers] = useState<Set<string>>(new Set());
  const [icebreakers, setIcebreakers] = useState<string[]>(() => {
    const saved = localStorage.getItem('currentIcebreakers');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    loadSavedIcebreakers();
  }, []);

  const loadSavedIcebreakers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      const { data, error } = await supabase
        .from('saved_messages')
        .select('message_text, explanation')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedIcebreakers(new Set(data.map(item => item.message_text)));
    } catch (error) {
      console.error('Error loading saved icebreakers:', error);
      toast.error("Failed to load saved icebreakers");
    }
  };

  const clearAllIcebreakers = useCallback(() => {
    setIcebreakers([]);
    localStorage.removeItem('currentIcebreakers');
  }, []);

  useEffect(() => {
    if (icebreakers.length > 0) {
      localStorage.setItem('currentIcebreakers', JSON.stringify(icebreakers));
    }
  }, [icebreakers]);

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
        
        toast.success("Icebreaker removed from saved messages");
      } else {
        console.log('Saving icebreaker with explanation:', { icebreaker, explanation });
        
        const { error } = await supabase
          .from('saved_messages')
          .insert([{ 
            user_id: user.id, 
            message_text: icebreaker,
            explanation: explanation || null
          }]);

        if (error) {
          console.error('Error saving icebreaker:', error);
          throw error;
        }

        setSavedIcebreakers(prev => new Set([...prev, icebreaker]));
        toast.success("Icebreaker saved successfully");
      }
    } catch (error) {
      console.error('Error toggling icebreaker:', error);
      toast.error("Failed to save icebreaker");
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