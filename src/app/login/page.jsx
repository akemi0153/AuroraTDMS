"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryVerticalEnd, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createUser, getCurrentUser, signIn } from "@/services/appwrite";
import { useAuthUserStore } from "@/services/user";
import toast, { Toaster } from "react-hot-toast";

function ResizableImage() {
  const [size, setSize] = useState({ width: 50, height: 50 }); // Smaller initial size
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - size.width,
      y: e.clientY - size.height,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newWidth = Math.max(150, e.clientX - startPosition.x);
    const newHeight = Math.max(150, e.clientY - startPosition.y);

    // Keep aspect ratio
    const aspectRatio = 16 / 9;
    const width = newWidth;
    const height = width / aspectRatio;

    setSize({ width, height });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center gap-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="relative"
        style={{
          width: `${size.width}%`,
          height: `${size.height}%`,
          minWidth: "150px",
          minHeight: "150px",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <img
          src="./image/lap.png"
          alt="Aurora Tourism"
          className="w-full h-full object-contain p-4"
        />
        <div
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize bg-[#00acc1]/20 hover:bg-[#00acc1]/40 rounded-tl-xl transition-colors"
          onMouseDown={handleMouseDown}
        />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#00838f]">
          Welcome to Aurora Tourism
        </h2>
        <p className="text-[#00acc1]">
          Your gateway to extraordinary experiences
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login");
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
            // Only allow access to their specific municipality dashboard
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

      // Set cookies for middleware
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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 bg-gradient-to-br from-[#e0f7fa] via-[#b2ebf2] to-[#80deea] p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/homepage" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#00acc1] text-white">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Aurora Tourism
          </a>
        </div>
        <Toaster />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-6 rounded-xl bg-white/80 p-6 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-[#00838f]">
                Digital Management System
              </h1>
            </div>
            <Tabs defaultValue="login" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-[#e0f7fa] p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-full text-[#00acc1] data-[state=active]:bg-[#00acc1] data-[state=active]:text-white"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-full text-[#00acc1] data-[state=active]:bg-[#00acc1] data-[state=active]:text-white"
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
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1]"
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
                        className="text-sm text-[#00acc1] hover:underline"
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
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-[#00acc1] to-[#00bcd4] py-2 text-white transition-all duration-300 hover:from-[#00bcd4] hover:to-[#00acc1]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Sign In"}
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
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1]"
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
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1]"
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
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1]"
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
                        className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1]"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full bg-gradient-to-r from-[#00acc1] to-[#00bcd4] py-2 text-white transition-all duration-300 hover:from-[#00bcd4] hover:to-[#00acc1]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <div className="text-center text-sm text-[#00838f]">
              By continuing, you agree to Aurora Tourism Terms of Service and
              Privacy Policy.
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block"></div>
    </div>
  );
}
