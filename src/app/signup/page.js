"use client";

import HeroScene from "@/components/3d/HeroScene";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [fullName, setFullName] = useState("");
 const [error, setError] = useState("");
 const router = useRouter();

 const handleSignup = async (e) => {
  e.preventDefault();
  setError("");
  try {
   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
   await updateProfile(userCredential.user, { displayName: fullName });
   router.push("/dashboard");
  } catch (err) {
   setError(err.message);
  }
 };

 const handleGoogleSignup = async () => {
  try {
   await signInWithPopup(auth, googleProvider);
   router.push("/dashboard");
  } catch (err) {
   setError(err.message);
  }
 };

 return (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">
   {/* 3D Background with only particles */}
   <HeroScene showCore={false} />

   <motion.div
    initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
    className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 backdrop-blur-xl border-t border-l border-white/20 shadow-2xl mx-4"
   >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary" />

    <h2 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
     Join the Future
    </h2>
    <p className="text-center text-gray-400 mb-8 text-sm">Create your AI studio account today.</p>

    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

    <form className="space-y-4" onSubmit={handleSignup}>
     <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Full Name</label>
      <div className="relative group">
       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
       <input
        type="text"
        placeholder="John Doe"
        className="w-full bg-secondary/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
       />
      </div>
     </div>

     <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Email Address</label>
      <div className="relative group">
       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
       <input
        type="email"
        placeholder="creator@shortclips.ai"
        className="w-full bg-secondary/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
       />
      </div>
     </div>

     <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Password</label>
      <div className="relative group">
       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
       <input
        type="password"
        placeholder="••••••••"
        className="w-full bg-secondary/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
       />
      </div>
     </div>

     <div className="pt-2 space-y-3">
      <Button variant="primary" type="submit" className="w-full py-4 text-lg shadow-lg shadow-accent/20 bg-accent text-black border-accent hover:shadow-accent/40">
       Create Account
      </Button>
      <Button type="button" variant="secondary" onClick={handleGoogleSignup} className="w-full py-3 text-sm">
       Sign up with Google
      </Button>
     </div>

     <p className="text-center text-sm text-gray-500 mt-4">
      Already have an account? <Link href="/login" className="text-primary hover:text-primary-glow hover:underline transition-colors">Log In</Link>
     </p>
    </form>
   </motion.div>
  </div>
 )
}
