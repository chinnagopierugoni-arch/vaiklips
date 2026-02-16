"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const navItems = [
 { name: "Home", href: "/" },
 { name: "Dashboard", href: "/dashboard" },
 { name: "Upload", href: "/upload" },
];

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Navbar() {
 const pathname = usePathname();
 const [user, setUser] = useState(null);
 const router = useRouter();

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
   setUser(currentUser);
  });
  return () => unsubscribe();
 }, []);

 const handleLogout = async () => {
  try {
   await signOut(auth);
   router.push("/");
  } catch (error) {
   console.error("Logout failed", error);
  }
 };

 return (
  <motion.nav
   initial={{ y: -100, opacity: 0 }}
   animate={{ y: 0, opacity: 1 }}
   transition={{ duration: 0.8, ease: "easeOut" }}
   className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-panel border-b border-card-border"
  >
   <div className="flex items-center gap-2">
    <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
     ShortClips <span className="text-primary-glow">AI</span>
    </Link>
   </div>

   <div className="hidden md:flex items-center gap-8">
    {navItems.map((item) => (
     <Link
      key={item.href}
      href={item.href}
      className={cn(
       "text-sm font-medium transition-colors hover:text-primary",
       pathname === item.href ? "text-primary" : "text-gray-400"
      )}
     >
      {item.name}
     </Link>
    ))}
   </div>

   <div className="flex items-center gap-4">
    {user ? (
     <Button
      variant="ghost"
      className="text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
      onClick={handleLogout}
     >
      Log Out
     </Button>
    ) : (
     <>
      <Link href="/login">
       <Button variant="ghost" className="text-sm">
        Log In
       </Button>
      </Link>
      <Link href="/signup">
       <Button variant="primary" className="text-sm px-4 py-2">
        Get Started
       </Button>
      </Link>
     </>
    )}
   </div>
  </motion.nav>
 );
}
