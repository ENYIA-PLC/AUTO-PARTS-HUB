import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Navigation, Signal, Crosshair, Map } from 'lucide-react';

interface VehicleTrackerModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleName: string;
}

export const VehicleTrackerModal: React.FC<VehicleTrackerModalProps> = ({ isOpen, onClose, vehicleName }) => {
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [findingLocation, setFindingLocation] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setUserLocation(null);
            setFindingLocation(false);
        }
    }, [isOpen]);

    const handleLocateMe = () => {
        setFindingLocation(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setFindingLocation(false);
                },
                (error) => {
                    console.error("Error obtaining geolocation", error);
                    setFindingLocation(false);
                }
            );
        } else {
            setFindingLocation(false);
        }
    };

    if (!isOpen) return null;

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
                    className="relative w-full max-w-4xl bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row h-auto max-h-[90vh]"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
                    </button>

                    {/* Tracker Map View (Left / Top) */}
                    <div className="w-full md:w-2/3 h-80 md:h-auto relative bg-zinc-100 dark:bg-zinc-900 overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_2px,transparent_0)] bg-[length:40px_40px]" />
                        
                        <div className="absolute top-4 left-4 z-10 flex gap-2">
                            <div className="bg-white/90 dark:bg-black/90 backdrop-blur border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-500 shadow-sm">
                                <Signal className="w-3 h-3 animate-pulse" /> Live GPS Lock
                            </div>
                        </div>

                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                            {/* History trail */}
                            <path 
                                d="M 10 50 Q 30 70 50 50" 
                                fill="none" 
                                stroke={userLocation ? 'rgba(52, 211, 153, 0.4)' : 'rgba(245, 158, 11, 0.4)'} 
                                strokeWidth="0.5" 
                                strokeDasharray="1,1" 
                            />
                            {/* Projected path (if tracking to current location) */}
                            {userLocation && (
                                <path 
                                    d="M 50 50 Q 70 30 90 20" 
                                    fill="none" 
                                    stroke="rgba(52, 211, 153, 0.8)" 
                                    strokeWidth="0.5" 
                                    strokeDasharray="2,2" 
                                />
                            )}
                        </svg>

                        {/* Vehicle Marker */}
                        <motion.div 
                            className={`absolute w-10 h-10 ${userLocation ? 'bg-emerald-500' : 'bg-amber-500'} rounded-full flex items-center justify-center text-black z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]`}
                            initial={{ left: '50%', top: '50%' }}
                            animate={{ 
                                left: userLocation ? '90%' : '50%', 
                                top: userLocation ? '20%' : '50%',
                                boxShadow: userLocation ? '0 0 30px rgba(16,185,129,0.8)' : '0 0 20px rgba(245,158,11,0.5)'
                            }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                            style={{ transform: 'translate(-50%, -50%)' }}
                        >
                            <Navigation className="w-5 h-5 text-black" style={{ transform: userLocation ? 'rotate(45deg)' : 'rotate(0deg)' }} />
                            {/* Pulse effect */}
                            <div className="absolute inset-0 rounded-full bg-white opacity-50 animate-ping" />
                        </motion.div>

                        {/* Origin point (Starting geo-fence) */}
                        <div className="absolute left-[10%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <div className="w-3 h-3 bg-zinc-400 dark:bg-zinc-600 rounded-full border border-zinc-200 dark:border-zinc-800 z-10" />
                        </div>
                    </div>

                    {/* Controls & Details (Right / Bottom) */}
                    <div className="w-full md:w-1/3 p-6 flex flex-col bg-white dark:bg-[#0a0a0a]">
                        <h2 className="text-2xl font-black text-black dark:text-white mb-2">Live Tracking</h2>
                        <p className="text-zinc-500 text-sm mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                            Currently tracking <span className="font-bold text-black dark:text-white">{vehicleName}</span>
                        </p>

                        <div className="space-y-4 flex-1">
                            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                <span className="text-xs font-bold text-zinc-500 uppercase">Engine Status</span>
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Running</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                <span className="text-xs font-bold text-zinc-500 uppercase">Current Speed</span>
                                <span className="text-sm font-black text-black dark:text-white">{userLocation ? '45 km/h' : '0 km/h'}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                <span className="text-xs font-bold text-zinc-500 uppercase">Est. Distance from you</span>
                                <span className="text-sm font-black text-black dark:text-white">{userLocation ? '0.0 km' : 'Unknown'}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                            <button 
                                onClick={handleLocateMe}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                                    userLocation 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200'
                                }`}
                            >
                                <Crosshair className={`w-4 h-4 ${findingLocation ? 'animate-spin' : ''}`} />
                                {userLocation ? 'Location Pinned' : findingLocation ? 'Locating Your Phone...' : 'Pin Distance to My Phone'}
                            </button>
                        </div>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};
