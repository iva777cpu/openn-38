import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIcebreakersList = () => {
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  const { data: messages, isLoading, refetch } = useQuery({
    queryKey: ["saved-messages"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("saved_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleDeleteSelected = async () => {
    try {
      const { error } = await supabase
        .from("saved_messages")
        .delete()
        .in("id", Array.from(selectedMessages));

      if (error) throw error;
      setSelectedMessages(new Set());
      refetch();
    } catch (error) {
      console.error("Failed to delete messages:", error);
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  return {
    messages,
    selectedMessages,
    handleDeleteSelected,
    toggleMessageSelection,
    isLoading,
  };
};