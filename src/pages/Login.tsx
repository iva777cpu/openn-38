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
      <div className="w-full max-w-md bg-[#2D4531] p-8 rounded-lg shadow-lg mx-4">
        <h1 className="text-3xl font-semibold text-[#EDEDDD] text-center mb-8">
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
            style: {
              container: {
                width: '100%'
              },
              button: {
                background: 'transparent',
                border: '1px solid #EDEDDD',
                color: '#EDEDDD',
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '16px',
                padding: '10px',
                ':hover': {
                  background: '#2D4531',
                }
              },
              anchor: {
                color: '#EDEDDD',
                fontSize: '14px',
                textAlign: 'center',
                display: 'block',
                marginTop: '10px',
                textDecoration: 'none',
                ':hover': {
                  textDecoration: 'underline',
                }
              },
              label: {
                color: '#EDEDDD',
                fontSize: '16px',
                marginBottom: '8px',
              },
              input: {
                backgroundColor: 'transparent',
                border: '1px solid #EDEDDD',
                borderRadius: '4px',
                color: '#EDEDDD',
                padding: '10px',
                fontSize: '16px',
                width: '100%',
                '::placeholder': {
                  color: '#EDEDDD',
                  opacity: 0.7,
                },
                ':focus': {
                  outline: 'none',
                  borderColor: '#EDEDDD',
                  boxShadow: 'none',
                }
              },
              message: {
                color: '#EDEDDD',
              },
              divider: {
                backgroundColor: '#EDEDDD',
              }
            },
            className: {
              container: 'w-full space-y-4',
              button: 'w-full',
              input: 'w-full',
              label: 'block text-sm font-medium mb-2',
              anchor: 'text-center block mt-4',
            },
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Your password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in ...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: "Don't have an account? Sign up",
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Your password',
                button_label: 'Sign up',
                loading_button_label: 'Signing up ...',
                social_provider_text: 'Sign up with {{provider}}',
                link_text: "Already have an account? Sign in",
              },
              forgotten_password: {
                link_text: "Forgot your password?",
              },
            },
          }}
        />
      </div>
    </div>
  );
}