import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, Shield, Palette, Download, Loader2 } from 'lucide-react';
import { getFirebaseSubmissions } from '@/lib/firebaseSubmissionsService';
import { getFirebaseSettings, saveFirebaseSettings, AppSettings } from '@/lib/firebaseSettingsService';
import * as XLSX from 'xlsx';

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [instantAlerts, setInstantAlerts] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [notificationEmail, setNotificationEmail] = useState("kdmistryinteriors@yahoo.com");
  
  const [statusLabels, setStatusLabels] = useState({
    new: "New",
    replied: "Replied",
    archived: "Archived"
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getFirebaseSettings();
        setEmailNotifications(settings.emailNotifications);
        setInstantAlerts(settings.instantAlerts);
        setDailyDigest(settings.dailyDigest);
        setNotificationEmail(settings.notificationEmail);
        
        setStatusLabels(settings.statusLabels);
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveFirebaseSettings({
        emailNotifications,
        instantAlerts,
        dailyDigest,
        notificationEmail,
        
        statusLabels
      });
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const submissions = await getFirebaseSubmissions();
      
      const exportData = submissions.map(s => ({
        'Date': s.submittedAt.toLocaleDateString(),
        'Name': s.name,
        'Email': s.email,
        'Phone': s.phone,
        'Project Type': s.projectType,
        'Budget Range': s.budgetRange,
        'Status': s.status,
        'Project Details': s.projectDetails,
        'Notes': s.notes || ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
      
      XLSX.writeFile(workbook, `submissions_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast({
        title: "Export successful",
        description: `Exported ${submissions.length} submissions to Excel`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h2 className="font-display text-xl sm:text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your dashboard preferences</p>
      </div>

      {/* Notifications */}
      <div className="card-elevated p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-semibold">Notifications</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Configure how you receive alerts</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Label htmlFor="email-notifications" className="font-medium text-sm">Email Notifications</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch 
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Label htmlFor="instant-alerts" className="font-medium text-sm">Instant Alerts</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">Get notified immediately for new submissions</p>
            </div>
            <Switch 
              id="instant-alerts"
              checked={instantAlerts}
              onCheckedChange={setInstantAlerts}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Label htmlFor="daily-digest" className="font-medium text-sm">Daily Digest</Label>
              <p className="text-xs sm:text-sm text-muted-foreground">Receive a summary every morning</p>
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
      <div className="card-elevated p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-semibold">Email Settings</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Configure email recipients</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notification-email" className="text-sm">Notification Email</Label>
            <Input 
              id="notification-email"
              type="email"
              placeholder="you@example.com"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* Status Labels */}
      <div className="card-elevated p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-semibold">Status Labels</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Customize submission statuses</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
            <Input 
              value={statusLabels.new} 
              onChange={(e) => setStatusLabels(prev => ({ ...prev, new: e.target.value }))}
              className="flex-1" 
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
            <Input 
              value={statusLabels.replied} 
              onChange={(e) => setStatusLabels(prev => ({ ...prev, replied: e.target.value }))}
              className="flex-1" 
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0" />
            <Input 
              value={statusLabels.archived} 
              onChange={(e) => setStatusLabels(prev => ({ ...prev, archived: e.target.value }))}
              className="flex-1" 
            />
          </div>
        </div>
      </div>

      {/* Data Export */}
      <div className="card-elevated p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Download className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-semibold">Data Export</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Export all submissions data</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Download all submissions data as an Excel file including contact details, project information, and notes.
          </p>
          <Button 
            onClick={handleExportExcel} 
            disabled={isExporting}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export to Excel
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pb-4">
        <Button onClick={handleSave} size="lg" className="w-full sm:w-auto" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
