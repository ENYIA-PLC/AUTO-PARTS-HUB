import React, { useEffect, useState } from 'react';
import { Map, Package, MapPin, Truck, CheckCircle2, Crosshair, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { TrackOrderModal } from './TrackOrderModal';

export const TrackerMap = () => {
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [findingLocation, setFindingLocation] = useState(false);
    const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

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

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#141414] p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div>
                    <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-500" /> Live Geolocation Tracker
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Track your order's proximity to your real-world location.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => setIsTrackModalOpen(true)}
                        className="flex-1 md:flex-none px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-xl text-sm font-bold text-black transition-colors flex items-center justify-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Track by ID
                    </button>
                    <button 
                        onClick={handleLocateMe}
                        disabled={findingLocation}
                        className="flex-1 md:flex-none px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 hover:border-amber-500 rounded-xl text-sm font-bold text-zinc-800 dark:text-zinc-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Crosshair className={`w-4 h-4 ${findingLocation ? 'animate-spin text-amber-500' : 'text-zinc-600 dark:text-zinc-400'}`} />
                        {findingLocation ? 'Locating...' : 'Use My Location'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden p-1">
                {/* Simulated Map Area */}
                <div className="relative h-80 bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden inset-ring-1 inset-ring-zinc-800">
                    {/* Map Grid Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_2px,transparent_0)] bg-[length:40px_40px]" />
                    
                    {/* Route Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path 
                            d="M 20 80 Q 40 40 80 20" 
                            fill="none" 
                            stroke="rgba(245, 158, 11, 0.2)" 
                            strokeWidth="1" 
                            strokeDasharray="2,2" 
                        />
                        <motion.path 
                            d="M 20 80 Q 40 40 80 20" 
                            fill="none" 
                            stroke="rgba(245, 158, 11, 1)" 
                            strokeWidth="0.5" 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: userLocation ? 0.85 : 0.6 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    </svg>

                    {/* Origin point */}
                    <div className="absolute left-[20%] top-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-4 h-4 bg-zinc-700 rounded-full border-2 border-zinc-200 dark:border-zinc-900 z-10" />
                        <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 bg-zinc-100/50 dark:bg-zinc-900/50 px-2 py-0.5 rounded backdrop-blur-sm">Lagos Hub</span>
                    </div>

                    {/* Destination point (Dynamic based on geoloc) */}
                    <div className="absolute left-[80%] top-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 z-10 ${userLocation ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-zinc-700'}`} />
                        <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 bg-zinc-100/50 dark:bg-zinc-900/50 px-2 py-0.5 rounded text-center backdrop-blur-sm">
                            {userLocation ? `Your Location\n(${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})` : 'Abuja Auto Shop'}
                        </span>
                    </div>

                    {/* Moving Truck */}
                    <motion.div 
                        className="absolute w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black z-20 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                        initial={{ left: '20%', top: '80%' }}
                        animate={{ 
                            left: userLocation ? '74%' : '56%', 
                            top: userLocation ? '26%' : '44%' 
                        }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        style={{ transform: 'translate(-50%, -50%)' }}
                    >
                        <Truck className="w-4 h-4" />
                    </motion.div>
                </div>

                {/* Status Timeline */}
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Order #PH-99214</h2>
                            <p className="text-sm text-zinc-500">Shipped via DHL (Phase 3 Integration Planned)</p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-black text-amber-500">{userLocation ? 'Approaching' : 'In Transit'}</div>
                            <p className="text-sm text-zinc-500">{userLocation ? 'Estimated delivery: Within 30 mins' : 'Estimated delivery: Today, 4:00 PM'}</p>
                        </div>
                    </div>

                    <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 space-y-8 pb-4">
                        <div className="relative pl-8">
                            <div className="absolute w-4 h-4 rounded-full bg-emerald-500 -left-2 top-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Order Confirmed</h4>
                            <p className="text-sm text-zinc-500">Payment successful via Paystack</p>
                        </div>
                        <div className="relative pl-8">
                            <div className="absolute w-4 h-4 rounded-full bg-emerald-500 -left-2 top-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Dispatched from Lagos Hub</h4>
                            <p className="text-sm text-zinc-500">Handed over to courier</p>
                        </div>
                        <div className="relative pl-8">
                            <div className={`absolute w-4 h-4 rounded-full -left-2 top-1 flex items-center justify-center ${userLocation ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`}>
                                {!userLocation && <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />}
                            </div>
                            <h4 className="font-bold text-zinc-800 dark:text-zinc-200">In Transit to Destination</h4>
                            <p className="text-sm text-zinc-500">Currently passing Lokoja</p>
                        </div>
                        <div className={`relative pl-8 ${userLocation ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`absolute w-4 h-4 rounded-full items-center justify-center -left-2 top-1 ${userLocation ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] flex' : 'bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700'}`}>
                                {userLocation && <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />}
                            </div>
                            <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Out for Delivery</h4>
                            <p className="text-sm text-zinc-500">{userLocation ? 'Courier is approaching your location' : 'Courier will call before arrival'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <TrackOrderModal 
                isOpen={isTrackModalOpen} 
                onClose={() => setIsTrackModalOpen(false)} 
            />
        </div>
    );
};
