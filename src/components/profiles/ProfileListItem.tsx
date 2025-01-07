import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Edit2, Save } from "lucide-react";

interface ProfileListItemProps {
  profile: any;
  editingId: string | null;
  editingName: string;
  selectedProfiles: Set<string>;
  onEdit: (profile: any) => void;
  onSave: () => void;
  onSelect: (id: string) => void;
  onEditNameChange: (value: string) => void;
  onProfileSelect: (profile: any) => void;
}

export const ProfileListItem: React.FC<ProfileListItemProps> = ({
  profile,
  editingId,
  editingName,
  selectedProfiles,
  onEdit,
  onSave,
  onSelect,
  onEditNameChange,
  onProfileSelect,
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-[#47624B] dark:bg-[#2D4531] rounded-lg border border-[#E5D4BC]">
      <div className="flex items-center gap-3 flex-grow">
        <Checkbox
          checked={selectedProfiles.has(profile.id)}
          onCheckedChange={() => onSelect(profile.id)}
          className="border-[#E5D4BC] bg-transparent"
        />
        {editingId === profile.id ? (
          <div className="flex items-center gap-2 flex-grow">
            <Input
              value={editingName}
              onChange={(e) => onEditNameChange(e.target.value)}
              className="bg-[#E5D4BC] text-[#47624B] border-[#E5D4BC] text-[15px]"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onSave}
              className="text-[#E5D4BC] hover:bg-[#1A2A1D]"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span
            className="text-[#E5D4BC] cursor-pointer flex-grow text-[15px]"
            onClick={() => onProfileSelect(profile)}
          >
            {profile.profile_name}
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(profile)}
        className="text-[#E5D4BC] hover:bg-[#1A2A1D]"
      >
        <Edit2 className="h-4 w-4" />
      </Button>
    </div>
  );
};