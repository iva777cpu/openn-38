import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrivacyPolicyDialog: React.FC<PrivacyPolicyDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#E5D4BC] dark:bg-[#2D4531] text-[#1A2A1D] dark:text-[#E5D4BC] border-[#1A2A1D] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-[13px]">
          <section>
            <h3 className="font-semibold mb-2">1. Information We Collect</h3>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email address (for authentication)</li>
              <li>Profile information (age, gender, and other details you choose to provide)</li>
              <li>User preferences (theme settings)</li>
              <li>Saved messages and icebreakers</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">2. How We Use Your Information</h3>
            <p>Your information is used solely for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Providing and improving our icebreaker generation service</li>
              <li>Maintaining your user profile and preferences</li>
              <li>Authentication and account management</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">3. Data Security</h3>
            <p>We protect your data through:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Secure HTTPS encryption for all data transmission</li>
              <li>Encrypted data storage with Supabase</li>
              <li>Row-level security policies</li>
              <li>Regular security updates and monitoring</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2">4. Data Sharing</h3>
            <p>We do not sell or share your personal data with third parties. Your data is only used within our application to provide you with the service.</p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">5. Account Deletion</h3>
            <p>You can delete your account and all associated data at any time through the menu option in the app. Upon deletion, we remove all your personal information, saved messages, and profile data permanently.</p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">6. Contact Information</h3>
            <p>For privacy-related inquiries, please contact us at:</p>
            <p>Email: support@yourdomain.com</p>
          </section>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#47624B] text-[#E5D4BC] hover:bg-[#2D4531] dark:bg-[#E5D4BC] dark:text-[#2D4531] dark:hover:bg-[#E5D4BC]/90"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};