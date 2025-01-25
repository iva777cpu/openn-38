import React from "react";

interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center space-x-2 ${className || ''}`}>
      <div className="w-3 h-3 rounded-full bg-[#47624B] dark:bg-[#EDEDDD] animate-[bounce_1.4s_cubic-bezier(0.4,0,0.6,1)_infinite_0ms]"></div>
      <div className="w-3 h-3 rounded-full bg-[#47624B] dark:bg-[#EDEDDD] animate-[bounce_1.4s_cubic-bezier(0.4,0,0.6,1)_infinite_200ms]"></div>
      <div className="w-3 h-3 rounded-full bg-[#47624B] dark:bg-[#EDEDDD] animate-[bounce_1.4s_cubic-bezier(0.4,0,0.6,1)_infinite_400ms]"></div>
    </div>
  );
};