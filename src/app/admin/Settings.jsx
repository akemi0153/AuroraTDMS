"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";
import { fetchUserInfo, updateUserInfo } from "@/lib/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Please enter a valid phone number.",
  }),
});

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const {
    data: userInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userInfo"],
    queryFn: fetchUserInfo,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      toast.success("Your user information has been updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update user information. Please try again.");
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  React.useEffect(() => {
    if (userInfo) {
      form.reset({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
      });
    }
  }, [userInfo, form]);

  const onSubmit = async (data) => {
    if (!userInfo || !userInfo.$id) {
      toast.error("User information not available. Please try again later.");
      return;
    }

    const updatedFields = {};
    let hasChanges = false;

    if (data.name !== userInfo.name) {
      updatedFields.name = data.name;
      hasChanges = true;
    }
    if (data.email !== userInfo.email) {
      updatedFields.email = data.email;
      hasChanges = true;
    }
    if (data.phone !== userInfo.phone) {
      updatedFields.phone = data.phone;
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.info("No changes detected.");
      return;
    }

    updateUserMutation.mutate({ userId: userInfo.$id, ...updatedFields });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>
            Update your personal information here.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={updateUserMutation.isLoading}>
                {updateUserMutation.isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Toaster />
    </div>
  );
}
