import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthSetup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          setError("Unable to connect to the authentication service. Please check your internet connection and try again.");
          return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
              toast.error("Please wait at least 38 seconds before requesting another password reset.");
              return;
            }

            if (session) {
              const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              
              const { data: existingPref, error: prefError } = await supabase
                .from('user_preferences')
                .select('theme')
                .eq('user_id', session.user.id)
                .maybeSingle();

              if (prefError) {
                console.error("Error fetching theme preferences:", prefError);
              }

              if (!existingPref) {
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
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setError("An error occurred while setting up authentication. Please try again.");
      }
    };

    initAuth();
  }, [navigate]);

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    
    if (error?.status === 429) {
      const message = error.message || "Too many requests. Please wait before trying again.";
      if (message.includes("over_email_send_rate_limit")) {
        toast.error("Please wait at least 38 seconds before requesting another password reset.");
      } else {
        toast.error(message);
      }
      return true;
    }
    
    if (error?.message === "Failed to fetch") {
      toast.error("Unable to connect to the authentication service. Please check your internet connection and try again.");
      return true;
    }
    
    return false;
  };

  return { error, handleAuthError };
};