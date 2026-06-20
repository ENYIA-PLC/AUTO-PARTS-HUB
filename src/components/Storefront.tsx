import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, Package, Clock, ShieldCheck, Map, Heart, Scale, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import { categories, mockProducts } from '../data';
import { Product } from '../types';
import { CheckoutModal } from './CheckoutModal';
import { ProductDetailsModal } from './ProductDetailsModal';
import { CompareModal } from './CompareModal';
import { useToast } from '../ToastContext';
import { useLanguage } from '../LanguageContext';

export const Storefront = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
    const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
    const [paymentLink, setPaymentLink] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [compareList, setCompareList] = useState<Product[]>([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const { addToast } = useToast();
    const { t } = useLanguage();

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            setProducts(mockProducts);
            localStorage.setItem('storefront_parts_cache', JSON.stringify(mockProducts));
            addToast('Back online. Parts updated.', 'success');
        };
        
        const handleOffline = () => {
            setIsOffline(true);
            addToast('You are offline. Viewing cached parts.', 'info');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        const cached = localStorage.getItem('storefront_parts_cache');
        
        if (navigator.onLine) {
            setProducts(mockProducts);
            localStorage.setItem('storefront_parts_cache', JSON.stringify(mockProducts));
        } else if (cached) {
            try {
                setProducts(JSON.parse(cached));
            } catch (e) {
                setProducts(mockProducts);
            }
        } else {
            setProducts(mockProducts);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory ? p.category === activeCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            {isOffline && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 font-medium text-sm">
                    <WifiOff className="w-4 h-4" />
                    You are offline. Viewing cached parts.
                </div>
            )}

            {/* Hero / Vision statement */}
            <div className="text-center mb-8 py-16 px-4 bg-gradient-to-b from-[#141414] to-transparent rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50">
                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black text-black dark:text-white mb-6 tracking-tight"
                >
                    {t('nigeriaNumberOne')} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                        {t('autoPartsMarketplace')}
                    </span>
                </motion.h1>
                <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500"/> {t('escrowProtected')}</span>
                    <span className="flex items-center gap-1"><Package className="w-4 h-4 text-amber-500"/> {t('listingsCount')}</span>
                    <span className="flex items-center gap-1"><Map className="w-4 h-4 text-blue-500"/> {t('liveTracking')}</span>
                </div>
            </div>

            {paymentLink && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
                >
                    <div>
                        <h4 className="font-bold text-emerald-400">{t('orderSuccess')}</h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">Your mock transaction has been recorded.</p>
                    </div>
                    <a 
                        href={paymentLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-bold rounded-xl transition-colors whitespace-nowrap text-center"
                        onClick={() => setPaymentLink(null)}
                    >
                        {t('viewReceipt')}
                    </a>
                </motion.div>
            )}

            {/* Sticky Search & Category Filter */}
            <div className="sticky top-16 z-40 bg-zinc-50 dark:bg-[#0a0a0a] pt-4 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50 mb-8 max-w-7xl mx-auto backdrop-blur-xl bg-opacity-90 dark:bg-opacity-90">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input 
                            type="text" 
                            placeholder={t('searchPlaceholder')}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 bg-white dark:bg-[#141414] border border-zinc-300/50 dark:border-zinc-700/50 rounded-2xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                        />
                    </div>
                    <button className="h-14 px-6 flex items-center justify-center gap-2 bg-white dark:bg-[#141414] border border-zinc-300/50 dark:border-zinc-700/50 rounded-2xl text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors font-semibold">
                        <Filter className="w-5 h-5" />
                        {t('filters')}
                    </button>
                </div>
                
                {/* Horizontal Category Scroll */}
                <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
                    <div className="flex gap-3 min-w-max">
                        <button 
                            onClick={() => setActiveCategory(null)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                activeCategory === null 
                                ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black shadow-md' 
                                : 'bg-white dark:bg-[#141414] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50'
                            }`}
                        >
                            {t('allParts')}
                        </button>
                        {categories.map(category => (
                            <button 
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                                    activeCategory === category 
                                    ? 'bg-amber-500 text-black shadow-md' 
                                    : 'bg-white dark:bg-[#141414] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={product.id} 
                        onClick={() => setDetailsProduct(product)}
                        className="group bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.05)] transition-all cursor-pointer"
                    >
                        <div className="relative h-56 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                            <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal"
                            />
                            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                                    product.condition === 'New' ? 'bg-emerald-500/90 text-black' : 'bg-zinc-200/90 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700'
                                }`}>
                                    {product.condition === 'New' ? t('conditionNew') : t('conditionUsed')}
                                </span>
                                {product.conditionGrade && (
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-amber-500/90 text-black">
                                        {product.conditionGrade}
                                    </span>
                                )}
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const next = new Set(wishlist);
                                    if (next.has(product.id)) {
                                        next.delete(product.id);
                                        addToast('Removed from wishlist', 'info');
                                    } else {
                                        next.add(product.id);
                                        addToast('Saved to wishlist!', 'success');
                                    }
                                    setWishlist(next);
                                }}
                                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md hover:bg-white/40 dark:hover:bg-white/20 transition-colors"
                            >
                                <Heart className={`w-5 h-5 ${wishlist.has(product.id) ? 'fill-red-500 text-red-500' : 'text-zinc-900 dark:text-white'}`} />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-2">{t(product.category.toLowerCase() as any) || product.category}</div>
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-1">{product.name}</h3>
                            
                            <div className="flex items-center gap-1 mb-6 text-sm text-zinc-500">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="font-medium text-zinc-800 dark:text-zinc-200">{product.rating}</span>
                                <span>({product.reviews} {t('reviews')})</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-2xl font-black text-black dark:text-white">₦{product.price.toLocaleString()}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            const isCompared = compareList.find(p => p.id === product.id);
                                            if (isCompared) {
                                                setCompareList(prev => prev.filter(p => p.id !== product.id));
                                                addToast('Removed from compare', 'info');
                                            } else {
                                                if (compareList.length >= 3) {
                                                    addToast('You can compare up to 3 parts max.', 'error');
                                                } else {
                                                    setCompareList(prev => [...prev, product]);
                                                    addToast('Added to compare', 'success');
                                                }
                                            }
                                        }}
                                        className={`w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-colors ${compareList.find(p => p.id === product.id) ? 'bg-amber-500 text-black border-amber-500' : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                        title="Compare"
                                    >
                                        <Scale className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setCheckoutProduct(product); }}
                                        className="w-12 h-12 rounded-full bg-zinc-100 text-black flex items-center justify-center hover:bg-amber-500 transition-colors"
                                    >
                                        <ShoppingCart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-zinc-500">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">{t('noPartsFound')}</p>
                </div>
            )}

            {compareList.length > 0 && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-zinc-900 border border-zinc-700 rounded-full shadow-2xl flex items-center gap-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-black flex flex-col items-center justify-center text-sm">
                            {compareList.length}
                        </div>
                        <span className="text-white font-medium text-sm hidden md:inline">{t('partsSelected')}</span>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsCompareModalOpen(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2 rounded-full font-bold text-sm transition-colors"
                        >
                            {t('compareDetails')}
                        </button>
                        <button 
                            onClick={() => setCompareList([])}
                            className="text-zinc-400 hover:text-white px-3 text-sm transition-colors"
                        >
                            {t('clear')}
                        </button>
                    </div>
                </motion.div>
            )}

            <CheckoutModal 
                isOpen={checkoutProduct !== null} 
                onClose={() => setCheckoutProduct(null)} 
                product={checkoutProduct}
                onSuccess={(link) => {
                    setPaymentLink(link);
                    setCheckoutProduct(null);
                    setDetailsProduct(null);
                }}
            />

            <CompareModal 
                isOpen={isCompareModalOpen}
                onClose={() => setIsCompareModalOpen(false)}
                products={compareList}
            />

            <ProductDetailsModal
                isOpen={detailsProduct !== null}
                onClose={() => setDetailsProduct(null)}
                product={detailsProduct}
                onCheckout={(product) => setCheckoutProduct(product)}
                isWishlisted={detailsProduct ? wishlist.has(detailsProduct.id) : false}
                onToggleWishlist={(productId) => {
                    const next = new Set(wishlist);
                    if (next.has(productId)) {
                        next.delete(productId);
                        addToast('Removed from wishlist', 'info');
                    } else {
                        next.add(productId);
                        addToast('Saved to wishlist!', 'success');
                    }
                    setWishlist(next);
                }}
            />
        </div>
    );
};
