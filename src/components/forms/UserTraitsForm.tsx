import React from "react";
import { Input } from "../ui/input";
import { questions } from "@/utils/questions";
import { placeholders } from "@/utils/placeholders";

interface UserTraitsFormProps {
  userProfile: Record<string, string>;
  onUpdate: (field: string, value: string) => void;
  includeRelationship?: boolean;
}

export const UserTraitsForm: React.FC<UserTraitsFormProps> = ({ 
  userProfile, 
  onUpdate,
  includeRelationship = true 
}) => {
  return (
    <div className="space-y-4">
      {questions.userTraits
        .filter(field => includeRelationship || field.id !== 'relationship')
        .map((field) => {
          const placeholder = placeholders.userTraits.find(p => p.id === field.id);
          return (
            <div key={field.id}>
              <label className="block text-[#E5D4BC] mb-1 text-left text-[15px]">{field.text}</label>
              <Input
                type="text"
                value={userProfile[field.id] || ''}
                onChange={(e) => onUpdate(field.id, e.target.value)}
                className="bg-[#E5D4BC] text-[#1A2A1D] border-[#E5D4BC] placeholder-[#1A2A1D]/50 placeholder:text-xs [&:not(:placeholder-shown)]:text-[14px]"
                placeholder={placeholder?.examples}
              />
            </div>
          );
        })}
    </div>
  );
};