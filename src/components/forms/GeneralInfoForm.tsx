import React from "react";
import { Input } from "../ui/input";
import { questions } from "@/utils/questions";

interface GeneralInfoFormProps {
  userProfile: Record<string, string>;
  onUpdate: (field: string, value: string) => void;
}

export const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({ userProfile, onUpdate }) => {
  return (
    <div className="space-y-4">
      {questions.generalInfo.map((field) => (
        <div key={field.id}>
          <label className="block text-[#EDEDDD] mb-1 text-left">{field.text}</label>
          <Input
            type="text"
            value={userProfile[field.id] || ''}
            onChange={(e) => onUpdate(field.id, e.target.value)}
            className="bg-[#EDEDDD] text-[#1A2A1D] border-[#EDEDDD] placeholder-[#1A2A1D]/50 text-xs"
            placeholder={field.examples || `Enter ${field.text.toLowerCase()}`}
          />
        </div>
      ))}
    </div>
  );
};