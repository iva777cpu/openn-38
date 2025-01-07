import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
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
          // Get system preference
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          
          // Try to get existing preference or create new one
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

  return (
    <div className="fixed inset-0 bg-[#EDEDDD]">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#2D4531] p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-[#EDEDDD] text-center mb-8">
            Welcome to Openera
          </h1>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-md p-4 mb-6">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#47624B',
                    brandAccent: '#47624B',
                    brandButtonText: "#EDEDDD",
                    defaultButtonBackground: "#47624B",
                    defaultButtonBackgroundHover: "#47624B",
                    defaultButtonBorder: "#EDEDDD",
                    defaultButtonText: "#EDEDDD",
                    inputBackground: '#47624B',
                    inputBorder: '#EDEDDD',
                    inputText: '#EDEDDD',
                    inputPlaceholder: '#EDEDDD',
                    messageText: '#EDEDDD',
                    anchorTextColor: '#EDEDDD',
                    dividerBackground: '#EDEDDD',
                  }
                }
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              }
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
}