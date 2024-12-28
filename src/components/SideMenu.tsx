import React, { useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { MenuButton } from "./menu/MenuButton";
import { MenuContent } from "./menu/MenuContent";

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

  useEffect(() => {
    const checkThemePreference = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log("Checking theme preferences for user:", user.id);
          
          // First try to get existing preferences
          const { data: preferences, error: fetchError } = await supabase
            .from('user_preferences')
            .select('theme')
            .eq('user_id', user.id)
            .maybeSingle();

          if (fetchError) {
            console.error("Error fetching theme preferences:", fetchError);
            return;
          }

          if (preferences) {
            console.log("Found existing preferences:", preferences);
            setIsDarkMode(preferences.theme === 'dark');
            return;
          }

          // If no preferences exist, create new ones
          console.log("No existing preferences found, creating new...");
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const defaultTheme = systemPrefersDark ? 'dark' : 'light';
          
          const { error: insertError } = await supabase
            .from('user_preferences')
            .insert({ 
              user_id: user.id, 
              theme: defaultTheme,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (insertError) {
            console.error("Error creating theme preferences:", insertError);
            return;
          }

          setIsDarkMode(systemPrefersDark);
          return;
        }

        // If no user, just use system preferences
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } catch (error) {
        console.error('Error checking theme preference:', error);
      }
    };

    checkThemePreference();
  }, []);

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
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log("Updating theme preference to:", isDarkMode ? 'dark' : 'light');
          
          const { error } = await supabase
            .from('user_preferences')
            .upsert({ 
              user_id: user.id, 
              theme: isDarkMode ? 'dark' : 'light',
              updated_at: new Date().toISOString()
            });

          if (error) {
            console.error('Error updating theme preference:', error);
          }
        }
      } catch (error) {
        console.error('Error updating theme preference:', error);
      }
    };

    updateThemePreference();
  }, [isDarkMode]);

  const handleNewProfile = () => {
    onNewProfile();
    onOpenChange(false);
    // Scroll to the forms section with a slight delay to ensure DOM is ready
    setTimeout(() => {
      const formsSection = document.querySelector('.profile-form-section');
      if (formsSection) {
        formsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <div className="absolute top-4 right-4">
        <SheetTrigger asChild>
          <MenuButton onClick={() => {}} />
        </SheetTrigger>
      </div>
      <SheetContent className="bg-[#47624B] dark:bg-[#2D4531] border-[#1A2A1D]">
        <MenuContent
          isDarkMode={isDarkMode}
          onNewProfile={handleNewProfile}
          onSaveProfile={() => {
            onSaveProfile();
            onOpenChange(false);
          }}
          onViewProfiles={() => {
            onViewProfiles();
            onOpenChange(false);
          }}
          onViewSavedMessages={() => {
            onViewSavedMessages();
            onOpenChange(false);
          }}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onLogout={() => {
            onLogout();
            onOpenChange(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
};