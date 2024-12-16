import React, { useState } from "react";
import { ProfileForm } from "@/components/ProfileForm";
import { SideMenu } from "@/components/SideMenu";
import { useToast } from "@/components/ui/use-toast";

const emptyProfile = {
  userAge: "",
  userGender: "",
  targetAge: "",
  targetGender: "",
};

const Index = () => {
  const [currentProfile, setCurrentProfile] = useState(emptyProfile);
  const { toast } = useToast();

  const handleUpdateProfile = (field: string, value: string) => {
    setCurrentProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewProfile = () => {
    setCurrentProfile(emptyProfile);
    toast({
      title: "New Profile Created",
      description: "Start filling out the form for your new profile.",
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Saved",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleViewSavedMessages = () => {
    toast({
      title: "Coming Soon",
      description: "Saved messages feature will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SideMenu
        onNewProfile={handleNewProfile}
        onSaveProfile={handleSaveProfile}
        onViewSavedMessages={handleViewSavedMessages}
      />
      <main className="container mx-auto pt-16 pb-8">
        <h1 className="text-2xl font-bold text-center mb-8">Openera</h1>
        <ProfileForm userProfile={currentProfile} onUpdate={handleUpdateProfile} />
      </main>
    </div>
  );
};

export default Index;