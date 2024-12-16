import React from "react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

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
  return (
    <div className="space-y-6 w-full max-w-md mx-auto p-4">
      <Card className="p-4 bg-secondary text-foreground">
        <h2 className="text-lg font-semibold mb-4">About You</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">How old are you?</label>
            <Input
              type="number"
              value={userProfile.userAge}
              onChange={(e) => onUpdate("userAge", e.target.value)}
              className="bg-accent text-foreground"
              placeholder="Your age"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">What's your gender?</label>
            <Input
              type="text"
              value={userProfile.userGender}
              onChange={(e) => onUpdate("userGender", e.target.value)}
              className="bg-accent text-foreground"
              placeholder="Your gender"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-secondary text-foreground">
        <h2 className="text-lg font-semibold mb-4">About Them</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">How old are they?</label>
            <Input
              type="number"
              value={userProfile.targetAge}
              onChange={(e) => onUpdate("targetAge", e.target.value)}
              className="bg-accent text-foreground"
              placeholder="Their age"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">What's their gender?</label>
            <Input
              type="text"
              value={userProfile.targetGender}
              onChange={(e) => onUpdate("targetGender", e.target.value)}
              className="bg-accent text-foreground"
              placeholder="Their gender"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};