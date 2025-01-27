import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const useGenerationCount = (isAuthenticated: boolean) => {
  const queryClient = useQueryClient();

  // Get next reset time (midnight GMT)
  const getNextResetTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCHours(24, 0, 0, 0);
    return tomorrow;
  };

  // Track anonymous generations in localStorage
  const getAnonGenerations = () => {
    const count = localStorage.getItem('anonGenerations');
    return count ? parseInt(count) : 0;
  };

  const setAnonGenerations = (count: number) => {
    localStorage.setItem('anonGenerations', count.toString());
  };

  // Query for user's generation count
  const { data: generationData } = useQuery({
    queryKey: ['generationCount'],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_generations')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      // If no data exists, create initial record
      if (!data && !error) {
        const { data: newData, error: insertError } = await supabase
          .from('user_generations')
          .insert({
            user_id: user.id,
            generation_count: 0,
            last_reset: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newData;
      }

      return data;
    },
    enabled: isAuthenticated,
  });

  // Mutation to update generation count
  const updateGenerationCount = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('user_generations')
        .upsert({
          user_id: user.id,
          generation_count: (generationData?.generation_count || 0) + 1,
          last_reset: generationData?.last_reset || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generationCount'] });
    },
  });

  const resetGenerationCount = async () => {
    if (!isAuthenticated) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_generations')
      .update({
        generation_count: 0,
        last_reset: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['generationCount'] });
    }
  };

  const remainingGenerations = isAuthenticated 
    ? 6 - (generationData?.generation_count || 0)
    : 2 - getAnonGenerations();

  const nextReset = getNextResetTime();
  const formattedResetTime = format(toZonedTime(nextReset, 'GMT'), 'HH:mm');

  return {
    remainingGenerations,
    formattedResetTime,
    updateGenerationCount,
    resetGenerationCount,
    getAnonGenerations,
    setAnonGenerations,
    generationData
  };
};