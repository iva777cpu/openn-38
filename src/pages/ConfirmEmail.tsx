import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ConfirmEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          toast.success("Email confirmed successfully!");
          navigate("/");
        } else {
          toast.error("Unable to confirm email. Please try again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error confirming email:", error);
        toast.error("An error occurred while confirming your email.");
        navigate("/login");
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Confirming your email...</h1>
        <div className="animate-pulse text-foreground">Please wait</div>
      </div>
    </div>
  );
}