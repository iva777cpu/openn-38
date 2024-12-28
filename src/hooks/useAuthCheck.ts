import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          // Clear any stale session data
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }

        if (!session) {
          console.log("No active session, redirecting to login");
          navigate("/login");
          return;
        }

        // Verify the session is still valid
        const { data: { user }, error: refreshError } = await supabase.auth.getUser();
        
        if (refreshError || !user) {
          console.error("Session refresh error:", refreshError);
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }

        console.log("Authentication successful");
      } catch (error) {
        console.error("Failed to check auth status:", error);
        await supabase.auth.signOut();
        navigate("/login");
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
};