import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        // If no session, check if we have a recovery token in the URL
        const hash = window.location.hash;
        if (!hash || !hash.includes('type=recovery')) {
          toast.error("Invalid or expired password reset link");
          navigate("/login");
          return;
        }
      }
      setHasAccess(true);
    };

    checkAccess();
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      // Clear any existing sessions
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#E5D4BC] dark:bg-[#303D24] flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-[#2D4531] p-6 rounded-lg shadow-lg text-[#E5D4BC]">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Verifying...</h2>
            <p className="mt-2 text-sm">Please wait while we verify your reset link.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5D4BC] dark:bg-[#303D24] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-[#2D4531] p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#E5D4BC]">Reset Your Password</h2>
          <p className="mt-2 text-sm text-[#E5D4BC]">Enter your new password below</p>
        </div>

        <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-[#E5D4BC]">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              minLength={6}
              className="w-full bg-[#47624B] text-[#E5D4BC] border-[#E5D4BC] placeholder:text-[#E5D4BC]/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#E5D4BC] text-[#2D4531] hover:bg-[#E5D4BC]/90"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full text-[#E5D4BC] hover:bg-[#47624B]"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </Button>
        </form>
      </div>
    </div>
  );
}
