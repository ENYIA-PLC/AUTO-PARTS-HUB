import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wrench, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface MaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleName: string;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose, vehicleName }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
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
                    className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]"
                >
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#0a0a0a] z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Wrench className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-black dark:text-white">Maintenance Schedule</h2>
                                <p className="text-sm text-zinc-500">{vehicleName}</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                        <div className="space-y-6">
                            
                            {/* Upcoming */}
                            <div>
                                <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    Upcoming Service
                                </h3>
                                <div className="space-y-3">
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-black dark:text-white mb-1">Oil & Filter Change</h4>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Due in 500 miles or 1 month</p>
                                            </div>
                                            <button className="px-3 py-1.5 bg-amber-500 text-black text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors">
                                                Buy Parts
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-black dark:text-white mb-1">Tire Rotation</h4>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Due in 2,500 miles</p>
                                            </div>
                                            <button className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-xs font-bold rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors">
                                                Schedule
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* History */}
                            <div>
                                <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-zinc-400" />
                                    Service History
                                </h3>
                                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-300 dark:before:via-zinc-700 before:to-transparent">
                                    
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0a0a0a] bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#141414] shadow-sm">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-bold text-black dark:text-white text-sm">Brake Pad Replacement</h4>
                                                <time className="text-xs text-zinc-500">Oct 15, 2023</time>
                                            </div>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Replaced front and rear brake pads. Rotors resurfaced.</p>
                                        </div>
                                    </div>

                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0a0a0a] bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#141414] shadow-sm">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-bold text-black dark:text-white text-sm">Air Filter & Cabin Filter</h4>
                                                <time className="text-xs text-zinc-500">May 02, 2023</time>
                                            </div>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Standard replacement during spring tune-up.</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
