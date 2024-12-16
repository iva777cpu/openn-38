import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, Plus, Save, MessageCircle } from "lucide-react";

interface SideMenuProps {
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewSavedMessages: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  onNewProfile,
  onSaveProfile,
  onViewSavedMessages,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="fixed top-4 right-4 p-2 text-foreground hover:bg-secondary"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-secondary border-accent">
        <div className="space-y-4 mt-8">
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-accent"
            onClick={onNewProfile}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-accent"
            onClick={onSaveProfile}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-accent"
            onClick={onViewSavedMessages}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Saved Messages
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};