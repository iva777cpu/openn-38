import React from "react";
import { ProfileHeader } from "./profiles/ProfileHeader";
import { ProfileList } from "./profiles/ProfileList";
import { useProfileActions } from "./profiles/useProfileActions";

interface SavedProfilesProps {
  onSelectProfile: (profile: any) => void;
  onBack: () => void;
}

export const SavedProfiles: React.FC<SavedProfilesProps> = ({ onSelectProfile, onBack }) => {
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
    <section className="space-y-4">
      <div className="section-header">
        <ProfileHeader
          selectedCount={selectedProfiles.size}
          onBack={onBack}
          onDeleteSelected={handleDeleteSelected}
        />
      </div>

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
    </section>
  );
};