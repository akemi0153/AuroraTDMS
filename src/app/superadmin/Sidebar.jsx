import React from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Link from "next/link";
import {
  HomeIcon,
  LayoutDashboardIcon,
  UserIcon,
  FolderIcon,
  ClipboardIcon,
  ActivityIcon,
  SettingsIcon,
} from "lucide-react";

function SidebarButton({ icon: Icon, label, tab, activeTab, onClick }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
            activeTab === tab
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => onClick(tab)}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export default function Sidebar({ activeTab, onTabClick }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-14 flex-col border-r bg-background sm:flex">
      <div className="flex flex-col items-center gap-4 px-2 py-5">
        <TooltipProvider>
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            prefetch={false}
          >
            <HomeIcon className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Aurora Tourism Office</span>
          </Link>
          <SidebarButton
            icon={LayoutDashboardIcon}
            label="Dashboard"
            tab="dashboard"
            activeTab={activeTab}
            onClick={onTabClick}
          />
          <SidebarButton
            icon={UserIcon}
            label="Users"
            tab="users"
            activeTab={activeTab}
            onClick={onTabClick}
          />
          <SidebarButton
            icon={FolderIcon}
            label="Clients"
            tab="clients"
            activeTab={activeTab}
            onClick={onTabClick}
          />
          <SidebarButton
            icon={ClipboardIcon}
            label="Inspectors"
            tab="inspectors"
            activeTab={activeTab}
            onClick={onTabClick}
          />
          <SidebarButton
            icon={SettingsIcon}
            label="Settings"
            tab="settings"
            activeTab={activeTab}
            onClick={onTabClick}
          />
        </TooltipProvider>
      </div>
    </aside>
  );
}
