import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
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

  return (
    <section className="space-y-4">
      <div className="section-header">
        <header className="flex items-center mb-2 justify-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-[#303D24] dark:text-[#EDEDDD] hover:bg-[#2D4531] mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-[18px] font-bold text-[#303D24] dark:text-[#EDEDDD]">Saved Icebreakers</h1>
        </header>

        {selectedMessages.size > 0 && (
          <div className="flex mb-4">
            <Button
              onClick={handleDeleteSelected}
              className="bg-[#47624B] text-[#EDEDDD] hover:bg-[#2D4531] text-xs py-1 h-7 px-2"
            >
              Delete Selected ({selectedMessages.size})
            </Button>
          </div>
        )}
      </div>

      <div className="content-section space-y-3">
        {messages?.map((message) => (
          <Card key={message.id} className="icebreaker-box p-4 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD]">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={selectedMessages.has(message.id)}
                onCheckedChange={() => toggleMessageSelection(message.id)}
                className="mt-1 border-[#EDEDDD]"
              />
              <p className="flex-grow text-[15px]">{message.message_text}</p>
            </div>
          </Card>
        ))}

        {messages?.length === 0 && (
          <p className="text-center text-[#47624B] dark:text-[#EDEDDD]">No saved icebreakers yet.</p>
        )}
      </div>
    </section>
  );
};