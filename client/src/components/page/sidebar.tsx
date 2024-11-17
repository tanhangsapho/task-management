"use client";
import {
  LayoutDashboard as BoardsIcon,
  Settings as SettingsIcon,
  Users as MembersIcon,
  ChevronDown as ChevronDownIcon,
  ChevronUp as ChevronUpIcon,
  Star,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const SideBar = () => {
  const [workspaceExpanded, setWorkspaceExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <div className="h-screen flex bg-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-black border-r border-gray-300 flex flex-col justify-between">
        {/* Top Section */}
        <div className="px-3 mt-10">
          {/* Workspace Button */}
          <Button
            variant="ghost"
            className="w-full justify-between text-black rounded-xl"
            onClick={() => setWorkspaceExpanded(!workspaceExpanded)}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-black flex items-center justify-center mr-2 rounded">
                <span className="text-white font-medium">TM</span>
              </div>
              <span>Work Space</span>
            </div>
            {workspaceExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
          {/* Menu Options */}
          {workspaceExpanded && (
            <div className="ml-2 mt-2 space-y-1">
              <Link href="/board" className="block w-full">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-black hover:text-white hover:bg-gray-200 rounded-xl ${
                    pathname === "/board" ? "bg-gray-200" : ""
                  }`}
                >
                  <BoardsIcon className="h-4 w-4 mr-2" />
                  Boards
                </Button>
              </Link>
              <Link href="/starred" className="block w-full">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-black hover:text-white hover:bg-gray-200 rounded-xl ${
                    pathname === "/starred" ? "bg-gray-200" : ""
                  }`}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Starred
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-black hover:text-white hover:bg-gray-300 rounded-xl"
              >
                <MembersIcon className="h-4 w-4 mr-2" />
                My Tasks
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="px-3 pb-4 space-y-1">
          <hr className="border-gray-300 my-4" />
          <Button
            variant="ghost"
            className="w-full justify-start text-black hover:text-white hover:bg-gray-300 rounded-xl"
          >
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-black hover:text-white hover:bg-gray-300 rounded-xl"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
    </div>
  );
};

export { SideBar };
