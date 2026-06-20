import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Settings, Disc, Zap, Shield, Search, Wind } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const hotspots = [
    { id: 'engine', label: 'Engine Bay', icon: Settings, x: 25, y: 45, description: 'Alternators, Radiators, Spark Plugs, Belts' },
    { id: 'brakes_front', label: 'Front Brakes', icon: Disc, x: 20, y: 75, description: 'Front Brake Pads, Rotors, Calipers' },
    { id: 'brakes_rear', label: 'Rear Brakes', icon: Disc, x: 80, y: 75, description: 'Rear Brake Pads, Drums, Shoes' },
    { id: 'suspension', label: 'Suspension', icon: Shield, x: 50, y: 55, description: 'Shocks, Struts, Control Arms' },
    { id: 'electrical', label: 'Electrical', icon: Zap, x: 40, y: 40, description: 'Batteries, Starters, Sensors' },
    { id: 'body', label: 'Body & Lights', icon: Car, x: 10, y: 45, description: 'Headlights, Bumpers, Mirrors' },
    { id: 'exhaust', label: 'Exhaust', icon: Wind, x: 90, y: 65, description: 'Mufflers, Catalytic Converters, Pipes' },
];

export const InteractiveVehicleDiagram = () => {
    const { t } = useLanguage();
    const [activeSpot, setActiveSpot] = useState<string | null>('engine');

    return (
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-24">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-4">
                    <Car className="w-8 h-8 text-amber-500" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-black dark:text-white mb-4">
                    {t('interactiveDiagram') || 'Interactive Vehicle Diagram'}
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                    Select a section of the vehicle to find related parts and components visually.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Diagram Area */}
                <div className="flex-1 bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 relative overflow-hidden flex items-center justify-center min-h-[400px]">
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] flex items-center justify-center pointer-events-none">
                        <Car className="w-full h-full p-12 text-black dark:text-white" />
                    </div>
                    
                    {/* Abstract Car Silhouette */}
                    <div className="relative w-full max-w-2xl aspect-[2/1] mt-12 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 rounded-[120px] rounded-tl-[80px] rounded-tr-[40px] shadow-2xl flex items-center justify-center">
                        {/* Windows / Cabin Outline */}
                        <div className="absolute bottom-[40%] left-1/4 w-[40%] h-[60%] bg-zinc-100 dark:bg-zinc-950 rounded-tl-[100px] rounded-tr-[40px] opacity-20 border-t-4 border-white/20"></div>
                        
                        {/* Wheel Well Guidelines */}
                        <div className="absolute -bottom-8 left-[15%] w-24 h-24 rounded-full border-4 border-dashed border-black/10 dark:border-white/10"></div>
                        <div className="absolute -bottom-8 right-[15%] w-24 h-24 rounded-full border-4 border-dashed border-black/10 dark:border-white/10"></div>

                        {hotspots.map(spot => (
                            <button
                                key={spot.id}
                                onClick={() => setActiveSpot(spot.id)}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${
                                    activeSpot === spot.id 
                                        ? 'bg-amber-500 text-black scale-125 shadow-[0_0_30px_rgba(245,158,11,0.6)]' 
                                        : 'bg-black/90 dark:bg-white/90 backdrop-blur-md text-amber-500 hover:scale-110 shadow-lg'
                                }`}
                                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                            >
                                <spot.icon className="w-5 h-5" />
                                
                                {activeSpot === spot.id && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-amber-500"></span>
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details Area */}
                <div className="w-full lg:w-96 flex flex-col gap-4">
                    {hotspots.map(spot => (
                        <div 
                            key={spot.id}
                            className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                                activeSpot === spot.id 
                                    ? 'bg-amber-500 border-amber-500 text-black shadow-xl shadow-amber-500/20 scale-[1.02]' 
                                    : 'bg-white dark:bg-[#141414] border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:border-amber-500/50'
                            }`}
                            onClick={() => setActiveSpot(spot.id)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${activeSpot === spot.id ? 'bg-black/10' : 'bg-zinc-100 dark:bg-zinc-900'}`}>
                                        <spot.icon className={`w-5 h-5 ${activeSpot === spot.id ? 'text-black' : 'text-amber-500'}`} />
                                    </div>
                                    <h3 className="font-bold">{spot.label}</h3>
                                </div>
                            </div>
                            
                            <AnimatePresence>
                                {activeSpot === spot.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-sm text-black/80 mb-4 font-medium leading-relaxed mt-2">
                                            {spot.description}
                                        </p>
                                        <button className="w-full py-2.5 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                            <Search className="w-4 h-4" /> Shop {spot.label}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
