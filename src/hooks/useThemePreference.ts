import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useThemePreference = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log("Fetching theme preference for user:", user.id);
          
          const { data: preferences, error } = await supabase
            .from('user_preferences')
            .select('theme')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error) {
            console.error("Error fetching theme preferences:", error);
            return;
          }

          if (preferences) {
            console.log("Found user theme preference:", preferences.theme);
            setIsDarkMode(preferences.theme === 'dark');
          } else {
            // If no preference exists, use system preference
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            console.log("Using system theme preference:", systemPrefersDark ? 'dark' : 'light');
            setIsDarkMode(systemPrefersDark);
            
            // Save the system preference
            const { error: upsertError } = await supabase
              .from('user_preferences')
              .upsert({
                user_id: user.id,
                theme: systemPrefersDark ? 'dark' : 'light',
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              });

            if (upsertError) {
              console.error("Error saving initial theme preference:", upsertError);
            }
          }
        } else {
          // If no user is logged in, use system preference
          const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          console.log("No user logged in, using system theme:", systemPrefersDark ? 'dark' : 'light');
          setIsDarkMode(systemPrefersDark);
        }
      } catch (error) {
        console.error('Error initializing theme:', error);
      }
    };

    initializeTheme();
  }, []);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log("Saving theme preference:", newTheme ? 'dark' : 'light');
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            theme: newTheme ? 'dark' : 'light',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.error("Error saving theme preference:", error);
          return;
        }
      }

      setIsDarkMode(newTheme);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  return { isDarkMode, toggleTheme };
};