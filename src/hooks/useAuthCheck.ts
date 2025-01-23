import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("Authentication successful");
      } catch (error) {
        console.error("Failed to check auth status:", error);
        navigate("/login");
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
};