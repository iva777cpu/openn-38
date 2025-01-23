import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useThemePreference = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      return savedTheme === 'dark';
    }
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    localStorage.setItem('theme', systemPrefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', systemPrefersDark);
    return systemPrefersDark;
  });

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Set initial theme immediately from localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        const shouldBeDark = savedTheme === 'dark';
        setIsDarkMode(shouldBeDark);
        document.documentElement.classList.toggle('dark', shouldBeDark);

        // Then check user preferences from database
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: preferences } = await supabase
            .from('user_preferences')
            .select('theme')
            .eq('user_id', user.id)
            .maybeSingle();

          if (preferences) {
            const dbTheme = preferences.theme === 'dark';
            setIsDarkMode(dbTheme);
            document.documentElement.classList.toggle('dark', dbTheme);
            localStorage.setItem('theme', dbTheme ? 'dark' : 'light');
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
      setIsDarkMode(newTheme);
      document.documentElement.classList.toggle('dark', newTheme);
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');

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