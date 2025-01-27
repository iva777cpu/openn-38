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

        // Get current time and reset time in UTC
        const now = new Date();
        const resetTime = new Date(now);
        resetTime.setUTCHours(0, 0, 0, 0);

        console.log("Current time (UTC):", now.toUTCString());
        console.log("Reset time (UTC):", resetTime.toUTCString());

        // First try to get existing data
        const { data: existingData, error: fetchError } = await supabase
          .from('user_generations')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("Fetch error:", fetchError);
          return null;
        }

        console.log("Existing data:", existingData);
        
        // If no data exists or last_reset is from a previous day, reset the count
        if (!existingData || new Date(existingData.last_reset) < resetTime) {
          console.log("Resetting generation count - new day or no existing data");
          
          const { data: updatedData, error: updateError } = await supabase
            .from('user_generations')
            .upsert({
              user_id: user.id,
              generation_count: 0,
              last_reset: resetTime.toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            })
            .select()
            .maybeSingle();

          if (updateError) {
            console.error("Update error:", updateError);
            return null;
          }
          
          console.log("Reset data:", updatedData);
          return updatedData;
        }

        return existingData;
      } catch (error) {
        console.error("Generation count query error:", error);
        return null;
      }
    },
    enabled: isAuthenticated,
    refetchInterval: 60000, // Refetch every minute to check for reset
  });

  // Mutation to update generation count
  const updateGenerationCount = useMutation({
    mutationFn: async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) throw new Error('No user found');

        const currentCount = generationData?.generation_count ?? 0;
        console.log("Current count before update:", currentCount);
        
        if (currentCount >= 6) {
          throw new Error('Daily limit reached');
        }

        const { data, error } = await supabase
          .from('user_generations')
          .upsert({
            user_id: user.id,
            generation_count: currentCount + 1,
            last_reset: generationData?.last_reset || new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
          .select()
          .maybeSingle();

        if (error) throw error;
        
        console.log("Updated generation data:", data);
        return data;
      } catch (error: any) {
        console.error("Update generation count error:", error);
        if (error.message === 'Daily limit reached') {
          toast.error("You've reached your daily generation limit!");
        } else {
          toast.error("Failed to update generation count. Please try again.");
        }
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