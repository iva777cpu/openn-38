import { useState, useEffect, useCallback } from "react";
import { useIcebreakers } from "@/hooks/useIcebreakers";

export const useIcebreakersState = (currentProfile: Record<string, string>) => {
  const [persistedIcebreakers, setPersistedIcebreakers] = useState<string[]>([]);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const { setIcebreakers } = useIcebreakers();

  const handleIcebreakersUpdate = (icebreakers: string[]) => {
    console.log('Updating icebreakers in useIcebreakersState:', icebreakers);
    setPersistedIcebreakers(icebreakers);
  };

  const clearIcebreakers = useCallback(() => {
    console.log('Clearing icebreakers state');
    setPersistedIcebreakers([]);
    setIcebreakers([]); // Clear icebreakers in the global state
  }, [setIcebreakers]);

  // Clear icebreakers when profile changes
  useEffect(() => {
    console.log('Profile changed or new profile created, clearing icebreakers');
    clearIcebreakers();
    setIsFirstTime(false);
  }, [currentProfile, clearIcebreakers]);

  return {
    persistedIcebreakers,
    isFirstTime,
    setIsFirstTime,
    handleIcebreakersUpdate,
    clearIcebreakers,
  };
};