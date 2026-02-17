"use client";

import { useState, useEffect, use } from "react";
import { getVideo, updateShorts } from "@/lib/storage";
import Navbar from "@/components/shared/Navbar";
import { Loader2, Play, Download, Share2, Trash2, Edit2, Check, X, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import VideoPlayerModal from "@/components/ui/VideoPlayerModal";

export default function VideoDetailsPage({ params }) {
    // Unwrap params using React.use()
    const { id } = use(params);

    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedShort, setSelectedShort] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const getYoutubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const data = await getVideo(id);
                setVideo(data);
            } catch (error) {
                console.error("Failed to fetch video", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    const handleDeleteShort = async (shortId) => {
        if (!video) return;
        const updatedShorts = video.shorts.filter(s => s.id !== shortId);

        // Optimistic update
        setVideo({ ...video, shorts: updatedShorts });

        try {
            await updateShorts(video.id, updatedShorts);
        } catch (error) {
            console.error("Failed to delete short", error);
            // Revert if failed (omitted for brevity)
        }
    };

    const startEditing = (short) => {
        setEditingId(short.id);
        setEditTitle(short.title);
    };

    const saveTitle = async () => {
        if (!video || !editingId) return;

        const updatedShorts = video.shorts.map(s =>
            s.id === editingId ? { ...s, title: editTitle } : s
        );

        setVideo({ ...video, shorts: updatedShorts });
        setEditingId(null);

        try {
            await updateShorts(video.id, updatedShorts);
        } catch (error) {
            console.error("Failed to update title", error);
        }
    };

    const handleShare = (short) => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert("Project link copied to clipboard!");
        });
    };

    const handleDownload = (short) => {
        const videoUrl = video.originalUrl || '/placeholder-short.mp4';
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `${short.title || 'short'}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 text-accent animate-spin" />
            </div>
        );
    }

    if (!video) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
                <h1 className="text-2xl font-bold mb-4">Video Not Found</h1>
                <Link href="/dashboard">
                    <Button variant="primary">Return to Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 md:px-12 pb-20 bg-background text-white">
            <div className="max-w-7xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
                        <p className="text-gray-400">
                            Generated {video.shorts?.length || 0} shorts • {video.type}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="secondary">Download All</Button>
                    </div>
                </div>

                {!video.shorts || video.shorts.length === 0 ? (
                    <div className="glass-panel p-12 rounded-3xl text-center">
                        <p className="text-xl text-gray-400">No shorts generated for this video yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {video.shorts.map((short, index) => (
                            <motion.div
                                key={short.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-panel p-4 rounded-2xl group hover:bg-white/5 transition-all"
                            >
                                <div
                                    className="aspect-[9/16] bg-black/40 rounded-xl mb-4 relative overflow-hidden cursor-pointer group-inner"
                                    onClick={() => setSelectedShort({
                                        ...short,
                                        type: video.type,
                                        videoSrc: video.originalUrl || '/placeholder-short.mp4',
                                        youtubeId: video.type === 'youtube' ? getYoutubeId(video.originalUrl) : null
                                    })}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <Play className="w-8 h-8 fill-white text-white ml-1" />
                                        </div>
                                    </div>

                                    <span className="absolute bottom-3 right-3 text-xs font-bold bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                                        {short.duration}s
                                    </span>
                                </div>

                                <div className="flex justify-between items-start gap-2 mb-4">
                                    {editingId === short.id ? (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="flex-1 bg-white/10 rounded px-2 py-1 text-sm outline-none border border-accent/50"
                                                autoFocus
                                            />
                                            <button onClick={saveTitle} className="text-green-400 hover:text-green-300"><Check className="w-4 h-4" /></button>
                                            <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
                                        </div>
                                    ) : (
                                        <h3 className="font-bold text-lg leading-tight flex-1">{short.title}</h3>
                                    )}
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    <Button variant="ghost" className="h-10 px-0" onClick={() => startEditing(short)} title="Rename">
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" className="h-10 px-0" onClick={() => handleDownload(short)} title="Download">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" className="h-10 px-0" onClick={() => handleShare(short)} title="Share">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" className="h-10 px-0 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDeleteShort(short.id)} title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <VideoPlayerModal
                isOpen={!!selectedShort}
                video={selectedShort}
                onClose={() => setSelectedShort(null)}
            />
        </div>
    );
}
