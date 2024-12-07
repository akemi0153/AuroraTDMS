import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function SettingsContent({ theme, accentColor, onThemeChange, onAccentColorChange }) {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [browserNotifications, setBrowserNotifications] = useState(false);

  const handleTwoFactorAuth = () => {
    console.log("Enabling Two-Factor Authentication");
    // Implement two-factor authentication logic here
  };

  const handleChangePassword = () => {
    console.log("Changing password");
    // Implement change password logic here
  };

  const handleViewActiveSessions = () => {
    console.log("Viewing active sessions");
    // Implement view active sessions logic here
  };

  const handleGenerateApiKey = () => {
    console.log("Generating new API key");
    // Implement API key generation logic here
  };

  const handleRevokeApiKey = (keyDescription) => {
    console.log(`Revoking API key: ${keyDescription}`);
    // Implement API key revocation logic here
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage your email notifications and alert settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your account activity
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">SMS Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Get important alerts via text message
                </p>
              </div>
              <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Browser Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications in your web browser
                </p>
              </div>
              <Switch
                checked={browserNotifications}
                onCheckedChange={setBrowserNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Manage your account security and authentication methods.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline" onClick={handleTwoFactorAuth}>
                Enable
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Change Password</h4>
                <p className="text-sm text-muted-foreground">
                  Update your account password
                </p>
              </div>
              <Button variant="outline" onClick={handleChangePassword}>
                Update
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Active Sessions</h4>
                <p className="text-sm text-muted-foreground">
                  Manage devices where you're currently logged in
                </p>
              </div>
              <Button variant="outline" onClick={handleViewActiveSessions}>
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Theme</h4>
              <Select value={theme} onValueChange={onThemeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Accent Color</h4>
              <div className="flex space-x-2">
                {["red", "green", "blue", "yellow", "purple"].map((color) => (
                  <Button
                    key={color}
                    className={`w-6 h-6 rounded-full bg-${color}-500`}
                    onClick={() => onAccentColorChange(color)}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

