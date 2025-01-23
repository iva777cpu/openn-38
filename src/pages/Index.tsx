import { useAuthCheck } from "@/hooks/useAuthCheck";
import { MainLayout } from "@/components/layout/MainLayout";

interface IndexProps {
  onDeleteAccount: () => Promise<void>;
  onSignOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export default function Index({ onDeleteAccount, onSignOut, isAuthenticated }: IndexProps) {
  return <MainLayout onDeleteAccount={onDeleteAccount} onSignOut={onSignOut} isAuthenticated={isAuthenticated} />;
}