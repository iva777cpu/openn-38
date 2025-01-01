import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfileQuery } from "./hooks/useProfileQuery";
import { useProfileMutation } from "./hooks/useProfileMutation";

export const useProfileActions = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState<Set<string>>(new Set());

  const { data: profiles, isLoading, refetch } = useProfileQuery();
  const updateProfileMutation = useProfileMutation();

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