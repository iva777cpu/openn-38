import { useProfileState } from "./useProfileState";
import { useProfileOperations } from "./useProfileOperations";

export const useProfileManagement = () => {
  const {
    currentProfile,
    originalProfile,
    selectedProfileId,
    selectedProfileName,
    setCurrentProfile,
    setOriginalProfile,
    setSelectedProfileId,
    setSelectedProfileName,
    handleUpdateProfile,
    handleNewProfile,
  } = useProfileState();

  const { handleSaveChanges, handleSelectProfile: selectProfile } = useProfileOperations();

  const handleSelectProfile = (profile: any) => {
    selectProfile(
      profile,
      setCurrentProfile,
      setOriginalProfile,
      setSelectedProfileId,
      setSelectedProfileName
    );
  };

  const saveChanges = async () => {
    await handleSaveChanges(selectedProfileId, currentProfile);
    setOriginalProfile(currentProfile);
  };

  const hasChanges = JSON.stringify(currentProfile) !== JSON.stringify(originalProfile);

  return {
    currentProfile,
    selectedProfileId,
    selectedProfileName,
    hasChanges,
    handleUpdateProfile,
    handleNewProfile,
    handleSelectProfile,
    handleSaveChanges: saveChanges,
  };
};