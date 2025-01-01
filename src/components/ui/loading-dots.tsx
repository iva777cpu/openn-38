import React from "react";

export const LoadingDots = () => {
  return (
    <div className="flex justify-center space-x-2 p-4">
      <div className="w-2 h-2 rounded-full bg-[#47624B] dark:bg-[#EDEDDD] animate-[bounce_1s_infinite_0ms]"></div>
      <div className="w-2 h-2 rounded-full bg-[#47624B] dark:bg-[#EDEDDD] animate-[bounce_1s_infinite_200ms]"></div>
      <div className="w-2 h-2 rounded-full bg-[#47624B] dark:bg-[#EDEDDD] animate-[bounce_1s_infinite_400ms]"></div>
    </div>
  );
};