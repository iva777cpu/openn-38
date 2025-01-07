import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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

  return { error };
};