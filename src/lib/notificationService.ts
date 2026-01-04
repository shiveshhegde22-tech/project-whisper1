import { supabase } from "@/integrations/supabase/client";
import { getFirebaseSettings } from "@/lib/firebaseSettingsService";

interface SubmissionData {
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message?: string;
}

export const sendSubmissionNotification = async (submission: SubmissionData): Promise<boolean> => {
  try {
    // Get current settings
    const settings = await getFirebaseSettings();
    
    // Check if email notifications are enabled
    if (!settings.emailNotifications) {
      console.log("Email notifications are disabled");
      return false;
    }

    // Send notification email
    const { data, error } = await supabase.functions.invoke('send-notification-email', {
      body: {
        name: submission.name,
        email: submission.email,
        phone: submission.phone || '',
        projectType: submission.projectType || '',
        budget: submission.budget || '',
        message: submission.message || '',
        notificationEmail: settings.notificationEmail,
        ccEmail: settings.ccEmail || '',
        instantAlert: settings.instantAlerts
      }
    });

    if (error) {
      console.error("Error sending notification email:", error);
      return false;
    }

    console.log("Notification email sent successfully:", data);
    return true;
  } catch (error) {
    console.error("Error in sendSubmissionNotification:", error);
    return false;
  }
};
