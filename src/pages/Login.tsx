import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSetup } from "@/hooks/useAuthSetup";

export default function Login() {
  const { error } = useAuthSetup();

  return (
    <div className="fixed inset-0 bg-[#EDEDDD]">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#2D4531] p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-[#E5D4BC] text-center mb-8">
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
                    brandButtonText: "#E5D4BC",
                    defaultButtonBackground: "#47624B",
                    defaultButtonBackgroundHover: "#47624B",
                    defaultButtonBorder: "#E5D4BC",
                    defaultButtonText: "#E5D4BC",
                    inputBackground: '#47624B',
                    inputBorder: '#E5D4BC',
                    inputText: '#E5D4BC',
                    inputPlaceholder: '#E5D4BC',
                    messageText: '#E5D4BC',
                    anchorTextColor: '#E5D4BC',
                    dividerBackground: '#E5D4BC',
                  }
                }
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                message: 'auth-message',
              },
              style: {
                button: { background: '#47624B' },
                anchor: { color: '#E5D4BC' },
                container: { background: '#2D4531' },
                message: { color: '#E5D4BC', background: '#2D4531' },
              },
            }}
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
}