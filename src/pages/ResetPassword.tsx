import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the recovery token
    const hash = window.location.hash;
    if (!hash || !hash.includes("type=recovery")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#E5D4BC] dark:bg-[#303D24]">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#2D4531] p-8 rounded-lg shadow-lg relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-[#E5D4BC] hover:bg-[#3d5941]"
            onClick={() => navigate("/login")}
          >
            <X className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-[#E5D4BC] text-center mb-8">
            Reset Your Password
          </h1>
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-[#E5D4BC] mb-2">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#47624B] text-[#E5D4BC] border-[#E5D4BC] focus:ring-[#E5D4BC]"
                placeholder="Enter your new password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#47624B] text-[#E5D4BC] hover:bg-[#3d5941]"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}