import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: () => Promise<void>;
}

export const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  open,
  onOpenChange,
  onConfirmDelete,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#E5D4BC] dark:bg-[#2D4531] text-[#1A2A1D] dark:text-[#E5D4BC] border-[#1A2A1D]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="text-[#1A2A1D] dark:text-[#E5D4BC] opacity-90">
            This action cannot be undone. This will permanently delete your account
            and remove all your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#47624B] text-[#E5D4BC] hover:bg-[#2D4531] dark:bg-[#E5D4BC] dark:text-[#2D4531] dark:hover:bg-[#E5D4BC]/90"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirmDelete}
            className="bg-[#1A2A1D] text-[#E5D4BC] hover:bg-[#2D4531] dark:bg-[#E5D4BC] dark:text-[#2D4531] dark:hover:bg-[#E5D4BC]/90"
          >
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};