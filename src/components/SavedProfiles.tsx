import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SavedProfilesProps {
  onSelectProfile: (profile: any) => void;
}

export const SavedProfiles: React.FC<SavedProfilesProps> = ({ onSelectProfile }) => {
  const { toast } = useToast();

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

  const handleDeleteProfile = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4">
      {profiles?.map((profile) => (
        <div
          key={profile.id}
          className="flex items-center justify-between p-3 bg-[#2D4531] rounded-lg"
        >
          <span
            className="text-[#EDEDDD] cursor-pointer flex-grow"
            onClick={() => onSelectProfile(profile)}
          >
            {profile.profile_name}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSelectProfile(profile)}
              className="text-[#EDEDDD] hover:bg-[#1A2A1D]"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteProfile(profile.id)}
              className="text-[#EDEDDD] hover:bg-[#1A2A1D]"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};