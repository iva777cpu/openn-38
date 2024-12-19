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
    <div className="py-4 bg-[#EDEDDD] dark:bg-[#2D4531]">
      <Input
        placeholder="Enter profile name"
        value={profileName}
        onChange={onChange}
        className="!bg-[#47624B] dark:!bg-[#47624B] !text-[#EDEDDD] !border !border-[#1A2A1D] dark:!border-[#EDEDDD] placeholder:!text-[#EDEDDD]/70 focus:!ring-[0.5px] focus:!ring-[#1A2A1D] dark:focus:!ring-[#EDEDDD] focus:!outline-none !px-3 !py-2"
      />
    </div>
  );
};