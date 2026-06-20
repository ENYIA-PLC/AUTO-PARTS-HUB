import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { ClipboardList, Package, ExternalLink, Calendar, MapPin, Search, ChevronDown, CheckCircle2, Truck, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const trackingStages = ['Processing', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'];

const orders = [
    {
        id: 'ORD-2023-8942',
        date: 'Oct 12, 2025',
        status: 'Delivered',
        currentStage: 4, // Index of trackingStages (Delivered)
        total: 45000,
        items: [
            { name: 'Ceramic Brake Pads', qty: 1 }
        ],
        courier: 'GIG Logistics',
        updates: [
            { time: 'Oct 15, 2025 14:30', desc: 'Package delivered to your address.' },
            { time: 'Oct 15, 2025 08:15', desc: 'Out for delivery.' },
            { time: 'Oct 14, 2025 21:40', desc: 'Arrived at local hub.' },
            { time: 'Oct 13, 2025 10:20', desc: 'Handed over to courier.' },
            { time: 'Oct 12, 2025 11:00', desc: 'Order confirmed and processing.' },
        ]
    },
    {
        id: 'ORD-2023-7721',
        date: 'Oct 08, 2025',
        status: 'In Transit',
        currentStage: 2, // Index of trackingStages (In Transit)
        total: 125000,
        items: [
            { name: 'Toyota Camry Alternator', qty: 1 }
        ],
        courier: 'DHL',
        updates: [
            { time: 'Oct 10, 2025 09:12', desc: 'In transit to destination facility.' },
            { time: 'Oct 09, 2025 16:45', desc: 'Departed from sorting center.' },
            { time: 'Oct 08, 2025 15:30', desc: 'Order processed.' },
        ]
    }
];

export const OrderHistory = () => {
    const { t } = useLanguage();
    const [expandedTrackingId, setExpandedTrackingId] = useState<string | null>(null);

    const toggleTracking = (id: string) => {
        setExpandedTrackingId(expandedTrackingId === id ? null : id);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                <ClipboardList className="w-6 h-6 text-amber-500" />
                            </div>
                            <h1 className="text-3xl font-black text-black dark:text-white">{t('myOrders')}</h1>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400">Track, return, or buy items again.</p>
                    </div>
                    
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                            type="text" 
                            placeholder="Search orders..."
                            className="w-full h-10 pl-10 pr-4 bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:bg-white dark:focus:bg-[#141414] focus:border-amber-500 rounded-lg text-sm text-black dark:text-white outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    {orders.map((order, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={order.id}
                            className="bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6"
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <div className="text-xs text-zinc-500 mb-1">Order Placed</div>
                                        <div className="font-bold text-black dark:text-white">{order.date}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-zinc-500 mb-1">Total</div>
                                        <div className="font-bold text-black dark:text-white">₦{order.total.toLocaleString()}</div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="text-xs text-zinc-500 mb-1">Order ID</div>
                                        <div className="font-mono text-xs font-bold text-black dark:text-white">{order.id}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                        order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center">
                                        <Package className="w-8 h-8 text-zinc-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-black dark:text-white mb-1">
                                            {order.items.map(item => `${item.qty}x ${item.name}`).join(', ')}
                                        </h3>
                                        <p className="text-sm text-zinc-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> Shipped via {order.courier}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button className="flex-1 md:flex-none px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl text-sm whitespace-nowrap hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                                        Buy Again
                                    </button>
                                    <button 
                                        onClick={() => toggleTracking(order.id)}
                                        className="flex-1 md:flex-none px-4 py-2 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white font-bold rounded-xl text-sm whitespace-nowrap hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Track
                                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedTrackingId === order.id ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedTrackingId === order.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="relative mb-12 hidden md:block">
                                                <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-amber-500 transition-all duration-1000 ease-out"
                                                        style={{ width: `${(order.currentStage / (trackingStages.length - 1)) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="relative flex justify-between">
                                                    {trackingStages.map((stage, sIdx) => {
                                                        const isCompleted = sIdx <= order.currentStage;
                                                        const isCurrent = sIdx === order.currentStage;
                                                        let Icon = CheckCircle2;
                                                        if (sIdx === 2) Icon = Truck;
                                                        if (sIdx === 4) Icon = Home;

                                                        return (
                                                            <div key={stage} className="flex flex-col items-center gap-2 z-10 w-24">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                                                                    isCompleted ? 'bg-amber-500 text-black' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                                                                } ${isCurrent ? 'ring-4 ring-amber-500/20' : ''}`}>
                                                                    <Icon className="w-5 h-5" />
                                                                </div>
                                                                <span className={`text-xs font-bold text-center ${isCompleted ? 'text-black dark:text-white' : 'text-zinc-400'}`}>
                                                                    {stage}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-bold text-black dark:text-white">Tracking History</h4>
                                                <div className="pl-4 border-l-2 border-zinc-200 dark:border-zinc-800 space-y-6 relative">
                                                    {order.updates.map((update, uIdx) => (
                                                        <div key={uIdx} className="relative">
                                                            <div className={`absolute -left-[21px] w-3 h-3 rounded-full ${
                                                                uIdx === 0 ? 'bg-amber-500 ring-4 ring-amber-500/20' : 'bg-zinc-300 dark:bg-zinc-700'
                                                            }`} />
                                                            <div className="text-sm font-bold text-black dark:text-white">{update.desc}</div>
                                                            <div className="text-xs text-zinc-500 mt-1">{update.time}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
