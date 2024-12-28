import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

interface SavedIcebreakersProps {
  onBack: () => void;
}

export const SavedIcebreakers: React.FC<SavedIcebreakersProps> = ({ onBack }) => {
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  const { data: messages, refetch } = useQuery({
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

      console.log("Selected messages deleted successfully");
      setSelectedMessages(new Set());
      refetch();
    } catch (error) {
      console.error("Failed to delete messages:", error);
    }
  };

  const toggleMessageSelection = (id: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMessages(newSelected);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-[#1A2A1D] dark:text-[#EDEDDD] hover:bg-[#2D4531] mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold text-[#1A2A1D] dark:text-[#EDEDDD]">Saved Icebreakers</h1>
        </div>
        {selectedMessages.size > 0 && (
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete Selected ({selectedMessages.size})
          </Button>
        )}
      </div>

      {messages?.map((message) => (
        <Card key={message.id} className="p-4 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD] border-[#1A2A1D]">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={selectedMessages.has(message.id)}
              onCheckedChange={() => toggleMessageSelection(message.id)}
              className="mt-1 border-[#EDEDDD]"
            />
            <p className="flex-grow">{message.message_text}</p>
          </div>
        </Card>
      ))}

      {messages?.length === 0 && (
        <p className="text-center text-[#47624B] dark:text-[#EDEDDD]">No saved icebreakers yet.</p>
      )}
    </div>
  );
};