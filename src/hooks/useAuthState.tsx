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

  const handleSignOut = async () => {
    try {
      // First clear all local storage data
      localStorage.clear();
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during sign out:", error);
        // Even if there's an error, we want to force the signed out state
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Failed to sign out:", error);
      // Force signed out state even if the API call fails
      setIsAuthenticated(false);
    }
  };

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

      await handleSignOut();
      toast.success("Account successfully deleted");
    } catch (error) {
      console.error("Error in account deletion:", error);
      toast.error("Failed to delete account");
    }
  };

  return {
    isAuthChecking,
    isAuthenticated,
    handleSignOut,
    handleDeleteAccount
  };
};