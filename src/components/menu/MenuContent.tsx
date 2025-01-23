import React from "react";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Plus,
  Save,
  MessageSquare,
  Users,
  Trash2,
} from "lucide-react";
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
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewSavedMessages: () => void;
  onViewProfiles: () => void;
  onLogout: () => void;
  onOpenChange: (open: boolean) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const MenuContent: React.FC<MenuContentProps> = ({
  onNewProfile,
  onSaveProfile,
  onViewSavedMessages,
  onViewProfiles,
  onLogout,
  onOpenChange,
}) => {
  const handleDeleteAccount = async () => {
    try {
      // Just sign out the user since we can't delete via client API
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      toast.success("Successfully signed out");
      onOpenChange(false);
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again later.");
    }
  };

  return (
    <div className="grid gap-4">
      <Button
        onClick={() => {
          onNewProfile();
          onOpenChange(false);
        }}
        variant="ghost"
        className="w-full justify-start"
      >
        <Plus className="mr-2 h-4 w-4" />
        New Profile
      </Button>
      <Button
        onClick={() => {
          onSaveProfile();
          onOpenChange(false);
        }}
        variant="ghost"
        className="w-full justify-start"
      >
        <Save className="mr-2 h-4 w-4" />
        Save Profile
      </Button>
      <Button
        onClick={() => {
          onViewSavedMessages();
          onOpenChange(false);
        }}
        variant="ghost"
        className="w-full justify-start"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Saved Messages
      </Button>
      <Button
        onClick={() => {
          onViewProfiles();
          onOpenChange(false);
        }}
        variant="ghost"
        className="w-full justify-start"
      >
        <Users className="mr-2 h-4 w-4" />
        View Profiles
      </Button>
      <Button
        onClick={() => {
          onLogout();
          onOpenChange(false);
        }}
        variant="ghost"
        className="w-full justify-start"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will sign you out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};