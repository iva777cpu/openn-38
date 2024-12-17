import React, { useState } from "react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "./ui/checkbox";

interface ProfileFormProps {
  userProfile: {
    userAge: string;
    userGender: string;
    targetAge: string;
    targetGender: string;
  };
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
      const { data, error } = await supabase.functions.invoke('generate-icebreaker', {
        body: { userProfile, temperature: 0.7, isFirstTime }
      });

      if (error) throw error;
      
      // Split the response into an array of individual icebreakers
      const icebreakerArray = data.icebreakers
        .split(/\d+\./)
        .filter(Boolean)
        .map((text: string) => text.trim());
      
      setIcebreakers(icebreakerArray);
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

  return (
    <div className="space-y-6 w-full max-w-md mx-auto p-4">
      <div className="flex items-center space-x-2 mb-4">
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

      <Card className="p-4 bg-[#303D24] text-[#EDEDDD] border-[#EDEDDD]">
        <h2 className="text-lg font-semibold mb-4 text-left">About You</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[#EDEDDD] mb-1 text-left">How old are you?</label>
            <Input
              type="number"
              value={userProfile.userAge}
              onChange={(e) => onUpdate("userAge", e.target.value)}
              className="bg-[#EDEDDD] text-[#1A2A1D] border-[#EDEDDD] placeholder-[#1A2A1D]"
              placeholder="Your age"
            />
          </div>
          <div>
            <label className="block text-[#EDEDDD] mb-1 text-left">What's your gender?</label>
            <Input
              type="text"
              value={userProfile.userGender}
              onChange={(e) => onUpdate("userGender", e.target.value)}
              className="bg-[#EDEDDD] text-[#1A2A1D] border-[#EDEDDD] placeholder-[#1A2A1D]"
              placeholder="Your gender"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-[#303D24] text-[#EDEDDD] border-[#EDEDDD]">
        <h2 className="text-lg font-semibold mb-4 text-left">About Them</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[#EDEDDD] mb-1 text-left">How old are they?</label>
            <Input
              type="number"
              value={userProfile.targetAge}
              onChange={(e) => onUpdate("targetAge", e.target.value)}
              className="bg-[#EDEDDD] text-[#1A2A1D] border-[#EDEDDD] placeholder-[#1A2A1D]"
              placeholder="Their age"
            />
          </div>
          <div>
            <label className="block text-[#EDEDDD] mb-1 text-left">What's their gender?</label>
            <Input
              type="text"
              value={userProfile.targetGender}
              onChange={(e) => onUpdate("targetGender", e.target.value)}
              className="bg-[#EDEDDD] text-[#1A2A1D] border-[#EDEDDD] placeholder-[#1A2A1D]"
              placeholder="Their gender"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-[#303D24] text-[#EDEDDD] border-[#EDEDDD]">
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
              <div key={index} className="p-4 bg-[#2D4531] rounded-md">
                {icebreaker}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};