import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MenuButtonProps {
  onClick: () => void;
}

export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ onClick }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      className="p-2 text-[#47624B] dark:text-[#EDEDDD] hover:bg-[#2D4531] hover:text-[#EDEDDD]"
      onClick={onClick}
    >
      <Menu className="h-6 w-6" />
    </Button>
  )
);

MenuButton.displayName = "MenuButton";