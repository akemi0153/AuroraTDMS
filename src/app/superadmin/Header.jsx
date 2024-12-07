import React from 'react';
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HomeIcon } from 'lucide-react';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(); // Log out the user
      clearAuthUser(); // Clear auth user from store
      toast.success("Successfully logged out.");
      router.push("/login");
    } catch (error) {
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-4">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <HomeIcon className="h-6 w-6" />
          <h1 className="text-xl font-bold">
            AURORA PROVINCIAL TOURISM OFFICE
          </h1>
        </Link>
        <div className="text-muted-foreground">Superadmin Dashboard</div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-full"
            >
              <img
                src="/placeholder.svg"
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden rounded-full"
                style={{ aspectRatio: "36/36", objectFit: "cover" }}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

