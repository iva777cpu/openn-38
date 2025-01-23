import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useThemePreference = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage first for instant theme application
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
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
            const shouldBeDark = preferences.theme === 'dark';
            setIsDarkMode(shouldBeDark);
            document.documentElement.classList.toggle('dark', shouldBeDark);
            localStorage.setItem('theme', shouldBeDark ? 'dark' : 'light');
          } else {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(systemPrefersDark);
            document.documentElement.classList.toggle('dark', systemPrefersDark);
            localStorage.setItem('theme', systemPrefersDark ? 'dark' : 'light');
            
            await supabase
              .from('user_preferences')
              .upsert({
                user_id: user.id,
                theme: systemPrefersDark ? 'dark' : 'light',
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'user_id'
              });
          }
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
      // Update localStorage first for instant feedback
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      setIsDarkMode(newTheme);
      document.documentElement.classList.toggle('dark', newTheme);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            theme: newTheme ? 'dark' : 'light',
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
      }
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  return { isDarkMode, toggleTheme };
};