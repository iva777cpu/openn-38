import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { useIcebreakerGeneration } from "@/hooks/useIcebreakerGeneration";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface IcebreakerGeneratorProps {
  userProfile: Record<string, string>;
  onIcebreakersGenerated: (icebreakers: string[]) => void;
  isFirstTime: boolean;
  checkAuth: (action: () => void) => Promise<void>;
  isAuthenticated: boolean;
}

export const IcebreakerGenerator: React.FC<IcebreakerGeneratorProps> = ({
  userProfile,
  onIcebreakersGenerated,
  isFirstTime,
  checkAuth,
  isAuthenticated,
}) => {
  const queryClient = useQueryClient();
  const { isLoading, generateIcebreakers } = useIcebreakerGeneration(
    userProfile,
    isFirstTime,
    onIcebreakersGenerated
  );

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
        .single();

      if (error && error.code !== 'PGRST116') throw error;
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

  // Get next reset time (midnight GMT)
  const getNextResetTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCHours(24, 0, 0, 0);
    return tomorrow;
  };

  // Check if we need to reset the counter
  useEffect(() => {
    if (generationData && new Date(generationData.last_reset) < getNextResetTime()) {
      const resetCount = async () => {
        const { error } = await supabase
          .from('user_generations')
          .update({
            generation_count: 0,
            last_reset: new Date().toISOString(),
          })
          .eq('user_id', generationData.user_id);

        if (!error) {
          queryClient.invalidateQueries({ queryKey: ['generationCount'] });
        }
      };

      resetCount();
    }
  }, [generationData, queryClient]);

  const handleGenerate = async () => {
    if (Object.values(userProfile).every(value => !value)) {
      toast.error("hey! fill in some information first! xD", {
        duration: 3000,
      });
      return;
    }

    const handleGenerateAction = async () => {
      if (isAuthenticated) {
        if ((generationData?.generation_count || 0) >= 6) {
          toast.error("You've reached your daily generation limit!", {
            duration: 3000,
          });
          return;
        }
        await updateGenerationCount.mutateAsync();
      } else {
        const anonCount = getAnonGenerations();
        if (anonCount >= 1) {
          checkAuth(() => {});
          return;
        }
        setAnonGenerations(anonCount + 1);
      }
      
      await generateIcebreakers();
    };

    if (isAuthenticated) {
      await handleGenerateAction();
    } else {
      const anonCount = getAnonGenerations();
      if (anonCount >= 1) {
        checkAuth(handleGenerateAction);
      } else {
        await handleGenerateAction();
      }
    }
  };

  const remainingGenerations = isAuthenticated 
    ? 6 - (generationData?.generation_count || 0)
    : 2 - getAnonGenerations();

  const nextReset = getNextResetTime();
  const formattedResetTime = format(toZonedTime(nextReset, 'GMT'), 'HH:mm');

  return (
    <div>
      <Button 
        onClick={handleGenerate} 
        disabled={isLoading || (isAuthenticated ? remainingGenerations <= 0 : getAnonGenerations() >= 2)}
        className="w-full mb-1 bg-[#2D4531] text-[#E5D4BC] hover:bg-[#2D4531] border border-[#E5D4BC]"
      >
        {isLoading ? (
          <span className="flex items-center">
            Generating
            <span className="loading-dots ml-1 text-[8px]">...</span>
          </span>
        ) : (
          <>
            Generate Ice Breakers
            {isAuthenticated && ` (${remainingGenerations}/6)`}
          </>
        )}
      </Button>
      {isAuthenticated && (
        <div className="text-[11px] text-center text-[#E5D4BC] opacity-75">
          Your limit will reset at {formattedResetTime} GMT
        </div>
      )}
    </div>
  );
};
