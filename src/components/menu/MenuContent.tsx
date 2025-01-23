import { Button } from "@/components/ui/button";
import { Plus, Save, Users, BookmarkPlus, LogOut, Sun, Moon, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("No user found");
        return;
      }

      // Delete user's data
      const { error: profilesError } = await supabase
        .from("user_profiles")
        .delete()
        .eq("user_id", user.id);

      if (profilesError) {
        console.error("Error deleting profiles:", profilesError);
        toast.error("Failed to delete account data");
        return;
      }

      const { error: preferencesError } = await supabase
        .from("user_preferences")
        .delete()
        .eq("user_id", user.id);

      if (preferencesError) {
        console.error("Error deleting preferences:", preferencesError);
        toast.error("Failed to delete account preferences");
        return;
      }

      const { error: messagesError } = await supabase
        .from("saved_messages")
        .delete()
        .eq("user_id", user.id);

      if (messagesError) {
        console.error("Error deleting messages:", messagesError);
        toast.error("Failed to delete saved messages");
        return;
      }

      // Delete the user account
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        console.error("Error deleting user:", deleteError);
        toast.error("Failed to delete account");
        return;
      }

      toast.success("Account deleted successfully");
      onLogout();
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 dark:text-red-400 hover:bg-[#1A2A1D] hover:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-[#47624B] dark:bg-[#2D4531] border-[#1A2A1D] text-[#EDEDDD] dark:text-[#E5D4BC]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#EDEDDD]/70 dark:text-[#E5D4BC]/70">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#2D4531] dark:bg-[#1A2A1D] text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D] dark:hover:bg-[#2D4531]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-500/10 text-red-500 hover:bg-red-500/20 dark:bg-red-400/10 dark:text-red-400 dark:hover:bg-red-400/20"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        variant="ghost"
        className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
        onClick={onLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};