import React from "react";

export const LoadingDots = () => {
  return (
    <div className="flex items-center justify-center space-x-2 h-40">
      <div className="w-3 h-3 rounded-full bg-[#47624B] dark:bg-[#EDEDDD] animate-[bounce_1.4s_cubic-bezier(0.4,0,0.6,1)_infinite_0ms]"></div>
      <div className="w-3 h-3 rounded-full bg-[#47624B] dark:bg-[#EDEDDD] animate-[bounce_1.4s_cubic-bezier(0.4,0,0.6,1)_infinite_200ms]"></div>
      <div className="w-3 h-3 rounded-full bg-[#47624B] dark:bg-[#EDEDDD] animate-[bounce_1.4s_cubic-bezier(0.4,0,0.6,1)_infinite_400ms]"></div>
    </div>
  );
};