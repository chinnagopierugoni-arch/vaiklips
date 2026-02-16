
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, updateDoc, doc, query, orderBy, serverTimestamp, getDoc } from "firebase/firestore";

const COLLECTION_NAME = "videos";

export async function getVideos() {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        let videos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // No client-side simulation needed anymore as we use the API
        return videos;
    } catch (error) {
        console.error("Error fetching videos:", error);
        return [];
    }
}

export async function addVideo(video) {
    try {
        const newVideo = {
            ...video,
            createdAt: Date.now(), // Use client timestamp for simplicity in simulation logic
            status: 'processing',
            views: '0',
            duration: '--:--',
            thumbnail: 'bg-gradient-to-br from-primary/20 to-secondary',
            shorts: [] // Initialize empty shorts array
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), newVideo);
        return { id: docRef.id, ...newVideo };
    } catch (error) {
        console.error("Error adding video:", error);
        throw error;
    }
}

export async function addShorts(videoId, shorts) {
    try {
        const videoRef = doc(db, COLLECTION_NAME, videoId);
        await updateDoc(videoRef, {
            shorts: shorts,
            status: 'completed',
            shortsCount: shorts.length
        });
    } catch (error) {
        console.error("Error adding shorts:", error);
        throw error;
    }
}

export async function getVideo(id) {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting video:", error);
        return null;
    }
}

export async function updateShorts(videoId, shorts) {
    try {
        const videoRef = doc(db, COLLECTION_NAME, videoId);
        await updateDoc(videoRef, {
            shorts: shorts,
            shortsCount: shorts.length
        });
    } catch (error) {
        console.error("Error updating shorts:", error);
        throw error;
    }
}
