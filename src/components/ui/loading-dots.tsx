import React from "react";

export const LoadingDots = () => {
  return (
    <div className="flex justify-center items-center space-x-1 py-4">
      {[1, 2, 3].map((dot) => (
        <div
          key={dot}
          className={`w-2 h-2 rounded-full bg-[#47624B] dark:bg-[#EDEDDD] animate-[pulse_1.5s_ease-in-out_infinite]`}
          style={{
            animationDelay: `${(dot - 1) * 0.2}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
};