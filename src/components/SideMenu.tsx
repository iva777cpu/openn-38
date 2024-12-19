import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, Plus, Save, BookmarkPlus, Users, LogOut, Sun, Moon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SideMenuProps {
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewSavedMessages: () => void;
  onViewProfiles: () => void;
  onLogout: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  onNewProfile,
  onSaveProfile,
  onViewSavedMessages,
  onViewProfiles,
  onLogout,
  open,
  onOpenChange,
}) => {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  // Check system preference and stored preference on mount
  useEffect(() => {
    const checkThemePreference = async () => {
      // First check if user has a stored preference
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('user_id', user.id)
          .single();

        if (preferences) {
          setIsDarkMode(preferences.theme === 'dark');
          return;
        }
      }

      // If no stored preference, check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
      } else {
        setIsDarkMode(false);
      }
    };

    checkThemePreference();
  }, []);

  // Update theme in UI and persist to database
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }

    const updateThemePreference = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existingPref } = await supabase
          .from('user_preferences')
          .select()
          .eq('user_id', user.id)
          .single();

        if (existingPref) {
          await supabase
            .from('user_preferences')
            .update({ theme: isDarkMode ? 'dark' : 'light', updated_at: new Date().toISOString() })
            .eq('user_id', user.id);
        } else {
          await supabase
            .from('user_preferences')
            .insert({ user_id: user.id, theme: isDarkMode ? 'dark' : 'light' });
        }
      }
    };

    updateThemePreference();
  }, [isDarkMode]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <div className="absolute top-4 right-4">
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="p-2 text-[#47624B] dark:text-[#EDEDDD] hover:bg-[#2D4531] hover:text-[#EDEDDD]"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent className="bg-[#47624B] dark:bg-[#2D4531] border-[#1A2A1D]">
        <div className="space-y-4 mt-8">
          <Button
            variant="ghost"
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#1A2A1D]"
            onClick={onNewProfile}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#1A2A1D]"
            onClick={onSaveProfile}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#1A2A1D]"
            onClick={onViewProfiles}
          >
            <Users className="mr-2 h-4 w-4" />
            Profiles
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#1A2A1D]"
            onClick={onViewSavedMessages}
          >
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Saved Icebreakers
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#1A2A1D]"
            onClick={() => setIsDarkMode(!isDarkMode)}
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
            className="w-full justify-start text-[#EDEDDD] hover:bg-[#1A2A1D]"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};