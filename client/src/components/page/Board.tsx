"use client";

import React, { useEffect, useState } from "react";
import { UserIcon } from "lucide-react";
import CardList from "../ui/cardlist";
import { authAPI } from "@/lib/api/auth"; // Assuming you have this file

interface User {
  id: string;
  name: string;
  email: string;
  photos?: string;
}

function Board() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        console.log("userData", userData);
        setUser(userData.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-6">
      {/* User Profile and Your Boards */}
      <div className="flex items-center gap-4 mb-8">
        {/* User Profile (Avatar) */}
        <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center overflow-hidden">
          {user?.photos ? (
            <img
              src={user.photos}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-xl font-medium">
              {user?.name?.charAt(0) || "U"}
            </span>
          )}
        </div>
        {/* User Name */}
        <div className="flex-1">
          <p className="text-sm text-black font-bold">
            {user?.name || "Guest"}
          </p>
          <p className="text-xs text-gray-500">
            {user?.email || "No email available"}
          </p>
        </div>
      </div>

      {/* Your Boards */}
      <h2 className="flex items-center gap-2 text-sm font-medium mb-6">
        <UserIcon className="h-4 w-4" />
        Your boards
      </h2>
      <CardList />
    </div>
  );
}

export default Board;
