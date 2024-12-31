import { useState, useEffect, useCallback } from "react";
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
    console.log('Profile changed or new profile created, clearing icebreakers');
    clearIcebreakers();
  }, [currentProfile, clearIcebreakers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('useIcebreakersState unmounting, clearing state');
      clearIcebreakers();
    };
  }, [clearIcebreakers]);

  return {
    persistedIcebreakers,
    isFirstTime,
    setIsFirstTime,
    handleIcebreakersUpdate,
    clearIcebreakers,
  };
};