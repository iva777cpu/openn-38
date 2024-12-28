import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Edit2, Trash2, ArrowLeft, Save } from "lucide-react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

interface SavedProfilesProps {
  onSelectProfile: (profile: any) => void;
  onBack: () => void;
}

export const SavedProfiles: React.FC<SavedProfilesProps> = ({ onSelectProfile, onBack }) => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [selectedProfiles, setSelectedProfiles] = useState<Set<string>>(new Set());

  const { data: profiles, refetch } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data;
    },
  });

  const getUniqueProfileName = async (userId: string, baseName: string, currentId: string) => {
    let finalName = baseName;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const { data } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", userId)
        .eq("profile_name", finalName)
        .neq("id", currentId)
        .maybeSingle();

      if (!data) {
        isUnique = true;
      } else {
        finalName = `${baseName}_${counter}`;
        counter++;
      }
    }

    return finalName;
  };

  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const uniqueName = await getUniqueProfileName(user.id, name, id);
      console.log("Generated unique profile name for update:", uniqueName);

      const { error } = await supabase
        .from("user_profiles")
        .update({ profile_name: uniqueName })
        .eq("id", id);

      if (error) throw error;
      return uniqueName;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      setEditingId(null);
    },
    onError: (error) => {
      console.error("Failed to update profile name:", error);
    },
  });

  const handleDeleteSelected = async () => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .in("id", Array.from(selectedProfiles));

      if (error) throw error;

      console.log("Selected profiles deleted successfully");
      setSelectedProfiles(new Set());
      refetch();
    } catch (error) {
      console.error("Failed to delete profiles:", error);
    }
  };

  const toggleProfileSelection = (id: string) => {
    const newSelected = new Set(selectedProfiles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProfiles(newSelected);
  };

  const handleSaveProfileName = async () => {
    if (editingId && editingName.trim()) {
      await updateProfileMutation.mutateAsync({
        id: editingId,
        name: editingName.trim(),
      });
    }
  };

  const startEditing = (profile: any) => {
    setEditingId(profile.id);
    setEditingName(profile.profile_name);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-[#1A2A1D] dark:text-[#EDEDDD] hover:bg-[#2D4531] mr-4"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-[#1A2A1D] dark:text-[#EDEDDD]">Profiles</h1>
        </div>
        {selectedProfiles.size > 0 && (
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete Selected ({selectedProfiles.size})
          </Button>
        )}
      </div>

      {profiles?.map((profile) => (
        <div
          key={profile.id}
          className="flex items-center justify-between p-3 bg-[#47624B] dark:bg-[#2D4531] rounded-lg"
        >
          <div className="flex items-center gap-3 flex-grow">
            <Checkbox
              checked={selectedProfiles.has(profile.id)}
              onCheckedChange={() => toggleProfileSelection(profile.id)}
              className="border-[#EDEDDD]"
            />
            {editingId === profile.id ? (
              <div className="flex items-center gap-2 flex-grow">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="bg-[#EDEDDD] text-[#47624B] dark:bg-[#303D24] dark:text-[#EDEDDD] border-[#1A2A1D]"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveProfileName}
                  className="text-[#EDEDDD] hover:bg-[#1A2A1D]"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <span
                className="text-[#EDEDDD] cursor-pointer flex-grow"
                onClick={() => onSelectProfile(profile)}
              >
                {profile.profile_name}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => startEditing(profile)}
              className="text-[#EDEDDD] hover:bg-[#1A2A1D]"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
