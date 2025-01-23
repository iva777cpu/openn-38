import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, Trash2, FileText, LogIn } from "lucide-react";
import { useState } from "react";
import { DeleteAccountDialog } from "../DeleteAccountDialog";
import { PrivacyPolicyDialog } from "../PrivacyPolicyDialog";
import { MenuActions } from "./MenuActions";
import { useNavigate } from "react-router-dom";

interface MenuContentProps {
  isDarkMode: boolean;
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewProfiles: () => void;
  onViewSavedMessages: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
  onDeleteAccount: () => Promise<void>;
  isAuthenticated: boolean;
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
  isAuthenticated,
}: MenuContentProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  return (
    <div className="flex flex-col h-full pt-6">
      <div className="space-y-4">
        <MenuActions
          onNewProfile={onNewProfile}
          onSaveProfile={onSaveProfile}
          onViewProfiles={onViewProfiles}
          onViewSavedMessages={onViewSavedMessages}
        />
        
        <Button
          variant="ghost"
          className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D] mb-4"
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
          className="w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D] text-[14px]"
          onClick={() => setShowPrivacyPolicy(true)}
        >
          <FileText className="mr-2 h-4 w-4" />
          Privacy Policy
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D] ${isAuthenticated ? 'opacity-60 pointer-events-none' : ''}`}
          onClick={() => window.location.href = '/login'}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D] ${!isAuthenticated ? 'opacity-60 pointer-events-none' : ''}`}
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>

        <Button
          variant="ghost"
          className={`w-full justify-start text-[#EDEDDD] dark:text-[#E5D4BC] hover:bg-[#1A2A1D] ${!isAuthenticated ? 'opacity-60 pointer-events-none' : ''}`}
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

      <PrivacyPolicyDialog
        open={showPrivacyPolicy}
        onOpenChange={setShowPrivacyPolicy}
      />
    </div>
  );
};