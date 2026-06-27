import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface RecallsModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleName: string;
    hasRecalls?: boolean;
}

export const RecallsModal: React.FC<RecallsModalProps> = ({ isOpen, onClose, vehicleName, hasRecalls = true }) => {
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
                    className="relative w-full max-w-xl bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]"
                >
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#0a0a0a] z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <Search className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-black dark:text-white">Safety Recalls</h2>
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
                        {hasRecalls ? (
                            <div className="space-y-4">
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-4">
                                    <div className="shrink-0 mt-1">
                                        <AlertOctagon className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded uppercase">Incomplete</span>
                                            <span className="text-sm text-zinc-500 font-mono">NHTSA CAMPAIGN NUMBER: 23V-123</span>
                                        </div>
                                        <h3 className="font-bold text-black dark:text-white mb-2">Fuel Pump May Fail and Cause Engine Stall</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                            An engine stall while driving can increase the risk of a crash. Dealers will replace the fuel pump assembly, free of charge.
                                        </p>
                                        <button className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors">
                                            Find Local Dealer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-2">0 Open Recalls</h3>
                                <p className="text-zinc-500 max-w-sm">
                                    Good news! There are no open safety recalls for this vehicle at this time.
                                </p>
                            </div>
                        )}
                        <p className="text-xs text-zinc-500 mt-6 text-center">
                            Data provided by NHTSA. Always consult your local dealership for the most accurate and up-to-date information regarding your specific vehicle.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
