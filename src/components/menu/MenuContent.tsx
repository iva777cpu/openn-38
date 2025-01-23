import { Button } from "@/components/ui/button";
import { Plus, Save, Users, BookmarkPlus, LogOut, Sun, Moon, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface MenuContentProps {
  isDarkMode: boolean;
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewProfiles: () => void;
  onViewSavedMessages: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const MenuContent = ({
  isDarkMode,
  onNewProfile,
  onSaveProfile,
  onViewProfiles,
  onViewSavedMessages,
  onToggleTheme,
  onLogout,
}: MenuContentProps) => {
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("No user found");
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      );

      if (!confirmed) return;

      const { error: deleteError } = await supabase.functions.invoke('delete-account', {
        body: { user_id: user.id }
      });

      if (deleteError) {
        console.error('Error deleting account:', deleteError);
        toast.error("Failed to delete account. Please try again later.");
        return;
      }

      toast.success("Account successfully deleted");
      navigate("/login");
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred while deleting your account");
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <Button
        variant="ghost"
        className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
        onClick={onNewProfile}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Profile
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
        onClick={onSaveProfile}
      >
        <Save className="mr-2 h-4 w-4" />
        Save Profile
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
        onClick={onViewProfiles}
      >
        <Users className="mr-2 h-4 w-4" />
        Profiles
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
        onClick={onViewSavedMessages}
      >
        <BookmarkPlus className="mr-2 h-4 w-4" />
        Saved Icebreakers
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
        onClick={onToggleTheme}
      >
        {isDarkMode ? (
          <>
            <Sun className="mr-2 h-4 w-4" />
            Light Mode
          </>
        ) : (
          <>
            <Moon className="mr-2 h-4 w-4" />
            Dark Mode
          </>
        )}
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start text-red-500 hover:bg-[#1A2A1D] hover:text-red-400"
        onClick={handleDeleteAccount}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Account
      </Button>
    </div>
  );
};