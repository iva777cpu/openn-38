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
          Welcome
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
                  inputBackground: 'transparent',
                  inputText: '#EDEDDD',
                  inputBorder: '#EDEDDD',
                  inputBorderFocus: '#EDEDDD',
                  inputBorderHover: '#EDEDDD',
                  inputPlaceholder: '#EDEDDD',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full bg-[#1A2A1D] hover:bg-[#2D4531] text-[#EDEDDD] py-2 rounded transition-colors',
              input: 'w-full bg-transparent border border-[#EDEDDD] text-[#EDEDDD] rounded p-2 placeholder-[#EDEDDD]',
              label: 'text-[#EDEDDD] block mb-2',
              anchor: 'text-[#EDEDDD] hover:text-[#EDEDDD] underline',
            }
          }}
          providers={[]}
        />
      </div>
    </div>
  );
}