"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Button({
 children,
 className,
 variant = "primary",
 onClick,
 ...props
}) {
 const baseStyles = "relative px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center overflow-hidden group";

 const variants = {
  primary: "bg-primary text-white shadow-[0_0_20px_rgba(138,43,226,0.5)] hover:shadow-[0_0_40px_rgba(138,43,226,0.8)] border border-primary/50",
  secondary: "bg-secondary text-white border border-white/10 hover:border-white/30 hover:bg-white/5",
  accent: "bg-accent text-black shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:shadow-[0_0_40px_rgba(0,255,255,0.8)] border border-accent/50",
  ghost: "bg-transparent text-white hover:bg-white/10",
 };

 return (
  <motion.button
   whileHover={{ scale: 1.05, y: -2 }}
   whileTap={{ scale: 0.95 }}
   className={cn(baseStyles, variants[variant], className)}
   onClick={onClick}
   {...props}
  >
   <span className="relative z-10 flex items-center gap-2">{children}</span>

   {/* Glow Effect */}
   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0" />
  </motion.button>
 );
}
