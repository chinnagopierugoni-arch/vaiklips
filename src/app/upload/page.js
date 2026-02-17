"use client";

import { useState, useEffect } from "react";
import HeroScene from "@/components/3d/HeroScene";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileVideo, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { addVideo, addShorts } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const steps = ["Uploading", "Analyzing Scenes", "Transcribing Audio", "Generating Highlights", "Rendering Shorts"];

export default function UploadPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle, uploading, processing, complete
  const [currentStep, setCurrentStep] = useState(0);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [user, setUser] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/signup?message=Please sign up or log in to use the Smart Shorts feature.");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleYoutubeSubmit = () => {
    if (!youtubeUrl) return;
    setFile({ name: youtubeUrl });
    handleUpload({ name: youtubeUrl, type: "youtube" });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
      handleUpload(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  }

  const handleUpload = async (fileData) => {
    setStatus("uploading");
    let p = 0;

    // Simulate upload progress
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        startProcessing(fileData);
      }
    }, 200);
  };

  const startProcessing = async (fileData) => {
    setStatus("processing");

    try {
      // 1. Create initial video record
      const newVideo = await addVideo({
        title: fileData.name || "New Project",
        type: fileData.type === "youtube" ? "youtube" : "file",
        originalUrl: fileData.type === "youtube" ? fileData.name : null
      }, user.uid);
      setVideoId(newVideo.id);

      // Simulate steps visualization while API is called
      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length) {
          setCurrentStep(stepIndex);
        }
      }, 1500); // Approximate time per step simulation

      // 2. Call Processing API
      const response = await fetch("/api/process-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: newVideo.id,
          videoTitle: newVideo.title,
          videoDuration: 600 // Mock duration
        })
      });

      const data = await response.json();

      clearInterval(stepInterval);
      setCurrentStep(steps.length - 1);

      if (data.success) {
        // 3. Save generated shorts
        await addShorts(newVideo.id, data.shorts);

        // Small delay to show "Rendering" completion
        setTimeout(() => {
          setStatus("complete");
        }, 1000);
      } else {
        console.error("Processing failed:", data.error);
        setStatus("idle");
        alert("Processing failed. Please try again.");
      }

    } catch (error) {
      console.error("Upload/Processing failed", error);
      setStatus("idle");
    }
  };

  // simulateProcessingSteps removed as it is now integrated into startProcessing

  return (
    <div className="relative min-h-screen pt-20 flex flex-col items-center justify-center p-6">
      <HeroScene showCore={false} />

      <div className="w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          Upload Your <span className="text-primary-glow">Masterpiece</span>
        </h1>

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key="upload-zone"
                className={cn(
                  "glass-panel rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center h-[400px] relative overflow-hidden group cursor-pointer",
                  isDragOver ? "border-accent bg-accent/5 shadow-[0_0_50px_rgba(0,255,255,0.2)]" : "border-white/20 hover:border-white/40"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <input type="file" id="file-upload" className="hidden" accept="video/*" onChange={handleFileSelect} />

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="mb-8 p-6 rounded-full bg-secondary/80 border border-white/10 shadow-xl"
                >
                  <Upload className="w-12 h-12 text-accent" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-2">Drag & Drop Video Here</h3>
                <p className="text-gray-400 mb-8">or click to browse files</p>

                <div className="flex gap-4 text-xs text-gray-500 uppercase tracking-widest">
                  <span>MP4</span>
                  <span>MOV</span>
                  <span>MKV</span>
                  <span>AVI</span>
                </div>
              </motion.div>

              <div className="flex items-center gap-4 py-6 w-full opacity-50">
                <div className="h-px bg-gray-600 flex-1" />
                <span className="text-gray-400 text-sm">OR PASTE URL</span>
                <div className="h-px bg-gray-600 flex-1" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-2 pl-6 pr-2 rounded-2xl flex items-center gap-4 w-full"
              >
                <input
                  type="text"
                  placeholder="Paste YouTube Link (e.g. https://youtube.com/watch?v=...)"
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
                <Button
                  variant="primary"
                  onClick={handleYoutubeSubmit}
                  disabled={!youtubeUrl}
                  className="px-6 py-3 rounded-xl min-w-[120px]"
                >
                  Generate
                </Button>
              </motion.div>
            </>
          )}

          {status === "uploading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="uploading"
              className="glass-panel p-10 rounded-3xl flex flex-col items-center justify-center h-[400px]"
            >
              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Uploading {file?.name}...</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {status === "processing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="processing"
              className="glass-panel p-10 rounded-3xl flex flex-col items-center justify-center h-[400px]"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-accent blur-xl opacity-20 animate-pulse" />
                <Loader2 className="w-16 h-16 text-accent animate-spin relative z-10" />
              </div>

              <h3 className="text-2xl font-bold mb-6">AI is Processing...</h3>

              <div className="flex flex-col gap-3 w-full max-w-sm">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs border transition-colors duration-500",
                      index < currentStep ? "bg-accent border-accent text-black" :
                        index === currentStep ? "border-accent text-accent animate-pulse" : "border-gray-700 text-gray-700"
                    )}>
                      {index < currentStep && <CheckCircle className="w-4 h-4" />}
                      {index === currentStep && <Loader2 className="w-4 h-4 animate-spin" />}
                    </div>
                    <span className={cn(
                      "transition-colors duration-500",
                      index <= currentStep ? "text-white" : "text-gray-600"
                    )}>{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {status === "complete" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key="complete"
              className="glass-panel p-10 rounded-3xl flex flex-col items-center justify-center h-[400px] text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                type="spring"
                className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
              >
                <Sparkles className="w-12 h-12 text-green-400" />
              </motion.div>

              <h2 className="text-3xl font-bold mb-4">Magic Complete!</h2>
              <p className="text-gray-400 mb-8 max-w-md">Your video has been successfully converted into 5 viral shorts.</p>

              <div className="flex gap-4">
                <Link href={`/dashboard/video/${videoId}`}>
                  <Button variant="primary" className="px-8 py-3">
                    View Shorts
                  </Button>
                </Link>
                <Button variant="ghost" onClick={() => { setStatus("idle"); setProgress(0); setCurrentStep(0); setFile(null); }}>
                  Upload Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div >
  )
}
