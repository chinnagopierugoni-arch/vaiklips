"use client";

import { useState, useEffect } from "react";
import HeroScene from "@/components/3d/HeroScene";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Play, Download, Share2, MoreVertical, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import VideoPlayerModal from "@/components/ui/VideoPlayerModal";
import { getVideos } from "@/lib/storage";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const data = await getVideos();
                setVideos(data);
            } catch (error) {
                console.error("Failed to fetch videos", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();

        // Poll for updates every 5 seconds
        const interval = setInterval(fetchVideos, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-screen pt-24 px-6 md:px-12 pb-20">
            <HeroScene showCore={false} />

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
                        <p className="text-gray-400">Welcome back, Creator.</p>
                    </div>
                    <Link href="/upload" className="w-full sm:w-auto">
                        <Button variant="primary" className="shadow-lg shadow-primary/20 w-full sm:w-auto justify-center">
                            <Plus className="w-4 h-4 mr-2" /> New Project
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        <p className="text-gray-400 text-sm relative z-10">Total Videos</p>
                        <h2 className="text-4xl font-bold text-accent relative z-10">{videos.length}</h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        <p className="text-gray-400 text-sm relative z-10">Processing</p>
                        <h2 className="text-4xl font-bold text-white relative z-10">{videos.filter(v => v.status === 'processing').length}</h2>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-pink-500/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        <p className="text-gray-400 text-sm relative z-10">Completed</p>
                        <h2 className="text-4xl font-bold text-primary-glow relative z-10">{videos.filter(v => v.status === 'completed').length}</h2>
                    </motion.div>
                </div>

                <h2 className="text-xl font-bold mb-6">Recent Creations</h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-accent animate-spin" />
                    </div>
                ) : videos.length === 0 ? (
                    <div className="text-center py-20 glass-panel rounded-3xl">
                        <p className="text-gray-400 mb-4">No videos yet. Start creating!</p>
                        <Link href="/upload">
                            <Button variant="primary">Create First Short</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {videos.map((video, index) => (
                            <motion.div
                                key={video.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                                className="glass-panel p-4 rounded-2xl group hover:bg-white/10 transition-colors cursor-pointer"
                                onClick={() => video.status === 'completed' && router.push(`/dashboard/video/${video.id}`)}
                            >
                                <div className={`aspect-[9/16] rounded-xl mb-4 relative overflow-hidden ${video.thumbnail || "bg-secondary"} flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300`}>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                                    {video.status === 'processing' ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-accent animate-spin" />
                                            <span className="text-xs text-accent font-bold tracking-widest uppercase">Processing</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                                                <Play className="text-white fill-white ml-1 w-5 h-5" />
                                            </div>
                                            <span className="absolute bottom-2 right-2 text-xs bg-black/60 px-2 py-1 rounded-md text-white/90 backdrop-blur-sm">{video.duration}</span>
                                        </>
                                    )}
                                </div>

                                <div className="flex justify-between items-start mb-2">
                                    <div className="overflow-hidden">
                                        <h3 className="font-bold text-sm truncate pr-2">{video.title}</h3>
                                        <p className="text-xs text-gray-400 capitalize">{video.status === 'completed' ? `${video.views} views` : video.status}</p>
                                    </div>
                                    <button className="text-gray-400 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <Button variant="secondary" className="flex-1 text-xs py-2 h-9" disabled={video.status !== 'completed'} onClick={(e) => e.stopPropagation()}>
                                        <Download className="w-3 h-3 mr-1" /> Save
                                    </Button>
                                    <Button variant="secondary" className="flex-1 text-xs py-2 h-9" disabled={video.status !== 'completed'} onClick={(e) => e.stopPropagation()}>
                                        <Share2 className="w-3 h-3 mr-1" /> Share
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <VideoPlayerModal
                isOpen={!!selectedVideo}
                video={selectedVideo}
                onClose={() => setSelectedVideo(null)}
            />
        </div>
    )
}
