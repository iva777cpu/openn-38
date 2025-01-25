import React from "react";
import { ProfileHeader } from "./profiles/ProfileHeader";
import { ProfileList } from "./profiles/ProfileList";
import { useProfileActions } from "./profiles/useProfileActions";
import { LoadingDots } from "./ui/loading-dots";

interface SavedProfilesProps {
  onSelectProfile: (profile: any) => void;
  onBack: () => void;
  onNewProfile: () => void;
}

export const SavedProfiles: React.FC<SavedProfilesProps> = ({ 
  onSelectProfile, 
  onBack,
  onNewProfile 
}) => {
  const {
    profiles,
    editingId,
    editingName,
    selectedProfiles,
    setEditingId,
    setEditingName,
    handleDeleteSelected,
    toggleProfileSelection,
    updateProfileMutation,
    isLoading,
  } = useProfileActions();

  const handleSaveProfileName = async () => {
    if (editingId && editingName.trim()) {
      await updateProfileMutation.mutateAsync({
        id: editingId,
        name: editingName.trim(),
      });
    }
  };

  return (
    <section className="space-y-4 max-w-2xl mx-auto px-4 md:px-6">
      <div className="section-header">
        <ProfileHeader
          selectedCount={selectedProfiles.size}
          onBack={onBack}
          onDeleteSelected={handleDeleteSelected}
        />
      </div>

      <div className="px-2">
        {isLoading ? (
          <LoadingDots />
        ) : (
          <ProfileList
            profiles={profiles || []}
            editingId={editingId}
            editingName={editingName}
            selectedProfiles={selectedProfiles}
            onEdit={(profile) => {
              setEditingId(profile.id);
              setEditingName(profile.profile_name);
            }}
            onSave={handleSaveProfileName}
            onSelect={toggleProfileSelection}
            onProfileSelect={onSelectProfile}
            onEditNameChange={setEditingName}
          />
        )}
      </div>
    </section>
  );
};