import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteAccountDialog } from "../DeleteAccountDialog";
import { MenuActions } from "./MenuActions";

interface MenuContentProps {
  isDarkMode: boolean;
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewProfiles: () => void;
  onViewSavedMessages: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
  onDeleteAccount: () => Promise<void>;
}

export const MenuContent = ({
  isDarkMode,
  onNewProfile,
  onSaveProfile,
  onViewProfiles,
  onViewSavedMessages,
  onToggleTheme,
  onLogout,
  onDeleteAccount,
}: MenuContentProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <MenuActions
        onNewProfile={onNewProfile}
        onSaveProfile={onSaveProfile}
        onViewProfiles={onViewProfiles}
        onViewSavedMessages={onViewSavedMessages}
      />
      
      <div className="flex-1">
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
          className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D] opacity-60"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </div>

      <div className="mt-auto mb-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D]"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <DeleteAccountDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirmDelete={async () => {
          await onDeleteAccount();
          setShowDeleteDialog(false);
        }}
      />
    </div>
  );
};