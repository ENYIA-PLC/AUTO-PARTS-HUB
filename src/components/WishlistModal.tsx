import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Heart, Package } from 'lucide-react';
import { mockProducts } from '../data';
import { motion } from 'framer-motion';

export const WishlistModal = () => {
    const { t } = useLanguage();
    // Simulate some saved items from mockProducts
    const savedProducts = [mockProducts[0], mockProducts[2]];

    return (
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-24">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-4">
                    <Heart className="w-8 h-8 text-amber-500 fill-amber-500" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-black dark:text-white mb-4">{t('wishlist')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">{t('savedItems')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {savedProducts.map((product) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-[#141414] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 transition-colors group cursor-pointer flex flex-col"
                    >
                        <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button className="w-8 h-8 bg-zinc-900/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-amber-500 transition-colors">
                                    <Heart className="w-4 h-4 fill-amber-500 text-amber-500" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-1">{product.name}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-black text-black dark:text-white">₦{product.price.toLocaleString()}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
