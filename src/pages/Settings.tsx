import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, Shield, Palette } from 'lucide-react';

export default function Settings() {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [instantAlerts, setInstantAlerts] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="font-display text-2xl font-semibold">Settings</h2>
        <p className="text-muted-foreground mt-1">Manage your dashboard preferences</p>
      </div>

      {/* Notifications */}
      <div className="card-elevated p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Notifications</h3>
            <p className="text-sm text-muted-foreground">Configure how you receive alerts</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch 
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="instant-alerts" className="font-medium">Instant Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified immediately for new submissions</p>
            </div>
            <Switch 
              id="instant-alerts"
              checked={instantAlerts}
              onCheckedChange={setInstantAlerts}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="daily-digest" className="font-medium">Daily Digest</Label>
              <p className="text-sm text-muted-foreground">Receive a summary every morning</p>
            </div>
            <Switch 
              id="daily-digest"
              checked={dailyDigest}
              onCheckedChange={setDailyDigest}
            />
          </div>
        </div>
      </div>

      {/* Email Configuration */}
      <div className="card-elevated p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Email Settings</h3>
            <p className="text-sm text-muted-foreground">Configure email recipients</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notification-email">Notification Email</Label>
            <Input 
              id="notification-email"
              type="email"
              placeholder="you@example.com"
              defaultValue="kdmistryinteriors@yahoo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cc-email">CC Email (Optional)</Label>
            <Input 
              id="cc-email"
              type="email"
              placeholder="team@example.com"
            />
          </div>
        </div>
      </div>

      {/* Status Labels */}
      <div className="card-elevated p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Status Labels</h3>
            <p className="text-sm text-muted-foreground">Customize submission statuses</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <Input defaultValue="New" className="max-w-xs" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <Input defaultValue="Replied" className="max-w-xs" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <Input defaultValue="Archived" className="max-w-xs" />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="card-elevated p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold">Security</h3>
            <p className="text-sm text-muted-foreground">Account security settings</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Button variant="outline">Change Password</Button>
          <p className="text-xs text-muted-foreground">
            Last password change: Never
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
