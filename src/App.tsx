import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import "./App.css";

function App() {
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        await supabase.auth.getSession();
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkInitialAuth();
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
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;