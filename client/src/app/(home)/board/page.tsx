import { ProtectedRoute } from "@/components/auth/protectedRoute";
import Board from "@/components/page/Board";
import React from "react";

const page = () => {
  return (
    <div>
      <ProtectedRoute>
        <Board />
      </ProtectedRoute>
    </div>
  );
};

export default page;
