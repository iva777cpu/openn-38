import React from "react";
import { Input } from "../ui/input";
import { questions } from "@/utils/questions";
import { placeholders } from "@/utils/placeholders";

interface TargetTraitsFormProps {
  userProfile: Record<string, string>;
  onUpdate: (field: string, value: string) => void;
}

export const TargetTraitsForm: React.FC<TargetTraitsFormProps> = ({ userProfile, onUpdate }) => {
  return (
    <div className="space-y-4">
      {questions.targetTraits.map((field) => {
        const placeholder = placeholders.targetTraits.find(p => p.id === field.id);
        return (
          <div key={field.id}>
            <label className="block text-[#E5D4BC] mb-1 text-left">{field.text}</label>
            <Input
              type="text"
              value={userProfile[field.id] || ''}
              onChange={(e) => onUpdate(field.id, e.target.value)}
              className="bg-[#E5D4BC] text-[#1A2A1D] border-[#E5D4BC] placeholder-[#1A2A1D]/50 text-base placeholder:text-xs"
              placeholder={placeholder?.examples}
              style={{
                fontSize: userProfile[field.id] ? '16px' : '12px'
              }}
            />
          </div>
        );
      })}
    </div>
  );
};