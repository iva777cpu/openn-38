import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileActions = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState<Set<string>>(new Set());

  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const updateProfileMutation = useMutation({
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
      setEditingId(null);
    },
  });

  const handleDeleteSelected = async () => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .in("id", Array.from(selectedProfiles));

      if (error) throw error;
      setSelectedProfiles(new Set());
      refetch();
    } catch (error) {
      console.error("Failed to delete profiles:", error);
    }
  };

  const toggleProfileSelection = (id: string) => {
    const newSelected = new Set(selectedProfiles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProfiles(newSelected);
  };

  return {
    profiles,
    editingId,
    editingName,
    selectedProfiles,
    setEditingId,
    setEditingName,
    handleDeleteSelected,
    toggleProfileSelection,
    updateProfileMutation,
    isLoading,
  };
};

const getUniqueProfileName = async (userId: string, baseName: string, currentId: string) => {
  let finalName = baseName;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const { data } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", userId)
      .eq("profile_name", finalName)
      .neq("id", currentId)
      .maybeSingle();

    if (!data) {
      isUnique = true;
    } else {
      finalName = `${baseName}_${counter}`;
      counter++;
    }
  }

  return finalName;
};