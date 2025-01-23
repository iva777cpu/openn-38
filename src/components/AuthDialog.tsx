import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthDialog: React.FC<AuthDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onOpenChange(false);
    navigate("/login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#2D4531] text-[#E5D4BC] border-[#E5D4BC] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Authentication Required</DialogTitle>
          <DialogDescription className="text-[#E5D4BC] text-center">
            You need to sign in first to perform this action
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleSignIn}
            className="w-full bg-[#E5D4BC] text-[#2D4531] hover:bg-[#d4c3ab]"
          >
            Sign In
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full border-[#E5D4BC] text-[#E5D4BC] hover:bg-[#3d5941]"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};