import { StarIcon } from "lucide-react";
import React from "react";
import { Card } from "../ui/card";

function Starred() {
  return (
    <div>
      <div className="space-y-8">
        <div>
          <h2 className="flex items-center gap-2 text-xl  mb-4 font-semibold">
            <StarIcon className="h-5 w-5" />
            Starred boards
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-purple-500 hover:bg-purple-600 transition-colors p-4 aspect-[16/9] flex items-center justify-center cursor-pointer">
              <span className="text-white font-medium">Any</span>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Starred;
