import React from "react";
import { Input } from "../ui/input";
import { questions } from "@/utils/questions";

interface UserTraitsFormProps {
  userProfile: Record<string, string>;
  onUpdate: (field: string, value: string) => void;
}

export const UserTraitsForm: React.FC<UserTraitsFormProps> = ({ userProfile, onUpdate }) => {
  return (
    <div className="space-y-4">
      {questions.userTraits.map((field) => (
        <div key={field.id}>
          <label className="block text-[#EDEDDD] mb-1 text-left">{field.text}</label>
          <Input
            type="text"
            value={userProfile[field.id] || ''}
            onChange={(e) => onUpdate(field.id, e.target.value)}
            className="bg-[#EDEDDD] text-[#1A2A1D] border-[#EDEDDD] placeholder-[#1A2A1D]"
            placeholder={`Enter ${field.text.toLowerCase()}`}
          />
        </div>
      ))}
    </div>
  );
};