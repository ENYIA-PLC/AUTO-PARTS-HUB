import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Wrench, Search, ChevronRight, PlayCircle, PenTool, Box, AlertTriangle, ShieldCheck } from 'lucide-react';

const diyGuides = [
    {
        id: '1',
        title: 'How to Replace Brake Pads Safely',
        category: 'Brakes',
        difficulty: 'Medium',
        readTime: '15 min read',
        image: 'https://images.unsplash.com/photo-1627883216892-0b1a0ce3b7de?auto=format&fit=crop&q=80&w=600',
        tools: ['Jack', 'Jack Stands', 'Lug Wrench', 'C-Clamp', 'Socket Set'],
        summary: 'A step-by-step guide to inspecting and changing your brake pads without damaging the rotors.',
    },
    {
        id: '2',
        title: 'Changing Your Oil Like a Pro',
        category: 'Engine',
        difficulty: 'Easy',
        readTime: '10 min read',
        image: 'https://images.unsplash.com/photo-1590587754341-1185b3bd2a47?auto=format&fit=crop&q=80&w=600',
        tools: ['Oil Filter Wrench', 'Drain Pan', 'Socket Set', 'Funnel'],
        summary: 'Learn the proper technique for draining your oil, replacing the filter, and choosing the right oil grade.',
    },
    {
        id: '3',
        title: 'Diagnosing Alternator Issues',
        category: 'Electrical',
        difficulty: 'Hard',
        readTime: '20 min read',
        image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=600',
        tools: ['Multimeter', 'Socket Set', 'Serpentine Belt Tool'],
        summary: 'Is it your battery or your alternator? How to test your charging system to find out.',
    },
    {
        id: '4',
        title: 'Headlight Bulb Replacement Guide',
        category: 'Lighting',
        difficulty: 'Easy',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1615829671913-9a3d463d1ed5?auto=format&fit=crop&q=80&w=600',
        tools: ['Gloves', 'Screwdriver'],
        summary: 'Replace dim or burnt out headlight bulbs quickly without touching the glass.',
    }
];

export const DIYHub = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

    const filteredGuides = diyGuides.filter(guide => {
        const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || guide.summary.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' ? true : guide.difficulty === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter mb-4 flex items-center gap-3">
                        <span className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg">
                            <Wrench className="w-6 h-6" />
                        </span>
                        DIY Repair Hub
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl text-lg">
                        Empower yourself with our expert diagnostic guides and step-by-step repair tutorials. Save money on labor and fix it right the first time.
                    </p>
                </div>
                
                <div className="flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl">
                    {['All', 'Easy', 'Medium', 'Hard'].map(level => (
                        <button
                            key={level}
                            onClick={() => setActiveFilter(level as any)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                activeFilter === level ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative mb-12">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input 
                    type="text" 
                    placeholder="Search for repair guides, error codes, symptoms..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-16 pl-12 pr-6 bg-white dark:bg-[#141414] border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl text-lg text-black dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors shadow-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGuides.map((guide, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={guide.id}
                        className="group flex flex-col bg-white dark:bg-[#141414] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
                    >
                        <div className="h-56 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                            <img 
                                src={guide.image} 
                                alt={guide.title}
                                className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-500"
                            />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                                    guide.difficulty === 'Easy' ? 'bg-emerald-500/90 text-black' : 
                                    guide.difficulty === 'Medium' ? 'bg-amber-500/90 text-black' : 
                                    'bg-red-500/90 text-white'
                                }`}>
                                    {guide.difficulty}
                                </span>
                                <span className="px-3 py-1 bg-black/60 text-white backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    {guide.readTime}
                                </span>
                            </div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <PlayCircle className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {guide.category} Focus
                            </div>
                            <h3 className="text-xl font-black text-black dark:text-white mb-3 leading-tight group-hover:text-amber-500 transition-colors">
                                {guide.title}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                                {guide.summary}
                            </p>
                            
                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <PenTool className="w-4 h-4 text-zinc-500" />
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Required Tools</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {guide.tools.slice(0, 3).map(tool => (
                                        <span key={tool} className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-800">
                                            {tool}
                                        </span>
                                    ))}
                                    {guide.tools.length > 3 && (
                                        <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 rounded border border-zinc-200 dark:border-zinc-800">
                                            +{guide.tools.length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredGuides.length === 0 && (
                <div className="text-center py-24 bg-white dark:bg-[#141414] rounded-3xl border border-zinc-200 dark:border-zinc-800">
                    <Box className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-black dark:text-white mb-2">No guides found</h3>
                    <p className="text-zinc-500">We couldn't find any guides matching your search criteria.</p>
                </div>
            )}
        </div>
    );
};
