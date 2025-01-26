import React, { useEffect } from "react";
import { useIcebreakersState } from "./useIcebreakersState";

interface ProfileStateManagerProps {
  currentProfile: Record<string, string>;
  children: React.ReactNode;
  showProfiles: boolean;
  showSavedIcebreakers: boolean;
}

export interface ProfileStateExtendedProps {
  isFirstTime: boolean;
  setIsFirstTime: (value: boolean) => void;
  persistedIcebreakers: string[];
  handleIcebreakersUpdate: (icebreakers: string[]) => void;
  clearIcebreakers: () => void;
}

export const ProfileStateManager: React.FC<ProfileStateManagerProps> = ({
  currentProfile,
  children,
  showProfiles,
  showSavedIcebreakers,
}) => {
  const {
    persistedIcebreakers,
    isFirstTime,
    setIsFirstTime,
    handleIcebreakersUpdate,
    clearIcebreakers,
  } = useIcebreakersState(currentProfile);

  // Log state changes
  useEffect(() => {
    console.log('--- ProfileStateManager State Change ---');
    console.log('Before localStorage values:', {
      currentProfile: localStorage.getItem('currentProfile'),
      currentIcebreakers: localStorage.getItem('currentIcebreakers'),
      currentExplanations: localStorage.getItem('currentExplanations'),
      theme: localStorage.getItem('theme')
    });
    
    // Reset scroll position when showing forms
    if (!showProfiles && !showSavedIcebreakers) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    // Return cleanup function that logs after state change
    return () => {
      console.log('After localStorage values:', {
        currentProfile: localStorage.getItem('currentProfile'),
        currentIcebreakers: localStorage.getItem('currentIcebreakers'),
        currentExplanations: localStorage.getItem('currentExplanations'),
        theme: localStorage.getItem('theme')
      });
    };
  }, [showProfiles, showSavedIcebreakers]);

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (currentProfile && Object.keys(currentProfile).length > 0) {
      console.log('Saving profile to localStorage:', currentProfile);
      localStorage.setItem('currentProfile', JSON.stringify(currentProfile));
    }
    
    // Log after state change
    console.log('After localStorage values:', {
      currentProfile: localStorage.getItem('currentProfile'),
      currentIcebreakers: localStorage.getItem('currentIcebreakers'),
      currentExplanations: localStorage.getItem('currentExplanations'),
      theme: localStorage.getItem('theme')
    });
  }, [currentProfile]);

  // Save icebreakers to localStorage
  useEffect(() => {
    if (persistedIcebreakers.length > 0) {
      console.log('Saving icebreakers to localStorage:', persistedIcebreakers);
      localStorage.setItem('currentIcebreakers', JSON.stringify(persistedIcebreakers));
    }
    
    // Log after icebreakers change
    console.log('After icebreakers change:', {
      currentProfile: localStorage.getItem('currentProfile'),
      currentIcebreakers: localStorage.getItem('currentIcebreakers'),
      currentExplanations: localStorage.getItem('currentExplanations'),
      theme: localStorage.getItem('theme')
    });
  }, [persistedIcebreakers]);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...child.props,
        isFirstTime,
        setIsFirstTime,
        persistedIcebreakers,
        handleIcebreakersUpdate,
        clearIcebreakers,
      } as React.PropsWithChildren<ProfileStateExtendedProps>);
    }
    return child;
  });

  return <>{childrenWithProps}</>;
};