import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { App as CapacitorApp } from '@capacitor/app';

export const useAuthSetup = () => {
  const navigate = useNavigate();

  const checkSupabaseConnection = async () => {
    try {
      const { error } = await supabase.from('profiles').select('count').single();
      if (error) {
        console.error('Supabase connection error:', error);
        toast.error('Failed to connect to the database');
      }
    } catch (error) {
      console.error('Supabase connection check failed:', error);
      toast.error('Failed to connect to the database');
    }
  };

  useEffect(() => {
    checkSupabaseConnection();

    // Handle deep links in Capacitor
    const setupDeepLinks = async () => {
      try {
        await CapacitorApp.addListener('appUrlOpen', ({ url }) => {
          const slug = url.split('.app').pop();
          if (slug) {
            navigate(slug);
          }
        });
      } catch (e) {
        console.log('Deep links setup skipped - not running in Capacitor');
      }
    };

    setupDeepLinks();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth event:", event);
        
        if (event === 'SIGNED_IN') {
          if (session?.user?.email) {
            toast.success(`Welcome back, ${session.user.email}`);
          }
          navigate("/");
        } else if (event === 'SIGNED_OUT') {
          navigate("/login");
        } else if (event === 'PASSWORD_RECOVERY') {
          navigate("/reset-password");
        } else if (event === 'USER_UPDATED') {
          toast.success("Account successfully updated");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("Token refreshed");
        }

        if (session?.user && event === 'SIGNED_IN') {
          const { data: existingPref, error: prefError } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (!existingPref) {
            const { error: upsertError } = await supabase
              .from('user_preferences')
              .upsert({ 
                user_id: session.user.id,
                theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
              });

            if (upsertError) {
              console.error("Error creating user preferences:", upsertError);
              toast.error("Failed to save your preferences");
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    toast.error(error.message || 'An authentication error occurred');
  };

  return { handleAuthError };
};