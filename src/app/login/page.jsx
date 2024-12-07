"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createUser, getCurrentUser, signIn } from "@/services/appwrite";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthUserStore } from "@/services/user";

export default function AuthPage() {
  const [_, setActiveTab] = useState("login");
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { setAuthUser } = useAuthUserStore() || {};

  const handleRoleRedirect = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.role) {
        setAuthUser(currentUser); // Save current user with role
        const role = currentUser.role;

        switch (role) {
          case "admin":
            toast.success(`Welcome back, ${currentUser.name}!`);
            router.push("/admin");
            break;
          case "superadmin":
            toast.success(`Welcome back, ${currentUser.name}!`);
            router.push("/superadmin");
            break;
          case "user":
          default:
            toast.success(`Welcome back, ${currentUser.name}!`);
            router.push("/tourism-form");
            break;
        }
      } else {
        toast.error("Unable to fetch user role.");
      }
    } catch (error) {
      console.error("Role redirection error:", error.message);
      toast.error("Failed to determine user role. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await signIn(email, password); // Log in using Appwrite
      setAuthUser(user); // Save user to store
      await handleRoleRedirect(); // Redirect user based on their role
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(error.message || "Login failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    try {
      await createUser(email, password, fullName);
      toast.success("Account created successfully! Please log in.");
      setActiveTab("login"); // Switch to login tab
    } catch (error) {
      console.error("Signup error:", error.message);
      toast.error(error.message || "Signup failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center p-4">
      <ToastContainer />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Aurora Tourism
          </CardTitle>
          <CardDescription className="text-center">
            Digital Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <MailIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <LockIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <UserIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <MailIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <LockIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <LockIcon
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        size={20}
                      />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-600">
            By continuing, you agree to Aurora Tourism Terms of Service and
            Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
