import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, ExternalLink, CheckCircle2, AlertTriangle, FileText, Upload } from 'lucide-react';

interface CMRISModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleName: string;
}

export const CMRISModal: React.FC<CMRISModalProps> = ({ isOpen, onClose, vehicleName }) => {
    const [status, setStatus] = useState<'unregistered' | 'pending' | 'registered'>('unregistered');

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
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-black dark:text-white">Police CMRIS</h2>
                                {vehicleName && <p className="text-sm text-zinc-500">{vehicleName}</p>}
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
                            
                            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                                <div className="flex gap-4">
                                    <div className="shrink-0 mt-1">
                                        <FileText className="w-6 h-6 text-zinc-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-black dark:text-white mb-2">Central Motor Registry Information System</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                            The CMRIS is the Nigeria Police Force central repository for motor vehicle information. 
                                            Registering your vehicle helps in recovering it in case of theft and ensures compliance with NPF regulations.
                                        </p>
                                        <a 
                                            href="https://cmris.npf.gov.ng/login" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors"
                                        >
                                            Visit Official CMRIS Portal <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Status Section */}
                            <div>
                                <h3 className="text-lg font-bold text-black dark:text-white mb-4">CMRIS Status</h3>
                                
                                {status === 'unregistered' && (
                                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                                            <AlertTriangle className="w-8 h-8 text-amber-500" />
                                        </div>
                                        <h4 className="font-bold text-black dark:text-white mb-2">No CMRIS Record Found</h4>
                                        <p className="text-sm text-zinc-500 max-w-sm mb-6">
                                            We don't have a CMRIS certificate on file for this vehicle. If you've already registered, you can upload your certificate below.
                                        </p>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => setStatus('pending')}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                                            >
                                                <Upload className="w-4 h-4" /> Upload Certificate
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {status === 'pending' && (
                                    <div className="border border-amber-500/30 bg-amber-500/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <h4 className="font-bold text-black dark:text-white mb-2">Verifying Certificate</h4>
                                        <p className="text-sm text-zinc-500 max-w-sm mb-4">
                                            Your uploaded certificate is currently being verified. This usually takes up to 24 hours.
                                        </p>
                                        <button 
                                            onClick={() => setStatus('registered')}
                                            className="text-xs text-amber-600 hover:underline"
                                        >
                                            Simulate Verification Complete
                                        </button>
                                    </div>
                                )}

                                {status === 'registered' && (
                                    <div className="border border-green-500/30 bg-green-500/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h4 className="font-bold text-black dark:text-white mb-2">CMRIS Active</h4>
                                        <p className="text-sm text-zinc-500 max-w-sm mb-6">
                                            This vehicle has a verified CMRIS certificate on file.
                                        </p>
                                        <div className="w-full bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex justify-between items-center text-left">
                                            <div>
                                                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Certificate Number</p>
                                                <p className="font-mono font-medium text-black dark:text-white">CMR-2023-8472910X</p>
                                            </div>
                                            <button className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-lg transition-colors">
                                                View Document
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
