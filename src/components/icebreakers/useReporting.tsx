import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useReporting = () => {
  const [reportedMessages, setReportedMessages] = useState<Set<string>>(new Set());

  const handleReport = async (icebreaker: string, explanation?: string) => {
    if (reportedMessages.has(icebreaker)) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('Reporting message with explanation:', { icebreaker, explanation });
      
      const { error } = await supabase.from('reported_messages').insert([{
        message_text: icebreaker,
        reported_by: user?.id,
        status: 'pending',
        explanation: explanation || null
      }]);

      if (error) throw error;
      
      setReportedMessages(prev => new Set([...prev, icebreaker]));
      toast.success("Message reported successfully");
    } catch (error) {
      console.error('Error reporting message:', error);
      toast.error("Failed to report message. Please try again later.");
    }
  };

  return {
    reportedMessages,
    handleReport
  };
};