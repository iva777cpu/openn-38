import { useAuthCheck } from "@/hooks/useAuthCheck";
import { MainLayout } from "@/components/layout/MainLayout";

interface IndexProps {
  onDeleteAccount: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export default function Index({ onDeleteAccount, onSignOut }: IndexProps) {
  useAuthCheck();
  return <MainLayout onDeleteAccount={onDeleteAccount} onSignOut={onSignOut} />;
}