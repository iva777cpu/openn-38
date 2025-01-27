import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { toast } from "sonner";

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
      try {
        if (!isAuthenticated) return null;
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("Auth error:", authError);
          return null;
        }
        
        if (!user) {
          console.log("No user found in session");
          return null;
        }

        // Check if we need to reset based on last_reset
        const now = new Date();
        const resetTime = new Date(now);
        resetTime.setUTCHours(0, 0, 0, 0);

        const { data: existingData, error: fetchError } = await supabase
          .from('user_generations')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error("Fetch error:", fetchError);
          return null;
        }

        // If no data exists or last_reset is from a previous day, create/update with reset values
        if (!existingData || new Date(existingData.last_reset) < resetTime) {
          const { data: newData, error: upsertError } = await supabase
            .from('user_generations')
            .upsert({
              user_id: user.id,
              generation_count: 0,
              last_reset: resetTime.toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (upsertError) {
            console.error("Upsert error:", upsertError);
            return null;
          }
          
          return newData;
        }

        return existingData;
      } catch (error) {
        console.error("Generation count query error:", error);
        return null;
      }
    },
    enabled: isAuthenticated,
    refetchInterval: 60000, // Refetch every minute to check for reset
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Mutation to update generation count
  const updateGenerationCount = useMutation({
    mutationFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error('No user found');

        const currentCount = generationData?.generation_count ?? 0;
        
        const { data, error } = await supabase
          .from('user_generations')
          .upsert({
            user_id: user.id,
            generation_count: currentCount + 1,
            last_reset: generationData?.last_reset || new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Update generation count error:", error);
        toast.error("Failed to update generation count. Please try again.");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generationCount'] });
    },
  });

  const remainingGenerations = isAuthenticated 
    ? 6 - (generationData?.generation_count || 0)
    : 2 - getAnonGenerations();

  const nextReset = getNextResetTime();
  const formattedResetTime = format(toZonedTime(nextReset, 'GMT'), 'HH:mm');

  return {
    remainingGenerations,
    formattedResetTime,
    updateGenerationCount,
    getAnonGenerations,
    setAnonGenerations,
    generationData
  };
};