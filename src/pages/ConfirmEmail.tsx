import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleConfirmation = async () => {
      console.log("Starting confirmation process");
      console.log("Search params:", Object.fromEntries(searchParams.entries()));
      
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');
      const accessToken = searchParams.get('access_token');

      // Handle email confirmation
      if ((type === 'signup' || type === 'recovery') && (refreshToken || accessToken)) {
        try {
          let session;
          
          if (refreshToken) {
            console.log("Attempting to refresh session with token");
            const { data, error } = await supabase.auth.refreshSession({
              refresh_token: refreshToken
            });
            
            if (error) {
              console.error("Session refresh error:", error);
              throw error;
            }
            session = data.session;
          } else if (accessToken) {
            console.log("Getting session with access token");
            const { data, error } = await supabase.auth.getSession();
            if (error) {
              console.error("Get session error:", error);
              throw error;
            }
            session = data.session;
          }

          if (session?.user?.email_confirmed_at) {
            console.log("Email confirmed successfully");
            toast.success("Email confirmed successfully!");
            navigate("/");
            return;
          } else {
            console.log("Session exists but email not confirmed");
          }
        } catch (error) {
          console.error("Error during confirmation:", error);
          toast.error("Failed to confirm email. Please try again.");
        }
      }

      // Check if already confirmed
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email_confirmed_at) {
        console.log("Email already confirmed");
        toast.success("Email already confirmed!");
        navigate("/");
      }
    };

    handleConfirmation();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === "SIGNED_IN") {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, searchParams]);

  const handleResendEmail = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.email) {
      toast.error("No email found. Please try signing up again.");
      navigate("/login");
      return;
    }

    try {
      console.log("Attempting to resend confirmation email to:", session.user.email);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: session.user.email
      });

      if (error) {
        console.error("Error resending confirmation:", error);
        toast.error("Failed to resend confirmation email. Please try again.");
        return;
      }

      toast.success("Confirmation email resent. Please check your inbox.");
    } catch (error) {
      console.error("Error in resend process:", error);
      toast.error("An error occurred while resending the confirmation email.");
    }
  };

  return (
    <div className="min-h-screen bg-[#E5D4BC] dark:bg-[#303D24] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2D4531] p-8 rounded-lg shadow-lg text-center">
        <Mail className="w-16 h-16 text-[#E5D4BC] mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-[#E5D4BC] mb-4">
          Check your email
        </h1>
        <p className="text-[#E5D4BC] mb-8">
          We've sent you a confirmation email. Please click the link in the email to verify your account.
        </p>
        <div className="space-y-4">
          <Button
            onClick={handleResendEmail}
            variant="outline"
            className="w-full bg-transparent border-[#E5D4BC] text-[#E5D4BC] hover:bg-[#47624B]"
          >
            Resend confirmation email
          </Button>
          <Button
            onClick={() => navigate("/login")}
            variant="ghost"
            className="w-full text-[#E5D4BC] hover:bg-[#47624B]"
          >
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
}