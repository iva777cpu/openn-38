import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthSetup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase connection error:", error);
          if (error.status === 503) {
            setError("The authentication service is temporarily unavailable. Please try again in a few moments.");
          }
        }
      } catch (err) {
        console.error("Failed to connect to Supabase:", err);
        setError("Unable to connect to the authentication service. Please try again later.");
      }
    };

    checkSupabaseConnection();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          toast.error("Please wait at least 38 seconds before requesting another password reset.");
          return;
        }

        if (session) {
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          
          const { data: existingPref } = await supabase
            .from('user_preferences')
            .select('theme')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (!existingPref) {
            console.log("Creating initial theme preference:", systemPrefersDark ? 'dark' : 'light');
            const { error: upsertError } = await supabase
              .from('user_preferences')
              .upsert({ 
                user_id: session.user.id, 
                theme: systemPrefersDark ? 'dark' : 'light',
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              });

            if (upsertError) {
              console.error("Error upserting theme preferences:", upsertError);
            }
          }

          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Add error handler for rate limits
  const handleAuthError = (error: any) => {
    if (error?.status === 429) {
      const message = error.message || "Too many requests. Please wait before trying again.";
      if (message.includes("over_email_send_rate_limit")) {
        toast.error("Please wait at least 38 seconds before requesting another password reset.");
      } else {
        toast.error(message);
      }
      return true;
    }
    return false;
  };

  return { error, handleAuthError };
};