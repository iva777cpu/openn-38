import React from "react";
import { Input } from "./ui/input";

interface SaveProfileFormProps {
  profileName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SaveProfileForm: React.FC<SaveProfileFormProps> = ({
  profileName,
  onChange,
}) => {
  return (
    <div className="py-4">
      <Input
        placeholder="Enter profile name"
        value={profileName}
        onChange={onChange}
        className="bg-[#303D24] text-[#EDEDDD] border-[#1A2A1D]"
      />
    </div>
  );
};