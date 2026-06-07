import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BuyerProtectionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BuyerProtectionModal: React.FC<BuyerProtectionModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
                    className="relative w-full max-w-lg bg-white dark:bg-[#141414] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh]"
                >
                    <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-xl font-black text-black dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </span>
                            Buyer Protection
                        </h2>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-6">
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                            We ensure that your purchase is protected from start to finish. Our escrow system and strict verification policies guarantee a safe shopping experience.
                        </p>

                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                <div className="mt-1">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-black dark:text-white mb-1">Secure Escrow Payments</h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        Your payment is held securely in our escrow system. The seller does not receive the funds until you have received and confirmed the part matches the description.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                <div className="mt-1">
                                    <AlertCircle className="w-6 h-6 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-black dark:text-white mb-1">Strict Seller Verification</h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        All sellers undergo a strict KYC process, checking business registrations and identity verification. We only allow verified sellers to list parts.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                <div className="mt-1">
                                    <RefreshCcw className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-black dark:text-white mb-1">Money-Back Guarantee & Refunds</h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        If the part doesn't arrive as described or within the promised timeframe, you are eligible for a full refund. You have up to 7 days upon delivery to raise a dispute.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0a0a]">
                        <button 
                            onClick={onClose}
                            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors"
                        >
                            Understood
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
