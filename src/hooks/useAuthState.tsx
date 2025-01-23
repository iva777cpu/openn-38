import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthState = () => {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth check error:", error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!session);
        }
      } catch (error) {
        console.error("Failed to check auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkInitialAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setIsAuthChecking(false);
      } else if (session) {
        setIsAuthenticated(true);
        setIsAuthChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("No user found");
        return;
      }

      const { error } = await supabase.functions.invoke('delete-account', {
        body: { user_id: user.id }
      });

      if (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account");
        return;
      }

      await supabase.auth.signOut();
      toast.success("Account successfully deleted");
    } catch (error) {
      console.error("Error in account deletion:", error);
      toast.error("Failed to delete account");
    }
  };

  return {
    isAuthChecking,
    isAuthenticated,
    handleDeleteAccount
  };
};