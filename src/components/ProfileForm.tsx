import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "./ui/checkbox";
import { UserTraitsForm } from "./forms/UserTraitsForm";
import { TargetTraitsForm } from "./forms/TargetTraitsForm";
import { GeneralInfoForm } from "./forms/GeneralInfoForm";
import { questions } from "@/utils/questions";
import { BookmarkPlus } from "lucide-react"; // Added missing import

interface ProfileFormProps {
  userProfile: Record<string, string>;
  onUpdate: (field: string, value: string) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ userProfile, onUpdate }) => {
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  const generateIcebreakers = async () => {
    setIsLoading(true);
    try {
      const filledFields = Object.entries(userProfile)
        .filter(([_, value]) => value && value.toString().trim() !== '')
        .reduce((acc, [key, value]) => {
          const question = [...questions.userTraits, ...questions.targetTraits, ...questions.generalInfo]
            .find(q => q.id === key);
          
          if (question) {
            return {
              ...acc,
              [key]: {
                value,
                prompt: question.prompt,
                temperature: question.temperature
              }
            };
          }
          return acc;
        }, {});

      const { data, error } = await supabase.functions.invoke('generate-icebreaker', {
        body: { 
          answers: filledFields,
          isFirstTime,
          temperature: 0.9
        }
      });

      if (error) throw error;
      
      setIcebreakers(data.icebreakers.split(/\d+\./).filter(Boolean).map((text: string) => text.trim()));
    } catch (error) {
      console.error('Error generating icebreakers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveIcebreaker = async (icebreaker: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('saved_messages')
        .insert([{ user_id: user.id, message_text: icebreaker }]);

      if (error) throw error;

      console.log('Icebreaker saved successfully');
    } catch (error) {
      console.error('Error saving icebreaker:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center space-x-2 mb-4 justify-start">
        <Checkbox 
          id="firstTime" 
          checked={isFirstTime}
          onCheckedChange={(checked) => setIsFirstTime(checked as boolean)}
          className="bg-[#EDEDDD] text-[#1A2A1D] border-[#EDEDDD]"
        />
        <label 
          htmlFor="firstTime"
          className="text-[#EDEDDD] text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          First time approaching this person?
        </label>
      </div>

      <Card className="p-4 bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD] mb-6">
        <h2 className="text-lg font-semibold mb-4 text-left">About You</h2>
        <UserTraitsForm userProfile={userProfile} onUpdate={onUpdate} />
      </Card>

      <Card className="p-4 bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD] mb-6">
        <h2 className="text-lg font-semibold mb-4 text-left">About Them</h2>
        <TargetTraitsForm userProfile={userProfile} onUpdate={onUpdate} />
      </Card>

      <Card className="p-4 bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD] mb-6">
        <h2 className="text-lg font-semibold mb-4 text-left">General Information</h2>
        <GeneralInfoForm userProfile={userProfile} onUpdate={onUpdate} />
      </Card>

      <Card className="p-4 bg-[#2D4531] text-[#EDEDDD] border-[#EDEDDD]">
        <h2 className="text-lg font-semibold mb-4 text-left">Ice Breakers</h2>
        <Button 
          onClick={generateIcebreakers} 
          disabled={isLoading}
          className="w-full mb-4 bg-[#1A2A1D] text-[#EDEDDD] hover:bg-[#2D4531]"
        >
          {isLoading ? "Generating..." : "Generate Ice Breakers"}
        </Button>
        {icebreakers.length > 0 && (
          <div className="space-y-4">
            {icebreakers.map((icebreaker, index) => (
              <div key={index} className="p-4 bg-[#2D4531] rounded-md flex justify-between items-start">
                <span>{icebreaker}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => saveIcebreaker(icebreaker)}
                  className="ml-2 text-[#EDEDDD] hover:bg-[#1A2A1D]"
                >
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};