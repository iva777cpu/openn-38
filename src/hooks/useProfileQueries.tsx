import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileQueries = () => {
  const queryClient = useQueryClient();

  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return {
    profiles,
    isLoading,
    refetch,
    queryClient
  };
};