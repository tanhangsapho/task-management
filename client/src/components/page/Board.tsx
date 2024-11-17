import React from "react";
import { UserIcon, Star } from "lucide-react"; // Importing the Star icon
import { Card } from "../ui/card";
import CardList from "../ui/cardlist";

function Board() {
  return (
    <div className="p-6">
      {/* User Profile and Your Boards */}
      <div className="flex items-center gap-4 mb-8">
        {/* User Profile (Avatar) */}
        <div className="w-12 h-12 bg-emerald-600 rounded flex items-center justify-center">
          <span className="text-white text-xl font-medium">TM</span>
        </div>
        {/* User Name */}
        <div className="flex-1">
          <p className="text-sm text-black font-bold">USER NAME</p>
        </div>
      </div>

      {/* Your Boards */}
      <h2 className="flex items-center gap-2 text-sm font-medium mb-6">
        <UserIcon className="h-4 w-4" />
        Your boards
      </h2>
      <CardList></CardList>
    </div>
  );
}

export default Board;
