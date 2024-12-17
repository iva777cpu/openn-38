import React, { useState } from "react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "./ui/checkbox";
import { questions } from "@/utils/questions";
import { BookmarkPlus } from "lucide-react";

interface ProfileFormProps {
  userProfile: Record<string, string>;
  onUpdate: (field: string, value: string) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ userProfile, onUpdate }) => {
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const { toast } = useToast();

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
      toast({
        title: "Error",
        description: "Failed to generate icebreakers. Please try again.",
        variant: "destructive",
      });
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

      toast({
        title: "Success",
        description: "Icebreaker saved successfully",
      });
    } catch (error) {
      console.error('Error saving icebreaker:', error);
      toast({
        title: "Error",
        description: "Failed to save icebreaker",
        variant: "destructive",
      });
    }
  };

  const renderInputs = (fields: typeof questions.userTraits, title: string) => (
    <Card className="p-4 bg-[#303D24] text-[#EDEDDD] border-[#EDEDDD] mb-6 w-full">
      <h2 className="text-lg font-semibold mb-4 text-left">{title}</h2>
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block text-[#EDEDDD] mb-1 text-left">{field.text}</label>
            <Input
              type="text"
              value={userProfile[field.id] || ''}
              onChange={(e) => onUpdate(field.id, e.target.value)}
              className="bg-[#EDEDDD] text-[#1A2A1D] border-[#EDEDDD] placeholder-[#1A2A1D] w-full"
              placeholder={`Enter ${field.text.toLowerCase()}`}
            />
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto px-4 pt-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#EDEDDD]">Openera</h1>
      <div className="flex items-center space-x-2 mb-4 justify-start">
        <Checkbox 
          id="firstTime" 
          checked={isFirstTime}
          onCheckedChange={(checked) => setIsFirstTime(checked as boolean)}
          className="bg-[#EDEDDD] text-[#1A2A1D] border-[#EDEDDD]"
        />
        <label 
          htmlFor="firstTime"
          className="text-[#EDEDDD] text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left"
        >
          First time approaching this person?
        </label>
      </div>

      {renderInputs(questions.userTraits, "About You")}
      {renderInputs(questions.targetTraits, "About Them")}
      {renderInputs(questions.generalInfo, "General Information")}

      <Card className="p-4 bg-[#303D24] text-[#EDEDDD] border-[#EDEDDD] w-full">
        <h2 className="text-lg font-semibold mb-4 text-left">Ice Breakers</h2>
        <Button 
          onClick={generateIcebreakers} 
          disabled={isLoading}
          className="w-full mb-4 bg-[#EDEDDD] text-[#303D24] hover:bg-[#2D4531] hover:text-[#EDEDDD]"
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