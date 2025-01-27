import React from "react";
import { Button } from "../ui/button";

interface GenerateButtonProps {
  isLoading: boolean;
  isAuthenticated: boolean;
  remainingGenerations: number;
  formattedResetTime: string;
  onClick: () => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  isLoading,
  isAuthenticated,
  remainingGenerations,
  formattedResetTime,
  onClick,
}) => {
  const isDisabled = isLoading || (isAuthenticated ? remainingGenerations <= 0 : remainingGenerations <= 0);

  return (
    <div>
      <Button 
        onClick={onClick} 
        disabled={isDisabled}
        className="w-full mb-1 bg-[#2D4531] text-[#E5D4BC] hover:bg-[#2D4531] border border-[#E5D4BC]"
      >
        {isLoading ? (
          <span className="flex items-center">
            Generating
            <span className="loading-dots ml-1 text-[8px]">...</span>
          </span>
        ) : (
          <>
            Generate Ice Breakers
            {isAuthenticated && ` (${remainingGenerations}/6)`}
          </>
        )}
      </Button>
      {isAuthenticated && (
        <div className="text-[11px] text-center text-[#E5D4BC] opacity-75">
          Your limit will reset at {formattedResetTime} GMT
        </div>
      )}
    </div>
  );
};