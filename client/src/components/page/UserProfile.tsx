import React from "react";

function UserProfile() {
  return (
    <div>
      <div className="p-6 text-gray-300">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-emerald-600 rounded flex items-center justify-center">
            <span className="text-white text-xl font-medium">TM</span>
          </div>
          <div>
            <p className="text-sm text-black text-bold">USER NAME</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
