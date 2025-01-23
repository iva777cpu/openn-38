import { supabase } from "@/integrations/supabase/client";

export const getUniqueProfileName = async (userId: string, baseName: string, currentId: string) => {
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