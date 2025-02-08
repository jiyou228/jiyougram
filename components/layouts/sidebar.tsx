"use client";

import {
  Home,
  Logout,
  People,
  Search,
  Send,
  AddBoxOutlined,
  Settings,
  FavoriteBorder,
} from "@mui/icons-material";
import Link from "next/link";
import { createBrowserSupabaseClient } from "utils/supabase/client";

export default function Sidebar() {
  const supabase = createBrowserSupabaseClient();
  return (
    <aside className="h-screen p-6 border-r border-gray-300 flex flex-col justify-between w-fit">
      <div className="flex flex-col gap-5">
        <Link href="/">
          <Home className="text-2xl mb-10" />
        </Link>
        <Link href="/newpost">
          <AddBoxOutlined className="text-2xl" />
        </Link>
        <Link href="/people">
          <People className="text-2xl" />
        </Link>
        <Link href="/discover">
          <FavoriteBorder className="text-2xl" />
        </Link>
        <Link href="/chat">
          <Send className="text-2xl" />
        </Link>
      </div>
      <div>
        <Link href="/settings">
          <Settings className="text-2xl mb-5" />
        </Link>
        <button
          onClick={async () => {
            supabase.auth.signOut();
          }}
        >
          <Logout className="text-2xl text-deep-purple-900" />
        </button>
      </div>
    </aside>
  );
}
