import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShortClips AI - Turn Long Videos into Viral Shorts",
  description: "Automated AI-powered video repurposing platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased bg-background text-foreground selection:bg-accent selection:text-background min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
