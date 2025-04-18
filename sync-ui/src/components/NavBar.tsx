// src/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useAuth } from "../hooks/usAuth";  
import Button from "./Button";
export default function Navbar() {
  const { token, logout } = useAuth();
  return (
    <nav
      className="
        fixed top-0 left-0 w-full h-16 
         p-4 flex justify-between items-center 
        z-50
      "
    >
      <Link href="/">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          SiteSync
        </span>
      </Link>
      {token && (
        <Button  onClick={logout}>
          Logout
        </Button>
      )}
    </nav>
  );
}
