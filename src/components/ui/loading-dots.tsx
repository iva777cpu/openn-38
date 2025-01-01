import React from "react";

export const LoadingDots = () => {
  return (
    <div className="flex items-center justify-center space-x-1 h-24">
      <div className="w-2 h-2 rounded-full animate-[bounce_0.7s_infinite] bg-[#D6BCFA] dark:bg-[#1A1F2C]"></div>
      <div className="w-2 h-2 rounded-full animate-[bounce_0.7s_0.1s_infinite] bg-[#D6BCFA] dark:bg-[#1A1F2C]"></div>
      <div className="w-2 h-2 rounded-full animate-[bounce_0.7s_0.2s_infinite] bg-[#D6BCFA] dark:bg-[#1A1F2C]"></div>
    </div>
  );
};