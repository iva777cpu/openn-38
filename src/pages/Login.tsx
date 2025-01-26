import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
        toast.success("Successfully signed in!");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-secondary p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-foreground mb-6 text-center">Welcome Back!</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#47624B',
                  brandAccent: '#2D4531',
                  inputBackground: '#E5D4BC',
                  inputText: '#1A2A1D',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/app/confirm-email`}
        />
      </div>
    </div>
  );
}