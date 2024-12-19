import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          throw error;
        }

        if (!session) {
          console.log("No active session, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("Authentication successful");
      } catch (error) {
        console.error("Failed to check auth status:", error);
        toast({
          title: "Error",
          description: "Failed to verify authentication status",
          variant: "destructive",
        });
        navigate("/login");
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);
};