"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-hot-toast";
import { getCurrentUser } from "@/services/appwrite";
import { databases, appwriteConfig } from "@/services/appwrite";
import { account } from "@/services/appwrite";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Profile states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Security states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSecuritySaving, setIsSecuritySaving] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        setName(user.name || "");
        setEmail(user.email || "");
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch user information");
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsProfileSaving(true);

    try {
      if (email !== currentUser.email) {
        await account.updateEmail(email);
      }

      if (name !== currentUser.name) {
        await account.updateName(name);
      }

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        currentUser.$id,
        {
          name,
          email,
        }
      );

      setCurrentUser((prev) => ({
        ...prev,
        name,
        email,
      }));

      toast.success("Profile updated successfully");
    } catch (error) {
      if (error.code === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else if (error.code === 409) {
        toast.error("Email already exists. Please use a different email.");
      } else {
        toast.error("Failed to update profile: " + error.message);
      }
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsSecuritySaving(true);

    try {
      await account.updatePassword(newPassword, currentPassword);

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Password updated successfully");
    } catch (error) {
      if (error.code === 401) {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Failed to update password: " + error.message);
      }
    } finally {
      setIsSecuritySaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-primary mb-6">Settings</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <Button type="submit" disabled={isProfileSaving}>
                  {isProfileSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecuritySubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="currentPassword"
                    className="text-sm font-medium"
                  >
                    Current Password
                  </label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <Button type="submit" disabled={isSecuritySaving}>
                  {isSecuritySaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
