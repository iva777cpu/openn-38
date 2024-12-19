import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface SavedIcebreakersProps {
  onBack: () => void;
}

export const SavedIcebreakers: React.FC<SavedIcebreakersProps> = ({ onBack }) => {
  const { toast } = useToast();

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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message deleted successfully",
        className: "fixed inset-x-0 mx-auto max-w-md",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
        className: "fixed inset-x-0 mx-auto max-w-md",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-[#EDEDDD] hover:bg-[#2D4531] mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-[#EDEDDD]">Saved Icebreakers</h1>
      </div>

      {messages?.map((message) => (
        <Card key={message.id} className="p-4 bg-[#2D4531] text-[#EDEDDD] border-[#1A2A1D]">
          <div className="flex justify-between items-start">
            <p className="flex-grow">{message.message_text}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(message.id)}
              className="ml-2 text-[#EDEDDD] hover:bg-[#1A2A1D]"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}

      {messages?.length === 0 && (
        <p className="text-center text-[#EDEDDD]">No saved icebreakers yet.</p>
      )}
    </div>
  );
};