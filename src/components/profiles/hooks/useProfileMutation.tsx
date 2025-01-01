import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getUniqueProfileName } from "../utils/profileUtils";

export const useProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const uniqueName = await getUniqueProfileName(user.id, name, id);
      console.log("Generated unique profile name for update:", uniqueName);

      const { error } = await supabase
        .from("user_profiles")
        .update({ profile_name: uniqueName })
        .eq("id", id);

      if (error) throw error;
      return uniqueName;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });
};