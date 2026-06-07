import React, { useState } from 'react';
import { X, Search, Package, Navigation, MapPin, Truck, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TrackOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose }) => {
    const [orderId, setOrderId] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [trackingResult, setTrackingResult] = useState<any>(null);

    if (!isOpen) return null;

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setIsSearching(true);
        // Simulate network request
        setTimeout(() => {
            setIsSearching(false);
            setTrackingResult({
                id: orderId.toUpperCase(),
                status: 'In Transit',
                estimatedDelivery: 'Tomorrow, 2:00 PM',
                origin: 'Lagos Warehouse',
                destination: 'Abuja Delivery Center',
                currentLocation: 'Approaching Lokoja Hub',
                steps: [
                    { label: 'Order Confirmed', description: 'Payment verified', completed: true },
                    { label: 'Packed', description: 'Item packaged securely', completed: true },
                    { label: 'Dispatched', description: 'Left origin facility', completed: true },
                    { label: 'In Transit', description: 'Moving to destination', completed: false, active: true },
                    { label: 'Delivered', description: 'Handed to customer', completed: false }
                ]
            });
        }, 1200);
    };

    const handleClose = () => {
        setOrderId('');
        setTrackingResult(null);
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-xl bg-white dark:bg-[#141414] rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[90vh]"
                >
                    <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-xl font-black text-black dark:text-white flex items-center gap-3">
                            <span className="w-8 h-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <Package className="w-5 h-5" />
                            </span>
                            Track Your Order
                        </h2>
                        <button 
                            onClick={handleClose}
                            className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                        <form onSubmit={handleTrack} className="mb-8">
                            <label className="block text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">Order Tracking ID</label>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <input 
                                        type="text" 
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        placeholder="e.g. PH-99214" 
                                        className="w-full h-12 pl-10 pr-4 bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 uppercase transition-colors"
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isSearching || !orderId.trim()}
                                    className="px-6 h-12 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold flex items-center gap-2 rounded-xl transition-colors min-w-[120px] justify-center"
                                >
                                    {isSearching ? (
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Navigation className="w-4 h-4" /> Track
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {trackingResult && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
                            >
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                                    <div>
                                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Order Number</p>
                                        <p className="text-lg font-black text-black dark:text-white">{trackingResult.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black text-amber-500 flex items-center gap-2 justify-end">
                                            <Truck className="w-5 h-5" />
                                            {trackingResult.status}
                                        </div>
                                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mt-1 flex items-center justify-end gap-1">
                                            <Clock className="w-4 h-4" /> Est. {trackingResult.estimatedDelivery}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-8 px-2">
                                    <div className="text-center">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <p className="text-xs font-bold text-black dark:text-white">{trackingResult.origin}</p>
                                    </div>
                                    <div className="flex-1 flex items-center mx-4 relative mt-[-24px]">
                                        <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: '60%' }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className="absolute left-0 h-1 bg-amber-500 rounded-full" 
                                        />
                                        <motion.div 
                                            initial={{ left: 0 }}
                                            animate={{ left: '60%' }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 border-2 border-white dark:border-[#141414] rounded-full shadow-lg flex items-center justify-center -ml-3"
                                        >
                                            <Truck className="w-3 h-3 text-white" />
                                        </motion.div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto mb-2">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <p className="text-xs font-bold text-black dark:text-white">{trackingResult.destination}</p>
                                    </div>
                                </div>

                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
                                    {trackingResult.steps.map((step: any, idx: number) => (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            {/* Icon */}
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white dark:border-[#0a0a0a] bg-zinc-200 dark:bg-zinc-800 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 
                                                has-[.completed]:bg-emerald-500 has-[.completed]:text-white 
                                                has-[.active]:bg-amber-500 has-[.active]:text-white has-[.active]:animate-pulse"
                                            >
                                                {step.completed && <CheckCircle2 className="w-3.5 h-3.5 completed" />}
                                                {step.active && <div className="w-2 h-2 rounded-full bg-white active" />}
                                                {!step.completed && !step.active && <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />}
                                            </div>
                                            
                                            {/* Text */}
                                            <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] pl-4 md:pl-0 pb-2">
                                                <div className={`p-3 rounded-xl border transition-colors ${
                                                    step.active ? 'bg-amber-500/10 border-amber-500/20' : 
                                                    step.completed ? 'bg-white dark:bg-[#141414] border-zinc-200 dark:border-zinc-800' : 
                                                    'bg-transparent border-transparent opacity-50'
                                                }`}>
                                                    <h4 className={`text-sm font-bold ${step.active ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-900 dark:text-zinc-100'}`}>{step.label}</h4>
                                                    <p className="text-xs text-zinc-500 mt-1">{step.active ? trackingResult.currentLocation : step.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
