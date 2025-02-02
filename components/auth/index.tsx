"use client";

import { useState } from "react";
import SignIn from "./signin";
import SignUp from "./signup";

export default function Auth() {
  const [view, setView] = useState("SIGNUP");
  return (
    <main className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-light-blue-50">
      {view === "SIGNUP" ? (
        <SignUp setView={setView} />
      ) : (
        <SignIn setView={setView} />
      )}
    </main>
  );
}
