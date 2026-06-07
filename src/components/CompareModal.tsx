import React from 'react';
import { X, Star, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface CompareModalProps {
    isOpen: boolean;
    onClose: () => void;
    products: Product[];
}

export const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose, products }) => {
    if (!isOpen || products.length === 0) return null;

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
                    className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-[#141414] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200 dark:border-zinc-800"
                >
                    <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-2xl font-black text-black dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </span>
                            Compare Parts
                        </h2>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-[#0a0a0a]">
                                    <div className="h-48 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all"
                                        />
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-1">{product.category}</div>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                                        
                                        <div className="text-2xl font-black text-black dark:text-white mb-6">
                                            ₦{product.price.toLocaleString()}
                                        </div>

                                        <div className="space-y-4 flex-1">
                                            <div>
                                                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Condition</div>
                                                <div className="font-medium text-black dark:text-white">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                                                        product.condition === 'New' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                                                    }`}>
                                                        {product.condition}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Grade / Quality</div>
                                                <div className="font-medium text-black dark:text-white">
                                                    {product.conditionGrade || <span className="text-zinc-400 italic">Not specified</span>}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Rating</div>
                                                <div className="flex items-center gap-1 font-medium text-black dark:text-white">
                                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                    {product.rating} <span className="text-zinc-500 text-xs font-normal">({product.reviews} reviews)</span>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Description</div>
                                                <div className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                                                    {product.description}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
