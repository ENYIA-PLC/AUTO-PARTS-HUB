import React, { useState } from 'react';
import { Star, MapPin, ShieldCheck, Package, Calendar, Award, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { mockProducts } from '../data';

export const SellerProfile = () => {
    const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'payments'>('listings');
    const [generatedLink, setGeneratedLink] = useState('');
    const [linkAmount, setLinkAmount] = useState('');
    const [linkReason, setLinkReason] = useState('');
    const [copied, setCopied] = useState(false);
    
    // Mock seller data
    const seller = {
        name: 'AutoTech Spares Ltd.',
        verified: true,
        rating: 4.8,
        reviews: 342,
        sales: '1.2k+',
        location: 'Lagos, Nigeria',
        joined: 'March 2023',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
        cover: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1200&h=400'
    };

    const sellerProducts = mockProducts.slice(0, 4);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            {/* Header / Cover */}
            <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-16 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <img 
                    src={seller.cover} 
                    alt="Cover" 
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                
                {/* Profile Pic & Basic Info positioned across the bottom edge */}
                <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[#0a0a0a] bg-zinc-200 dark:bg-zinc-800 shadow-xl">
                        <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Profile Info Details */}
            <div className="pl-8 md:pl-44 mb-12 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-black text-black dark:text-white">
                            {seller.name}
                        </h1>
                        {seller.verified && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-amber-500/20">
                                <ShieldCheck className="w-4 h-4" />
                                Verified Seller
                            </div>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">{seller.rating}</span>
                            <span>({seller.reviews} reviews)</span>
                        </div>
                        <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {seller.location}
                        </div>
                        <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            Joined {seller.joined}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 min-w-[120px] text-center">
                        <div className="text-2xl font-black text-amber-500 mb-1">{seller.sales}</div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Sales</div>
                    </div>
                    <div className="bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 min-w-[120px] text-center">
                        <div className="flex justify-center mb-1">
                            <Award className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Top Rated</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-zinc-200 dark:border-zinc-800 mb-8">
                <button 
                    onClick={() => setActiveTab('listings')}
                    className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'listings' ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-300'}`}
                >
                    Active Listings
                    {activeTab === 'listings' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-t-full" />
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'reviews' ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-300'}`}
                >
                    Seller Reviews
                    {activeTab === 'reviews' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-t-full" />
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('payments')}
                    className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${activeTab === 'payments' ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-300'}`}
                >
                    Payment Links
                    {activeTab === 'payments' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'listings' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sellerProducts.map((product) => (
                        <div key={product.id} className="group bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden hover:border-zinc-300 dark:border-zinc-700 transition-all cursor-pointer">
                            <div className="relative h-48 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        product.condition === 'New' ? 'bg-emerald-500 text-black' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700'
                                    }`}>
                                        {product.condition}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-3 line-clamp-2">{product.name}</h3>
                                <div className="text-xl font-black text-amber-500">₦{product.price.toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'reviews' && (
                <div className="bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                        {/* Overall Rating */}
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div className="text-5xl font-black text-black dark:text-white mb-2">{seller.rating}</div>
                            <div className="flex gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className={`w-5 h-5 ${star <= Math.floor(seller.rating) ? 'text-amber-500 fill-amber-500' : 'text-zinc-300 dark:text-zinc-700 fill-zinc-300 dark:fill-zinc-700'}`} />
                                ))}
                            </div>
                            <div className="text-sm font-bold text-zinc-500">{seller.reviews} total reviews</div>
                            
                            {seller.verified && (
                                <div className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                                    <ShieldCheck className="w-4 h-4" />
                                    Verified Seller
                                </div>
                            )}
                        </div>

                        {/* Rating Bars */}
                        <div className="flex-1 w-full space-y-3">
                            {[
                                { stars: 5, percent: 82, count: 280 },
                                { stars: 4, percent: 13, count: 45 },
                                { stars: 3, percent: 3, count: 10 },
                                { stars: 2, percent: 1.5, count: 5 },
                                { stars: 1, percent: 0.5, count: 2 },
                            ].map((row) => (
                                <div key={row.stars} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-12 shrink-0">
                                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{row.stars}</span>
                                        <Star className="w-3.5 h-3.5 justify-center text-amber-500 fill-amber-500" />
                                    </div>
                                    <div className="flex-1 h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-amber-500 rounded-full" 
                                            style={{ width: `${row.percent}%` }}
                                        />
                                    </div>
                                    <div className="w-12 text-right text-xs font-medium text-zinc-500 shrink-0">
                                        {row.count}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="w-5 h-5 text-amber-500" />
                            <h3 className="font-bold text-black dark:text-white">Seller Guarantees</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-4 bg-zinc-50 dark:bg-[#0a0a0a] rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                                <div className="mx-auto w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center mb-3">
                                    <Check className="w-5 h-5 text-amber-500" />
                                </div>
                                <div className="text-sm font-bold text-black dark:text-white mb-1">Authentic Parts</div>
                                <div className="text-xs text-zinc-500">100% genuine auto parts guaranteed.</div>
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-[#0a0a0a] rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                                <div className="mx-auto w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center mb-3">
                                    <Package className="w-5 h-5 text-amber-500" />
                                </div>
                                <div className="text-sm font-bold text-black dark:text-white mb-1">Fast Shipping</div>
                                <div className="text-xs text-zinc-500">Ships within 24 hours of order confirmation.</div>
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-[#0a0a0a] rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
                                <div className="mx-auto w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center mb-3">
                                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                                </div>
                                <div className="text-sm font-bold text-black dark:text-white mb-1">Secure Returns</div>
                                <div className="text-xs text-zinc-500">7-day return policy for defective items.</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'payments' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-8">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-black dark:text-white mb-2 text-center">Create Payment Link</h2>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">Generate a secure Paystack link to send directly to buyers for custom parts or wholesale orders.</p>
                    </div>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        setGeneratedLink(`https://paystack.com/pay/ph-custom-${Math.random().toString(36).substring(2, 9)}`);
                        setCopied(false);
                    }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">Item / Order Description</label>
                            <input
                                type="text"
                                value={linkReason}
                                onChange={e => setLinkReason(e.target.value)}
                                placeholder="e.g. Set of 4 Michelin Tires"
                                className="w-full h-12 px-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">Total Amount (₦)</label>
                            <input
                                type="number"
                                value={linkAmount}
                                onChange={e => setLinkAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full h-12 px-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors mt-4">
                            <LinkIcon className="w-4 h-4" /> Generate Payment Link
                        </button>
                    </form>

                    {generatedLink && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <div className="text-sm font-bold text-emerald-400 mb-3 text-center">Link Generated Successfully!</div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={generatedLink}
                                    className="flex-1 h-10 px-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-emerald-400 text-sm focus:outline-none font-mono"
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedLink);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-sm rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
};
