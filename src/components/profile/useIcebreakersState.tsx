import { useState, useEffect, useCallback } from "react";
import { useIcebreakers } from "@/hooks/useIcebreakers";

export const useIcebreakersState = (currentProfile: Record<string, string>) => {
  const [persistedIcebreakers, setPersistedIcebreakers] = useState<string[]>(() => {
    const saved = localStorage.getItem('currentIcebreakers');
    return saved ? JSON.parse(saved) : [];
  });
  const [isFirstTime, setIsFirstTime] = useState(false);
  const { clearAllIcebreakers } = useIcebreakers();

  const handleIcebreakersUpdate = (icebreakers: string[]) => {
    console.log('Updating icebreakers in useIcebreakersState:', icebreakers);
    setPersistedIcebreakers(icebreakers);
    localStorage.setItem('currentIcebreakers', JSON.stringify(icebreakers));
  };

  const clearIcebreakers = useCallback(() => {
    console.log('Clearing icebreakers state in useIcebreakersState');
    setPersistedIcebreakers([]);
    clearAllIcebreakers();
    localStorage.removeItem('currentIcebreakers');
  }, [clearAllIcebreakers]);

  return {
    persistedIcebreakers,
    isFirstTime,
    setIsFirstTime,
    handleIcebreakersUpdate,
    clearIcebreakers,
  };
};