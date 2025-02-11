"use client";

import { Button, Textarea } from "@material-tailwind/react";
import FileDragDropZone from "./file-dragdropzone";
import { useState } from "react";

export default function Post() {
  const [input, setInput] = useState("");
  return (
    <main className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-light-blue-50">
      <div className="pt-6 pb-6 px-10 w-full max-w-lg flex flex-col items-center justify-center  border border-gray-400 bg-white gap-4">
        <div className="w-full">
          <FileDragDropZone />
        </div>

        <div className="w-full">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            label="본문"
            className="h-36 w-full"
          />
        </div>

        <div>
          <Button type="submit" className="text-white text-sm bg-indigo-600">
            업로드
          </Button>
        </div>
      </div>
    </main>
  );
}
