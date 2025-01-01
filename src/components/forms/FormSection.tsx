import React from "react";
import { Card } from "../ui/card";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <Card className="w-full p-3 bg-[#47624B] dark:bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD]">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </Card>
  );
};