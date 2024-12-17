import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, ArrowLeft, Pen, Save } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";
import type { Database } from "@/integrations/supabase/types";

interface SavedIcebreakersProps {
  onBack: () => void;
}

type Message = Database['public']['Tables']['saved_messages']['Row'];

export const SavedIcebreakers: React.FC<SavedIcebreakersProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

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
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const startEditing = (message: Message) => {
    setEditingId(message.id);
    setEditText(message.message_text);
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      const { error } = await supabase
        .from("saved_messages")
        .update({ 
          message_text: editText,
          is_edited: true
        })
        .eq("id", editingId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message updated successfully",
      });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-[#EDEDDD] hover:bg-[#2D4531] mr-4"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-[#EDEDDD]">Saved Icebreakers</h1>
      </div>

      {messages?.map((message) => (
        <Card key={message.id} className="p-4 bg-[#EDEDDD] text-[#1A2A1D] border-[#1A2A1D]">
          <div className="flex justify-between items-start">
            {editingId === message.id ? (
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-grow mr-2 bg-white text-[#1A2A1D]"
              />
            ) : (
              <p className="flex-grow text-[#1A2A1D]">{message.message_text}</p>
            )}
            <div className="flex items-center space-x-2">
              {editingId === message.id ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={saveEdit}
                  className="text-[#1A2A1D] hover:bg-[#2D4531] hover:text-[#EDEDDD]"
                >
                  <Save className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEditing(message)}
                  className="text-[#1A2A1D] hover:bg-[#2D4531] hover:text-[#EDEDDD]"
                >
                  <Pen className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(message.id)}
                className="text-[#1A2A1D] hover:bg-[#2D4531] hover:text-[#EDEDDD]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {message.is_edited && (
            <div className="text-right mt-2">
              <span className="text-sm text-[#1A2A1D] italic">edited</span>
            </div>
          )}
        </Card>
      ))}

      {messages?.length === 0 && (
        <p className="text-center text-[#EDEDDD]">No saved icebreakers yet.</p>
      )}
    </div>
  );
};
