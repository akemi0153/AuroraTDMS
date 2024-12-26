"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailIcon, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Here you would typically call your password reset API
      // For this example, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Password reset link sent to your email!");
      // Optionally, redirect to login page after successful submission
      // router.push('/login');
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] via-[#b2ebf2] to-[#80deea] p-4">
      <Toaster />
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/90 p-8 rounded-xl shadow-lg backdrop-blur-sm">
          {/* Removed Logo */}
          <h2 className="mt-10 text-center text-3xl font-extrabold text-[#00838f]">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-[#00acc1]">
            No worries, we'll send you reset instructions.
          </p>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <Label htmlFor="email-address" className="sr-only">
                  Email address
                </Label>
                <div className="relative">
                  <MailIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00acc1]"
                    size={20}
                  />
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 rounded-full border-[#4dd0e1] focus:border-[#00acc1] focus:ring-[#00acc1] transition-all duration-300"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-[#00acc1] to-[#00bcd4] py-2 text-white transition-all duration-300 hover:from-[#00bcd4] hover:to-[#00acc1] transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isLoading ? "Sending..." : "Reset Password"}
              </Button>
            </div>
          </form>
          <div className="mt-6">
            <Link
              href="/login"
              className="flex items-center justify-center text-sm text-[#00acc1] hover:text-[#0097a7] transition-colors duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
