"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Star, Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchBoards } from "@/utils/endpoint";
import { API_ENDPOINTS } from "@/lib/api/board";
import axios from "axios";
import { Textarea } from "./textarea";

interface IBoard {
  _id: string;
  title: string;
  description?: string;
  background: string;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CardList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    background: "#0079bf",
  });

  const backgroundColors = [
    { color: "bg-purple-500 hover:bg-purple-600", value: "#8B5CF6" },
    { color: "bg-pink-600 hover:bg-pink-700", value: "#EC4899" },
    { color: "bg-blue-500 hover:bg-blue-600", value: "#3B82F6" },
    { color: "bg-green-500 hover:bg-green-600", value: "#10B981" },
  ];

  useEffect(() => {
    const loadBoards = async () => {
      try {
        setIsLoading(true);
        const boardsData = await fetchBoards();
        setBoards(boardsData);
        setError(null);
      } catch (error) {
        setError("Failed to load boards");
      } finally {
        setIsLoading(false);
      }
    };

    loadBoards();
  }, []);

  const createBoard = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post<IBoard>(API_ENDPOINTS.BOARDS, formData);

      setBoards([...boards, data]);
      setIsOpen(false);
      setFormData({ title: "", description: "", background: "#0079bf" });
    } catch (error) {
      console.error("Error creating board:", error);
      setError("Failed to create board");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Card
            key={board._id}
            className="relative p-4 aspect-[16/9] flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: board.background }}
          >
            <Star className="absolute top-2 right-2 h-5 w-5 text-yellow-400" />
            <span className="text-white font-medium">{board.title}</span>
          </Card>
        ))}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Card className="relative bg-gray-700 hover:bg-gray-600 transition-colors p-4 aspect-[16/9] flex items-center justify-center cursor-pointer">
              <Plus className="mr-2 h-5 w-5 text-gray-300" />
              <span className="text-gray-300">Create new board</span>
            </Card>
          </DialogTrigger>

          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Create New Board</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 ">
              <Input
                placeholder="Board title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Board description (optional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <div className="flex gap-2">
                {backgroundColors.map(({ color, value }) => (
                  <div
                    key={value}
                    className={`w-8 h-8 rounded cursor-pointer ${color} ${
                      formData.background === value ? "ring-2 ring-white" : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, background: value })
                    }
                  />
                ))}
              </div>
              <Button
                className="w-full "
                onClick={createBoard}
                disabled={isLoading || !formData.title.trim()}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create Board"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CardList;
