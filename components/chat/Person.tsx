"use client";

import { getRandomImage } from "utils/random";

export default function Person({
  index,
  userId,
  name,
  onlineAt,
  isActive = false,
  onChatScreen = false,
  onClick = null,
}) {
  return (
    <div
      className={`flex ${onClick && "cursor-pointer"} gap-4 items-center p-4 ${
        !onChatScreen && isActive && "bg-light-blue-50"
      }${!onChatScreen && !isActive && "bg-gray-50"} ${
        onChatScreen && "bg-gray-50"
      }
      `}
      onClick={onClick}
    >
      <img
        src={getRandomImage(index)}
        alt={name}
        className="w-10 h-10 rounded-full"
      ></img>
      <div>
        <p className="text-black font-bold text-lg">{name}</p>
        <p className="text-gray-500 text-sm">{onlineAt}</p>
      </div>
    </div>
  );
}
