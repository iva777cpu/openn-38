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
                  brand: '#1A2A1D',
                  brandAccent: '#2D4531',
                  inputBackground: '#EDEDDD',
                  inputText: '#1A2A1D',
                  inputBorder: '#1A2A1D',
                  inputBorderFocus: '#303D24',
                  inputBorderHover: '#303D24',
                  inputPlaceholder: '#1A2A1D',
                }
              }
            },
            style: {
              button: {
                background: '#303D24',
                color: '#EDEDDD',
                borderRadius: '0.375rem',
              },
              anchor: {
                color: '#EDEDDD',
              },
              label: {
                color: '#EDEDDD',
              },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
}