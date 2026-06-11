import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Image as ImageIcon, Video, Loader2, Trash2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../AuthContext';

interface VehicleMediaModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: any | null; // using any to avoid importing Vehicle interface or we can copy it
}

export const VehicleMediaModal: React.FC<VehicleMediaModalProps> = ({ isOpen, onClose, vehicle }) => {
    const { user } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen || !vehicle) return null;

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);

        try {
            const isVideo = file.type.startsWith('video/');
            const isImage = file.type.startsWith('image/');
            
            // In a real app we'd upload this file to Firebase Storage.
            // Since this is a demonstration environment, we'll convert images to base64
            // and simply store object URLs for videos (they won't persist across refresh, but it works for demo)
            let resultUrl = '';

            if (isImage) {
                // Resize image to ensure it fits within Firestore document limits
                resultUrl = await processImage(file);
            } else if (isVideo) {
                // Fake video upload with a local URL (or a placeholder)
                // For demonstration, we'll use a placeholder video or object URL
                resultUrl = URL.createObjectURL(file);
            }

            if (resultUrl) {
                const vehicleRef = doc(db, `users/${user.uid}/vehicles`, vehicle.id);
                const updates: any = { updatedAt: Date.now() };

                if (isImage) {
                    updates.images = [...(vehicle.images || []), resultUrl];
                } else if (isVideo) {
                    updates.videos = [...(vehicle.videos || []), resultUrl];
                }

                await updateDoc(vehicleRef, updates);
            }
            
        } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/vehicles/${vehicle.id}`);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const processImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.6)); // 60% quality base64
                };
                img.onerror = reject;
                if (e.target?.result) img.src = e.target.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const removeMedia = async (url: string, type: 'image' | 'video') => {
        if (!user) return;
        try {
            const vehicleRef = doc(db, `users/${user.uid}/vehicles`, vehicle.id);
            const updates: any = { updatedAt: Date.now() };

            if (type === 'image') {
                updates.images = (vehicle.images || []).filter((u: string) => u !== url);
            } else {
                updates.videos = (vehicle.videos || []).filter((u: string) => u !== url);
            }

            // we do this optimistically or await
            await updateDoc(vehicleRef, updates);
        } catch(error) {
           console.error(error);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-3xl bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col h-[80vh]"
                >
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-[#141414]">
                        <div>
                            <h2 className="text-xl font-black text-black dark:text-white">Vehicle Media</h2>
                            <p className="text-sm text-zinc-500">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold flex items-center gap-2"><ImageIcon className="w-4 h-4 text-emerald-500"/> Images</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {(vehicle.images || []).map((img: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                        <img src={img} alt="Vehicle" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button onClick={() => removeMedia(img, 'image')} className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!vehicle.images || vehicle.images.length === 0) && (
                                    <div className="col-span-full py-8 text-center text-zinc-500 text-sm bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800">
                                        No images uploaded yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold flex items-center gap-2"><Video className="w-4 h-4 text-blue-500"/> Videos</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(vehicle.videos || []).map((vid: string, idx: number) => (
                                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                        <video src={vid} controls className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => removeMedia(vid, 'video')} className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!vehicle.videos || vehicle.videos.length === 0) && (
                                    <div className="col-span-full py-8 text-center text-zinc-500 text-sm bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800">
                                        No videos uploaded yet. (Demo uses local URLs)
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
                        <input 
                            type="file" 
                            accept="image/*,video/*" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect} 
                        />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
                        >
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            {isUploading ? 'Uploading...' : 'Upload Image or Video'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
