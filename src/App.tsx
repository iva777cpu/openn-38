import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import "./App.css";

function App() {
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        console.log("Checking initial auth state...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Initial auth check error:", error);
          if (error.status === 403) {
            await supabase.auth.signOut();
            toast.error("Your session has expired. Please sign in again.");
          }
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(!!session);
      } catch (error: any) {
        console.error("Failed to check initial auth status:", error);
        if (error.status === 403) {
          await supabase.auth.signOut();
          toast.error("Your session has expired. Please sign in again.");
        }
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkInitialAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      try {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          setIsAuthenticated(false);
          return;
        }

        if (session) {
          // Verify the session is still valid
          const { error: verifyError } = await supabase.auth.getUser();
          if (verifyError) {
            console.error("Session verification error:", verifyError);
            if (verifyError.status === 403) {
              await supabase.auth.signOut();
              toast.error("Your session has expired. Please sign in again.");
              setIsAuthenticated(false);
              return;
            }
          }
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        console.error("Auth state change error:", error);
        if (error.status === 403) {
          await supabase.auth.signOut();
          toast.error("Your session has expired. Please sign in again.");
        }
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#E5D4BC] dark:bg-[#303D24] flex items-center justify-center">
        <div className="animate-pulse text-[#2D4531] dark:text-[#E5D4BC]">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#E5D4BC] dark:bg-[#303D24] text-[#2D4531] dark:text-[#E5D4BC] p-2 overflow-auto relative">
      <Toaster 
        richColors 
        closeButton
        position="bottom-center"
        toastOptions={{
          className: "!bg-secondary dark:!bg-background-light !text-foreground dark:!text-foreground-light !text-xs !w-fit mx-auto",
          descriptionClassName: "!text-foreground dark:!text-foreground-light !text-xs",
          style: {
            bottom: '4rem',
            padding: '0.5rem',
            minHeight: '2.5rem',
            maxWidth: '280px',
            margin: '0 auto',
            transform: 'translateX(1rem)'
          }
        }}
      />
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Index />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            } 
          />
        </Routes>
      </Router>
    </main>
  );
}

export default App;