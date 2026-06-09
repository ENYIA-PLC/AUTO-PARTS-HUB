import React, { useState } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Truck, ArrowRight, Shield, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { BuyerProtectionModal } from './BuyerProtectionModal';
import { PartReviews } from './PartReviews';

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onCheckout: (product: Product) => void;
    isWishlisted?: boolean;
    onToggleWishlist?: (productId: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ isOpen, onClose, product, onCheckout, isWishlisted, onToggleWishlist }) => {
    const [isProtectionModalOpen, setIsProtectionModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

    if (!product) return null;

    return (
        <>
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/40 dark:bg-black/90 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 md:rounded-2xl w-full h-full md:h-auto md:max-h-[85vh] max-w-4xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 text-zinc-600 dark:text-zinc-400 hover:text-black dark:text-white transition-colors z-20 bg-black/50 p-2 rounded-full backdrop-blur-md"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 h-64 md:h-full relative bg-zinc-100 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                                    product.condition === 'New' ? 'bg-emerald-500/90 text-black' : 'bg-zinc-200/90 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700'
                                }`}>
                                    {product.condition}
                                </span>
                                {product.conditionGrade && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-amber-500/90 text-black">
                                        {product.conditionGrade}
                                    </span>
                                )}
                            </div>
                            {onToggleWishlist && (
                                <button 
                                    onClick={() => onToggleWishlist(product.id)}
                                    className="absolute bottom-4 right-4 z-10 p-3 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md hover:bg-white/40 dark:hover:bg-white/20 transition-colors"
                                >
                                    {/* Import Heart from lucide-react if not existing, let's just make sure it's in the import */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-zinc-900 dark:text-white'}`}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                </button>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-1/2 flex flex-col h-[calc(100%-16rem)] md:h-full">
                            <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] shrink-0 sticky top-0 z-10">
                                <button 
                                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'overview' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-black dark:hover:text-white'}`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                                <button 
                                    className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-amber-500 text-amber-500' : 'border-transparent text-zinc-500 hover:text-black dark:hover:text-white'}`}
                                    onClick={() => setActiveTab('reviews')}
                                >
                                    Reviews & Ratings
                                </button>
                            </div>

                            {activeTab === 'overview' ? (
                                <div className="p-6 md:p-8 overflow-y-auto flex-1">
                                    <div className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-2">{product.category}</div>
                                    <h2 className="text-2xl md:text-3xl font-black text-black dark:text-white mb-4 leading-tight">{product.name}</h2>
                                    
                                    <div className="flex items-center gap-4 mb-6 text-sm">
                                        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
                                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            <span className="font-bold text-black dark:text-white">{product.rating}</span>
                                            <span className="text-zinc-500">({product.reviews} reviews)</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-500 font-medium">
                                            <ShieldCheck className="w-4 h-4" />
                                            Verified Seller
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Description</h3>
                                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm">
                                            This high-quality {product.name.toLowerCase()} is perfect for your vehicle. Thoroughly inspected and tested to meet OEM specifications. 
                                            {product.condition === 'New' ? ' Brand new and never used, comes in original packaging.' : ' Carefully tested to ensure optimal performance.'} 
                                            Compatible with multiple vehicle models. Ensure you check your vehicle compatibility before purchasing.
                                        </p>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div 
                                            onClick={() => setIsProtectionModalOpen(true)}
                                            className="flex justify-between items-center p-4 bg-zinc-100/50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 cursor-pointer transition-colors group"
                                        >
                                            <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                                                <Shield className="w-5 h-5 text-amber-500" />
                                                <div>
                                                    <div className="font-bold text-sm text-black dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Escrow Protection</div>
                                                    <div className="text-xs text-zinc-500">Money held until delivery</div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                            <div className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                                                <Truck className="w-5 h-5 text-blue-500" />
                                                <div>
                                                    <div className="font-bold text-sm text-black dark:text-white">Nationwide Delivery</div>
                                                    <div className="text-xs text-zinc-500">Ships within 24 hours</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto">
                                    <PartReviews productId={product.id} />
                                </div>
                            )}

                            <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0a0a] mt-auto shrink-0">
                                <div className="flex items-end justify-between mb-4">
                                    <div>
                                        <div className="text-sm text-zinc-500 font-medium mb-1">Total Price</div>
                                        <div className="text-3xl font-black text-black dark:text-white">₦{product.price.toLocaleString()}</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onCheckout(product)}
                                    className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        <BuyerProtectionModal isOpen={isProtectionModalOpen} onClose={() => setIsProtectionModalOpen(false)} />
        </>
    );
};
