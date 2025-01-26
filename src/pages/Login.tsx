import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthSetup } from "@/hooks/useAuthSetup";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleAuthError } = useAuthSetup();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting to sign in with email:", email);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://lovable.dev/projects/49b6d0a8-6a39-4ad5-9b40-61f71ef20038/confirm-email'
        }
      });

      if (error) {
        console.error("Sign in error:", error);
        handleAuthError(error);
        return;
      }

      console.log("Sign in response:", data);
      toast.success("Check your email for the confirmation link");
      navigate("/confirm-email");
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5D4BC] dark:bg-[#303D24] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#2D4531] p-8 rounded-lg shadow-lg text-center">
        <Mail className="w-16 h-16 text-[#E5D4BC] mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-[#E5D4BC] mb-4">
          Sign in to your account
        </h1>
        <p className="text-[#E5D4BC] mb-8">
          Enter your email to receive a magic link
        </p>
        <form onSubmit={handleSignIn} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border-[#E5D4BC] text-[#E5D4BC] placeholder:text-[#E5D4BC]/50"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E5D4BC] text-[#2D4531] hover:bg-[#d4c3ab] disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Magic Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}