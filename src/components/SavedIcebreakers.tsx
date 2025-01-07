import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { IcebreakerListItem } from "./icebreakers/IcebreakerListItem";
import { useIcebreakersList } from "./icebreakers/useIcebreakersList";
import { LoadingDots } from "./ui/loading-dots";

interface SavedIcebreakersProps {
  onBack: () => void;
}

export const SavedIcebreakers: React.FC<SavedIcebreakersProps> = ({ onBack }) => {
  const {
    messages,
    selectedMessages,
    handleDeleteSelected,
    toggleMessageSelection,
    isLoading,
  } = useIcebreakersList();

  return (
    <section className="space-y-4 max-w-2xl mx-auto px-4 md:px-6">
      <div className="section-header">
        <header className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-[#303D24] dark:text-[#E5D4BC] hover:bg-transparent hover:text-[#303D24] dark:hover:text-[#E5D4BC]"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-[18px] font-bold text-[#303D24] dark:text-[#E5D4BC]">
            Saved Icebreakers
          </h1>
        </header>

        {selectedMessages.size > 0 && (
          <div className="px-4">
            <Button
              onClick={handleDeleteSelected}
              className="bg-[#47624B] text-[#E5D4BC] hover:bg-[#2D4531] px-2 py-1 rounded-md text-xs h-6 text-[11px]"
            >
              Delete Selected ({selectedMessages.size})
            </Button>
          </div>
        )}
      </div>

      <div className="content-section space-y-2 px-4">
        {isLoading ? (
          <LoadingDots />
        ) : (
          <>
            {messages?.map((message) => (
              <IcebreakerListItem
                key={message.id}
                message={message}
                isSelected={selectedMessages.has(message.id)}
                onToggleSelection={toggleMessageSelection}
              />
            ))}

            {messages?.length === 0 && (
              <p className="text-center text-[#47624B] dark:text-[#E5D4BC]">
                No saved icebreakers yet.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
};