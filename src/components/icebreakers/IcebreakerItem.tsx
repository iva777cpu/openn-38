import React from 'react';
import { IcebreakerActions } from './IcebreakerActions';

interface IcebreakerItemProps {
  icebreaker: string;
  explanation: string;
  isSelected: boolean;
  isReported: boolean;
  isExplanationLoading: boolean;
  isExplanationGenerated: boolean;
  onToggleSave: () => void;
  onGenerateExplanation: () => void;
  onReport: () => void;
}

export const IcebreakerItem: React.FC<IcebreakerItemProps> = ({
  icebreaker,
  explanation,
  isSelected,
  isReported,
  isExplanationLoading,
  isExplanationGenerated,
  onToggleSave,
  onGenerateExplanation,
  onReport,
}) => {
  return (
    <div className="p-4 bg-[#47624B] dark:bg-[#2D4531] rounded-md flex flex-col border border-[#E5D4BC]">
      <div className="flex justify-between items-start">
        <span className="text-[15px] text-[#E5D4BC]">{icebreaker}</span>
        <IcebreakerActions
          icebreaker={icebreaker}
          isSelected={isSelected}
          isReported={isReported}
          isExplanationLoading={isExplanationLoading}
          isExplanationGenerated={isExplanationGenerated}
          onToggleSave={onToggleSave}
          onGenerateExplanation={onGenerateExplanation}
          onReport={onReport}
        />
      </div>
      {explanation && (
        <p className="text-[13px] text-[#E5D4BC] mt-2 italic">
          {explanation}
        </p>
      )}
    </div>
  );
};