"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GalleryVerticalEnd,
  LockIcon,
  MailIcon,
  UserIcon,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createUser, getCurrentUser, signIn } from "@/services/appwrite";
import { useAuthUserStore } from "@/services/user";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

function ResizableImage() {
  const [size, setSize] = useState({ width: 120, height: 120 }); // Even smaller initial size

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative"
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img
          src="./image/lap.png"
          alt="Aurora Tourism"
          className="w-full h-full object-contain rounded-full shadow-lg"
        />
      </motion.div>
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-[#00838f]">Aurora Tourism</h2>
        <p className="text-sm text-[#00acc1]">Discover the beauty of Aurora</p>
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { setAuthUser } = useAuthUserStore() || {};

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleRoleRedirect = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.role) {
        setAuthUser(currentUser);
        const role = currentUser.role;
        const municipality = currentUser.municipality;

        switch (role) {
          case "admin":
            toast.success(`Welcome back, ${currentUser.name}!`);
            router.push("/admin");
            break;
          case "inspector":
            toast.success(`Welcome back, ${currentUser.name}!`);
            switch (municipality) {
              case "Baler":
                router.push("/inspector/baler");
                break;
              case "San Luis":
                router.push("/inspector/sanluis");
                break;
              case "Maria Aurora":
                router.push("/inspector/maria");
                break;
              case "Dipaculao":
                router.push("/inspector/dipaculao");
                break;
              default:
                toast.error("Municipality not assigned");
                router.push("/login");
            }
            break;
          case "user":
            toast.success(`Welcome back, ${currentUser.name}!`);
            router.push("/client");
            break;
          default:
            toast.error("Invalid role assigned");
            router.push("/login");
            break;
        }
      } else {
        toast.error("Unable to fetch user role.");
      }
    } catch (error) {
      toast.error("Failed to determine user role. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await signIn(email, password);
      setAuthUser(user);

      document.cookie = `sessionId=${user.$id}; path=/`;
      document.cookie = `userRole=${user.role}; path=/`;
      document.cookie = `userMunicipality=${user.municipality || ""}; path=/`;

      sessionStorage.setItem("userRole", user.role);
      if (user.municipality) {
        sessionStorage.setItem("userMunicipality", user.municipality);
      }

      await handleRoleRedirect();
    } catch (error) {
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
      setActiveTab("login");
    } catch (error) {
      console.error("Signup error:", error.message);
      toast.error(error.message || "Signup failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <motion.div
        className="flex flex-col gap-4 bg-gradient-to-br from-[#e0f7fa] via-[#b2ebf2] to-[#80deea] p-6 md:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center gap-2 md:justify-start">
          <motion.a
            href="/"
            className="flex items-center gap-2 font-medium text-[#00838f] hover:text-[#00acc1] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#00acc1] text-white">
              <GalleryVerticalEnd className="size-5" />
            </div>
            Aurora Tourism
          </motion.a>
        </div>
        <Toaster />
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            className="w-full max-w-md space-y-6 rounded-xl bg-white/90 p-8 backdrop-blur-sm shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ResizableImage />
            <Tabs defaultValue="login" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-[#e0f7fa] p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-full text-[#00acc1] data-[state=active]:bg-[#00acc1] data-[state=active]:text-white transition-all duration-300"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-full text-[#00acc1] data-[state=active]:bg-[#00acc1] data-[state=active]:text-white transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[#00838f] font-semibold"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <MailIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00acc1]"
                        size={20}
                      />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1] transition-all duration-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-[#00838f] font-semibold"
                      >
                        Password
                      </Label>
                      <a
                        href="#"
                        className="text-sm text-[#00acc1] hover:underline transition-all duration-300"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <LockIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00acc1]"
                        size={20}
                      />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1] transition-all duration-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-[#00acc1] to-[#00bcd4] py-2 text-white transition-all duration-300 hover:from-[#00bcd4] hover:to-[#00acc1] transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-[#00838f] font-semibold"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <UserIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00acc1]"
                        size={20}
                      />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1] transition-all duration-300"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-email"
                      className="text-[#00838f] font-semibold"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <MailIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00acc1]"
                        size={20}
                      />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1] transition-all duration-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="signup-password"
                      className="text-[#00838f] font-semibold"
                    >
                      Create Password
                    </Label>
                    <div className="relative">
                      <LockIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00acc1]"
                        size={20}
                      />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create your password"
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1] transition-all duration-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-[#00838f] font-semibold"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <LockIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00acc1]"
                        size={20}
                      />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1] transition-all duration-300"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-[#00acc1] to-[#00bcd4] py-2 text-white transition-all duration-300 hover:from-[#00bcd4] hover:to-[#00acc1] transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isLoading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <div className="text-center text-sm text-[#00838f]">
              By continuing, you agree to Aurora Tourism's{" "}
              <a href="#" className="text-[#00acc1] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#00acc1] hover:underline">
                Privacy Policy
              </a>
              .
            </div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        className="relative hidden lg:block bg-cover bg-center"
        style={{
          backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#e0f7fa]/80 to-transparent" />
        <div className="absolute bottom-10 left-10 text-white">
          <h2 className="text-4xl font-bold mb-4">Explore Aurora</h2>
          <p className="text-xl">
            Discover the natural wonders and rich culture of Aurora Province
          </p>
        </div>
      </motion.div>
    </div>
  );
}
