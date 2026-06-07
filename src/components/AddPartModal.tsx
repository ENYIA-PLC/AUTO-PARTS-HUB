import React, { useState } from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { categories } from '../data';
import { useToast } from '../ToastContext';

interface AddPartModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddPartModal: React.FC<AddPartModalProps> = ({ isOpen, onClose }) => {
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate network request
        setTimeout(() => {
            setIsSubmitting(false);
            addToast('Your part has been successfully listed!', 'success');
            onClose();
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-black dark:hover:text-white transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                            <h2 className="text-2xl font-black text-black dark:text-white">Sell a Part</h2>
                            <p className="text-zinc-500 text-sm mt-1">List your auto part to thousands of buyers.</p>
                        </div>

                        <div className="overflow-y-auto p-8 scrollbar-hide">
                            <form id="add-part-form" onSubmit={handleSubmit} className="space-y-6">
                                {/* Image Upload Simulation */}
                                <div>
                                    <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Item Photos</label>
                                    <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                                        <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                                            <Upload className="w-6 h-6 text-amber-500" />
                                        </div>
                                        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Click to upload or drag and drop</p>
                                        <p className="text-xs text-zinc-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Part Name / Title</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Toyota Camry 2018 Front Bumper" 
                                            required
                                            className="w-full h-12 px-4 bg-white dark:bg-[#141414] border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-black dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Category</label>
                                        <select 
                                            required
                                            className="w-full h-12 px-4 bg-white dark:bg-[#141414] border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-black dark:text-white appearance-none"
                                        >
                                            <option value="" disabled selected>Select category...</option>
                                            {categories.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Condition</label>
                                        <select 
                                            required
                                            className="w-full h-12 px-4 bg-white dark:bg-[#141414] border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-black dark:text-white appearance-none"
                                        >
                                            <option value="" disabled selected>Select condition...</option>
                                            <option value="New">New</option>
                                            <option value="Used">Used</option>
                                            <option value="Refurbished">Refurbished</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Condition Grade</label>
                                        <select 
                                            className="w-full h-12 px-4 bg-white dark:bg-[#141414] border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-black dark:text-white appearance-none"
                                        >
                                            <option value="">None / Not Applicable</option>
                                            <option value="Grade A (Excellent)">Grade A (Excellent)</option>
                                            <option value="Grade B (Good)">Grade B (Good)</option>
                                            <option value="Grade C (Fair)">Grade C (Fair)</option>
                                            <option value="OEM Equivalent">OEM Equivalent</option>
                                            <option value="Premium Aftermarket">Premium Aftermarket</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Price (₦)</label>
                                        <input 
                                            type="number" 
                                            placeholder="0.00" 
                                            required
                                            className="w-full h-12 px-4 bg-white dark:bg-[#141414] border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-black dark:text-white"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Stock / Quantity</label>
                                        <input 
                                            type="number" 
                                            placeholder="1" 
                                            defaultValue="1"
                                            required
                                            className="w-full h-12 px-4 bg-white dark:bg-[#141414] border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-black dark:text-white"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Description</label>
                                        <textarea 
                                            placeholder="Describe the condition, compatibility, and any other details..." 
                                            rows={4}
                                            required
                                            className="w-full px-4 py-3 bg-white dark:bg-[#141414] border border-zinc-300 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-black dark:text-white resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#141414] shrink-0">
                            <button 
                                type="submit"
                                form="add-part-form"
                                disabled={isSubmitting}
                                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    'Listing Part...'
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Publish Listing
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
