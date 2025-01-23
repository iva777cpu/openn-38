import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          if (error.status === 403) {
            await supabase.auth.signOut();
            toast.error("Your session has expired. Please sign in again.");
          }
          navigate("/login");
          return;
        }

        if (!session) {
          console.log("No active session, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("Authentication successful");
      } catch (error: any) {
        console.error("Failed to check auth status:", error);
        if (error.status === 403) {
          await supabase.auth.signOut();
          toast.error("Your session has expired. Please sign in again.");
        }
        navigate("/login");
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (!session || event === 'SIGNED_OUT') {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
};