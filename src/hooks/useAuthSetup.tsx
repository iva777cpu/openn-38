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
        console.log("Auth event:", event);
        
        if (event === 'SIGNED_IN') {
          navigate("/");
        } else if (event === 'SIGNED_OUT') {
          navigate("/login");
        } else if (event === 'PASSWORD_RECOVERY') {
          toast.error("Please wait at least 38 seconds before requesting another password reset.");
        } else if (event === 'USER_UPDATED') {
          toast.success("Account successfully updated");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Token refreshed");
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
              });

            if (upsertError) {
              console.error("Error upserting theme preferences:", upsertError);
              toast.error("Failed to save theme preference");
            }
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuthError = (error: any) => {
    console.error("Auth error:", error);
    
    if (error.message?.includes("Email not confirmed")) {
      toast.error("Please confirm your email before signing in. Check your inbox for the confirmation link.");
      return true;
    }
    
    if (error.message?.includes("Invalid login credentials")) {
      toast.error("Invalid email or password. Please try again.");
      return true;
    }

    if (error.message?.includes("Email rate limit exceeded")) {
      toast.error("Too many attempts. Please try again in a few minutes.");
      return true;
    }

    toast.error("An error occurred during authentication. Please try again.");
    return true;
  };

  return { error, handleAuthError };
};