import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MainLayoutHeaderProps {
  onNewProfile: () => void;
  onSaveProfile: () => void;
  onViewSavedMessages: () => void;
  onViewProfiles: () => void;
}

export const MainLayoutHeader = ({
  onNewProfile,
  onSaveProfile,
  onViewSavedMessages,
  onViewProfiles,
}: MainLayoutHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Profile Manager</h1>
      <div className="flex gap-2">
        <button onClick={onNewProfile}>New Profile</button>
        <button onClick={onSaveProfile}>Save Profile</button>
        <button onClick={onViewSavedMessages}>Saved Messages</button>
        <button onClick={onViewProfiles}>View Profiles</button>
      </div>
    </div>
  );
};