import React from 'react';
import { useLanguage } from '../LanguageContext';
import { Users, Star, MapPin, Wrench, ShieldCheck, Mail, PhoneCall } from 'lucide-react';
import { motion } from 'framer-motion';

const mechanics = [
    {
        id: 1,
        name: 'Oluwaseun Auto Care',
        specialty: 'Engine & Transmission',
        rating: 4.9,
        reviews: 124,
        location: 'Ikeja, Lagos',
        verified: true,
        image: 'https://images.unsplash.com/photo-1613214150337-12c8b88820f1?w=800&auto=format&fit=crop&q=80',
        available: true
    },
    {
        id: 2,
        name: 'Chidi & Sons Garage',
        specialty: 'Suspension & Brakes',
        rating: 4.7,
        reviews: 89,
        location: 'Surulere, Lagos',
        verified: true,
        image: 'https://images.unsplash.com/photo-1598257006458-087169a1f185?w=800&auto=format&fit=crop&q=80',
        available: false
    },
    {
        id: 3,
        name: 'Emeka Electricals',
        specialty: 'Auto Electronics',
        rating: 4.8,
        reviews: 215,
        location: 'Gbagada, Lagos',
        verified: true,
        image: 'https://images.unsplash.com/photo-1632823465324-3ac86d8a7cde?w=800&auto=format&fit=crop&q=80',
        available: true
    }
];

export const MechanicsGrid = () => {
    const { t } = useLanguage();

    return (
        <div className="max-w-7xl mx-auto px-4 pt-12 pb-24">
            <div className="max-w-3xl mx-auto text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-4">
                    <Wrench className="w-8 h-8 text-blue-500" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-black dark:text-white mb-4">{t('mechanics')}</h1>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg">{t('findMechanic')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mechanics.map((mechanic) => (
                    <motion.div
                        key={mechanic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-[#141414] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-colors"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img src={mechanic.image} alt={mechanic.name} className="w-full h-full object-cover" />
                            {mechanic.verified && (
                                <div className="absolute top-4 left-4 flex items-center gap-1 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                                    <ShieldCheck className="w-4 h-4" /> Verified
                                </div>
                            )}
                            <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/80 backdrop-blur-md text-amber-500 text-sm font-bold px-3 py-1 rounded-full">
                                <Star className="w-4 h-4 fill-amber-500" />
                                {mechanic.rating} ({mechanic.reviews})
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-black dark:text-white mb-1">{mechanic.name}</h3>
                            <p className="text-sm font-medium text-blue-500 mb-4">{mechanic.specialty}</p>

                            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
                                <MapPin className="w-4 h-4" />
                                {mechanic.location}
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-black dark:bg-white text-white dark:text-black py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                                    <PhoneCall className="w-4 h-4" /> Call
                                </button>
                                <button className="w-10 h-10 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-xl flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
