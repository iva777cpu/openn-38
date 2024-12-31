import React from "react";
import { ProfileListItem } from "./ProfileListItem";

interface ProfileListProps {
  profiles: any[];
  editingId: string | null;
  editingName: string;
  selectedProfiles: Set<string>;
  onEdit: (profile: any) => void;
  onSave: () => void;
  onSelect: (id: string) => void;
  onProfileSelect: (profile: any) => void;
  onEditNameChange: (name: string) => void;
}

export const ProfileList: React.FC<ProfileListProps> = ({
  profiles,
  editingId,
  editingName,
  selectedProfiles,
  onEdit,
  onSave,
  onSelect,
  onProfileSelect,
  onEditNameChange,
}) => {
  return (
    <div className="content-section space-y-2">
      {profiles?.map((profile) => (
        <ProfileListItem
          key={profile.id}
          profile={profile}
          editingId={editingId}
          editingName={editingName}
          selectedProfiles={selectedProfiles}
          onEdit={onEdit}
          onSave={onSave}
          onSelect={onSelect}
          onProfileSelect={onProfileSelect}
          onEditNameChange={onEditNameChange}
        />
      ))}
    </div>
  );
};