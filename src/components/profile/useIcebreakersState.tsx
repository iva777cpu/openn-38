import { useState, useCallback, useEffect } from "react";
import { useIcebreakers } from "@/hooks/useIcebreakers";

export const useIcebreakersState = (currentProfile: Record<string, string>) => {
  const [persistedIcebreakers, setPersistedIcebreakers] = useState<string[]>([]);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const { clearAllIcebreakers } = useIcebreakers();

  const handleIcebreakersUpdate = (icebreakers: string[]) => {
    console.log('Updating icebreakers in useIcebreakersState:', icebreakers);
    setPersistedIcebreakers(icebreakers);
  };

  const clearIcebreakers = useCallback(() => {
    console.log('Clearing icebreakers state in useIcebreakersState');
    setPersistedIcebreakers([]);
    clearAllIcebreakers();
  }, [clearAllIcebreakers]);

  // Clear icebreakers when profile changes
  useEffect(() => {
    if (!currentProfile || Object.keys(currentProfile).length === 0) {
      console.log('Profile is empty, clearing icebreakers');
      clearIcebreakers();
    }
  }, [currentProfile, clearIcebreakers]);

  return {
    persistedIcebreakers,
    isFirstTime,
    setIsFirstTime,
    handleIcebreakersUpdate,
    clearIcebreakers,
  };
};