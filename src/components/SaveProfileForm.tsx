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
    <div className="py-4 bg-[#E5D4BC] dark:bg-[#2D4531]">
      <Input
        placeholder="Enter profile name"
        value={profileName}
        onChange={onChange}
        className="!bg-[#47624B] dark:!bg-[#47624B] !text-[#E5D4BC] !border !border-[#1A2A1D] dark:!border-[#E5D4BC] placeholder:!text-[#E5D4BC]/70 focus:!ring-[0.5px] focus:!ring-[#1A2A1D] dark:focus:!ring-[#E5D4BC] focus:!outline-none !px-3 !py-2"
      />
    </div>
  );
};