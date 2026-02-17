"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function VideoPlayerModal({ video, isOpen, onClose }) {
    if (!isOpen || !video) return null;

    const isYoutube = video.type === "youtube" || (video.title && video.title.includes("youtube.com"));

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) return match[2];

        // Handle direct ID if passed
        if (url.length === 11 && !url.includes("/") && !url.includes(".")) return url;

        return null;
    };

    const videoSrc = isYoutube
        ? `https://www.youtube.com/embed/${video.youtubeId || getYoutubeId(video.originalUrl) || getYoutubeId(video.title)}?autoplay=1`
        : (video.videoSrc || video.originalUrl || "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4");

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                onClick={onClose}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-50 p-3 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors backdrop-blur-md"
                >
                    <X className="w-6 h-6" />
                </button>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative w-full max-w-lg aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >

                    {isYoutube ? (
                        <iframe
                            src={videoSrc}
                            title={video?.title || "Video"}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <video
                            src={videoSrc}
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                            loop
                        />
                    )}

                    <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                        <h3 className="text-white font-bold text-lg truncate">{video.title}</h3>
                        <p className="text-gray-300 text-sm">AI Generated Short</p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
