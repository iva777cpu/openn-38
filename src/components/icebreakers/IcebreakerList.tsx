import React from "react";
import { IcebreakerItem } from "./IcebreakerItem";
import { useExplanations } from "./useExplanations";
import { useReporting } from "./useReporting";

interface IcebreakerListProps {
  icebreakers: string[];
  savedIcebreakers: Set<string>;
  onToggleSave: (icebreaker: string, explanation?: string) => void;
}

export const IcebreakerList: React.FC<IcebreakerListProps> = ({
  icebreakers,
  savedIcebreakers,
  onToggleSave,
}) => {
  const { reportedMessages, handleReport } = useReporting();
  const { explanations, generateExplanation, clearExplanations } = useExplanations(savedIcebreakers);

  // Clear explanations when icebreakers change
  React.useEffect(() => {
    if (icebreakers.length === 0) {
      clearExplanations();
    }
  }, [icebreakers]);

  if (icebreakers.length === 0) return null;

  return (
    <div className="space-y-2">
      {icebreakers.map((icebreaker, index) => (
        <IcebreakerItem
          key={index}
          icebreaker={icebreaker}
          explanation={explanations[icebreaker]?.text || ''}
          isSelected={savedIcebreakers.has(icebreaker)}
          isReported={reportedMessages.has(icebreaker)}
          isExplanationLoading={explanations[icebreaker]?.loading || false}
          isExplanationGenerated={explanations[icebreaker]?.generated || false}
          onToggleSave={() => onToggleSave(icebreaker, explanations[icebreaker]?.text)}
          onGenerateExplanation={() => generateExplanation(icebreaker, (explanation) => {
            if (savedIcebreakers.has(icebreaker)) {
              onToggleSave(icebreaker, explanation);
            }
          })}
          onReport={() => handleReport(icebreaker, explanations[icebreaker]?.text)}
        />
      ))}
    </div>
  );
};