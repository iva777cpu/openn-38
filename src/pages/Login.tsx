import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#303D24] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2D4531] p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-[#EDEDDD] text-center mb-8">
          Welcome to Openera
        </h1>
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
  );
}