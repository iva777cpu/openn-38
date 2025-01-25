import React from 'react';
import { Button } from "../ui/button";
import { BookmarkPlus, Flag, HelpCircle } from "lucide-react";

interface IcebreakerActionsProps {
  icebreaker: string;
  isSelected: boolean;
  isReported: boolean;
  isExplanationLoading: boolean;
  isExplanationGenerated: boolean;
  onToggleSave: () => void;
  onGenerateExplanation: () => void;
  onReport: () => void;
}

export const IcebreakerActions: React.FC<IcebreakerActionsProps> = ({
  icebreaker,
  isSelected,
  isReported,
  isExplanationLoading,
  isExplanationGenerated,
  onToggleSave,
  onGenerateExplanation,
  onReport,
}) => {
  return (
    <div className="flex flex-col gap-2 ml-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSave}
        className="hover:bg-[#1A2A1D] transition-all"
      >
        <BookmarkPlus 
          className={`h-4 w-4 ${
            isSelected 
              ? 'fill-[#E5D4BC] stroke-[#E5D4BC]' 
              : 'stroke-[#E5D4BC]'
          }`}
        />
      </Button>
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onGenerateExplanation}
          disabled={isExplanationGenerated || isReported}
          className={`hover:bg-[#1A2A1D] transition-all ${
            isExplanationGenerated 
              ? 'bg-[#1A2A1D]'
              : isReported
              ? 'opacity-50'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          {isExplanationLoading ? (
            <div className="h-4 w-4 animate-spin border-2 border-[#E5D4BC] border-t-transparent rounded-full" />
          ) : (
            <HelpCircle 
              className={`h-4 w-4 stroke-[#E5D4BC] transition-all ${
                isExplanationGenerated ? 'fill-[#E5D4BC]' : ''
              }`}
            />
          )}
        </Button>
      </div>
      <div className="flex flex-col items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReport}
          disabled={isReported}
          className={`hover:bg-[#1A2A1D] transition-all ${
            isReported
              ? 'bg-[#1A2A1D] opacity-100'
              : 'opacity-60 hover:opacity-100'
          }`}
        >
          <Flag 
            className={`h-4 w-4 ${
              isReported
                ? 'fill-[#E5D4BC] stroke-[#E5D4BC]'
                : 'stroke-[#E5D4BC]'
            }`}
          />
        </Button>
        {isReported && (
          <span className="text-[11px] text-[#E5D4BC] mt-1">reported</span>
        )}
      </div>
    </div>
  );
};