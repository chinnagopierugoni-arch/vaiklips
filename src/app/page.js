"use client";

import { motion } from "framer-motion";
import HeroScene from "@/components/3d/HeroScene";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Upload, Wand2, Scissors, Music, Share2 } from "lucide-react";

const features = [
  { icon: Upload, title: "Upload Video", desc: "Drag & drop your long-form content." },
  { icon: Wand2, title: "AI Processing", desc: "Our AI analyzes key moments instantly." },
  { icon: Scissors, title: "Auto Highlight", desc: "Smartly crops to vertical format." },
  { icon: Music, title: "Caption + Music", desc: "Auto-synced captions & trending audio." },
  { icon: Share2, title: "Export Reels", desc: "Download ready-to-post viral clips." },
];

import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStartCreating = () => {
    if (!user) {
      router.push("/signup?message=Please sign up or log in first to continue");
    } else {
      router.push("/upload");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      <HeroScene />

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-8xl font-black tracking-tight mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">
            Turn Long Videos into
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-glow to-accent animate-pulse-glow block mt-2 neon-text">
            Viral Shorts
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-2xl text-gray-400 max-w-3xl mb-12 leading-relaxed"
        >
          The ultimate AI-powered tool for content creators. <br className="hidden md:block" />
          Upload once, get multiple engaged reels in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Button 
            onClick={handleStartCreating} 
            variant="primary" 
            className="text-xl px-12 py-6 rounded-2xl shadow-2xl shadow-primary/30"
          >
            Start Creating <Wand2 className="ml-3 w-6 h-6" />
          </Button>
          <Link href="#features">
            <Button variant="secondary" className="text-xl px-12 py-6 rounded-2xl backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10">
              How it Works
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="features" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-center mb-20"
          >
            AI-Powered Workflow
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center hover:bg-white/10 transition-colors group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="p-4 rounded-2xl bg-white/5 mb-6 text-accent group-hover:text-white group-hover:bg-accent group-hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all duration-300">
                  <feature.icon className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
