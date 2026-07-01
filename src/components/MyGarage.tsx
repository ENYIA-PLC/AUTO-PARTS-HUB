import React, { useState, useEffect } from 'react';
import { Car, Plus, Trash2, CheckCircle2, Search, Cog, Navigation, Image, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VehicleTrackerModal } from './VehicleTrackerModal';
import { VehicleMediaModal } from './VehicleMediaModal';
import { MaintenanceModal } from './MaintenanceModal';
import { RecallsModal } from './RecallsModal';
import { CMRISModal } from './CMRISModal';
import { useAuth } from '../AuthContext';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { useLanguage } from '../LanguageContext';

interface Vehicle {
    id: string;
    year: string;
    make: string;
    model: string;
    trim?: string;
    engine?: string;
    isPrimary?: boolean;
    images?: string[];
    videos?: string[];
}

export const MyGarage = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [lookupMode, setLookupMode] = useState<'manual' | 'vin'>('manual');
    const [vinLookupValue, setVinLookupValue] = useState('');
    const [isLookingUpVin, setIsLookingUpVin] = useState(false);
    const [vinError, setVinError] = useState('');
    
    const [newVehicle, setNewVehicle] = useState({
        year: '',
        make: '',
        model: '',
        trim: '',
        engine: ''
    });

    const [selectedVehicleToTrack, setSelectedVehicleToTrack] = useState<Vehicle | null>(null);
    const [selectedVehicleForMedia, setSelectedVehicleForMedia] = useState<Vehicle | null>(null);
    const [selectedVehicleForMaintenance, setSelectedVehicleForMaintenance] = useState<Vehicle | null>(null);
    const [selectedVehicleForRecalls, setSelectedVehicleForRecalls] = useState<Vehicle | null>(null);
    const [selectedVehicleForCMRIS, setSelectedVehicleForCMRIS] = useState<Vehicle | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        if (!user) {
            setVehicles([]);
            return;
        }

        const path = `users/${user.uid}/vehicles`;
        const q = query(collection(db, path));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedVehicles = snapshot.docs.map(d => ({
                id: d.id,
                ...d.data()
            } as Vehicle));
            loadedVehicles.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
            setVehicles(loadedVehicles);
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, path);
        });

        return () => unsubscribe();
    }, [user]);

    const handleVinLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!vinLookupValue || vinLookupValue.length < 10) {
            setVinError("Please enter a valid VIN (min 10 chars).");
            return;
        }
        setIsLookingUpVin(true);
        setVinError('');

        try {
            // Mock API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock decoded data (in a real app, you would call an external API like NHTSA)
            setNewVehicle({
                year: '2023',
                make: 'Toyota',
                model: 'Camry',
                trim: 'XSE',
                engine: '2.5L 4-Cylinder'
            });
            setLookupMode('manual'); // switch back to show populated form
        } catch (error) {
            setVinError("Failed to decode VIN. Please try manual entry.");
        } finally {
            setIsLookingUpVin(false);
        }
    };

    const handleAddVehicle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newVehicle.year || !newVehicle.make || !newVehicle.model || !user) return;
        
        try {
            const isFirst = vehicles.length === 0;
            const payload = {
                userId: user.uid,
                year: newVehicle.year,
                make: newVehicle.make,
                model: newVehicle.model,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
            if (newVehicle.trim) (payload as any).trim = newVehicle.trim;
            if (newVehicle.engine) (payload as any).engine = newVehicle.engine;
            if (isFirst) (payload as any).isPrimary = true;
            
            await addDoc(collection(db, `users/${user.uid}/vehicles`), payload);
            
            setIsAdding(false);
            setNewVehicle({ year: '', make: '', model: '', trim: '', engine: '' });
        } catch(error) {
            handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/vehicles`);
        }
    };

    const removeVehicle = async (id: string) => {
        if (!user) return;
        try {
            await deleteDoc(doc(db, `users/${user.uid}/vehicles`, id));
        } catch(error) {
            handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/vehicles/${id}`);
        }
    };

    const setPrimary = async (id: string) => {
        if (!user) return;
        try {
            const batch = writeBatch(db);
            vehicles.forEach(v => {
                const vehicleRef = doc(db, `users/${user.uid}/vehicles`, v.id);
                batch.update(vehicleRef, {
                    isPrimary: v.id === id,
                    updatedAt: Date.now()
                });
            });
            await batch.commit();
        } catch(error) {
            handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/vehicles`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tighter mb-4 flex items-center gap-3">
                        <span className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg">
                            <Car className="w-6 h-6" />
                        </span>
                        {t('myGarage')}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl text-lg mb-6">
                        {t('manageVehicles')}
                    </p>
                    <button 
                        onClick={() => setSelectedVehicleForCMRIS({ year: '', make: 'General Registration', model: '', id: 'general', isPrimary: false })}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-500 rounded-lg text-sm font-bold transition-colors border border-green-500/20"
                    >
                        <Shield className="w-4 h-4" />
                        Police CMRIS Portal
                    </button>
                </div>
                
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center gap-2 justify-center transition-transform hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    {isAdding ? t('cancel') : t('addVehicle')}
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-zinc-50 dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8">
                            <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                                <Cog className="w-5 h-5 text-amber-500" /> {t('addVehicle')}
                            </h3>

                            <div className="flex gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setLookupMode('manual')}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${lookupMode === 'manual' ? 'bg-amber-500 text-black' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
                                >
                                    Manual Entry
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLookupMode('vin')}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${lookupMode === 'vin' ? 'bg-amber-500 text-black' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
                                >
                                    VIN Lookup
                                </button>
                            </div>

                            {lookupMode === 'manual' ? (
                                <form onSubmit={handleAddVehicle}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Year *</label>
                                            <input 
                                                type="number"
                                                min="1990"
                                                max={new Date().getFullYear() + 1}
                                                value={newVehicle.year}
                                                onChange={e => setNewVehicle({...newVehicle, year: e.target.value})}
                                                className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors text-black dark:text-white"
                                                placeholder="e.g. 2019"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Make *</label>
                                            <input 
                                                type="text"
                                                value={newVehicle.make}
                                                onChange={e => setNewVehicle({...newVehicle, make: e.target.value})}
                                                className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors text-black dark:text-white"
                                                placeholder="e.g. Honda"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Model *</label>
                                            <input 
                                                type="text"
                                                value={newVehicle.model}
                                                onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                                                className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors text-black dark:text-white"
                                                placeholder="e.g. Civic"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Trim (Optional)</label>
                                            <input 
                                                type="text"
                                                value={newVehicle.trim}
                                                onChange={e => setNewVehicle({...newVehicle, trim: e.target.value})}
                                                className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors text-black dark:text-white"
                                                placeholder="e.g. EX"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Engine (Optional)</label>
                                            <input 
                                                type="text"
                                                value={newVehicle.engine}
                                                onChange={e => setNewVehicle({...newVehicle, engine: e.target.value})}
                                                className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-colors text-black dark:text-white"
                                                placeholder="e.g. 1.5L Turbo"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="submit" className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/20">
                                            Save Vehicle
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleVinLookup}>
                                    <div className="mb-6 max-w-lg">
                                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Vehicle Identification Number (VIN)</label>
                                        <div className="relative">
                                            <input 
                                                type="text"
                                                value={vinLookupValue}
                                                onChange={e => setVinLookupValue(e.target.value.toUpperCase())}
                                                className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-amber-500 transition-colors text-black dark:text-white uppercase"
                                                placeholder="Enter 17-digit VIN"
                                                required
                                            />
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                        </div>
                                        {vinError && <p className="text-red-500 text-sm mt-2 font-medium">{vinError}</p>}
                                        <p className="text-sm text-zinc-500 mt-2">
                                            Your 17-character VIN can typically be found on your dashboard or driver's side door jamb.
                                        </p>
                                    </div>
                                    <div className="flex justify-start">
                                        <button 
                                            type="submit" 
                                            disabled={isLookingUpVin || !vinLookupValue}
                                            className="px-8 py-3 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black disabled:opacity-50 font-bold rounded-xl transition-colors flex items-center gap-2"
                                        >
                                            {isLookingUpVin ? (
                                                <>
                                                    <span className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></span>
                                                    Decoding...
                                                </>
                                            ) : (
                                                'Decode VIN'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {vehicles.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center bg-white dark:bg-[#141414] rounded-3xl border border-zinc-200 dark:border-zinc-800">
                    <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                        <Car className="w-10 h-10 text-zinc-400" />
                    </div>
                    <h2 className="text-xl font-bold text-black dark:text-white mb-2">{t('noVehicles')}</h2>
                    <p className="text-zinc-500 max-w-md mb-8">{t('manageVehicles')}</p>
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors"
                    >
                        {t('addVehicle')}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={vehicle.id}
                            className={`relative p-6 rounded-3xl border ${
                                vehicle.isPrimary 
                                ? 'bg-zinc-900 dark:bg-zinc-900 border-zinc-800 dark:border-zinc-700 shadow-xl' 
                                : 'bg-white dark:bg-[#141414] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                            } transition-colors group`}
                        >
                            {vehicle.isPrimary && (
                                <div className="absolute -top-3 -right-3 px-4 py-1 bg-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {t('primary')}
                                </div>
                            )}
                            
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${vehicle.isPrimary ? 'bg-zinc-800 text-white' : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white'}`}>
                                    <Car className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2">
                                    {!vehicle.isPrimary && (
                                        <button 
                                            onClick={() => setPrimary(vehicle.id)}
                                            className="text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                                        >
                                            Set Primary
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => removeVehicle(vehicle.id)}
                                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1 mb-4">
                                <p className={`text-sm font-bold ${vehicle.isPrimary ? 'text-zinc-400' : 'text-zinc-500'}`}>{vehicle.year}</p>
                                <h3 className={`text-2xl font-black ${vehicle.isPrimary ? 'text-white' : 'text-black dark:text-white'}`}>
                                    {vehicle.make} {vehicle.model}
                                </h3>
                                {(vehicle.trim || vehicle.engine) && (
                                    <p className={`text-sm ${vehicle.isPrimary ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        {vehicle.trim} {vehicle.trim && vehicle.engine ? '•' : ''} {vehicle.engine}
                                    </p>
                                )}
                            </div>

                            {((vehicle.images && vehicle.images.length > 0) || (vehicle.videos && vehicle.videos.length > 0)) && (
                                <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
                                    {(vehicle.images || []).map((img, i) => (
                                        <div key={`img-${i}`} className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 cursor-pointer" onClick={() => setSelectedVehicleForMedia(vehicle)}>
                                            <img src={img} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    {(vehicle.videos || []).map((vid, i) => (
                                        <div key={`vid-${i}`} className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black/10 cursor-pointer relative" onClick={() => setSelectedVehicleForMedia(vehicle)}>
                                            <video src={vid} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                <div className="w-5 h-5 bg-black/50 rounded-full flex items-center justify-center">
                                                    <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white ml-0.5" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mb-6">
                                <button 
                                    onClick={() => setSelectedVehicleForMedia(vehicle)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
                                >
                                    <Image className="w-3.5 h-3.5" />
                                    Manage Media
                                </button>
                            </div>

                            <div className={`pt-4 border-t flex flex-col gap-3 ${vehicle.isPrimary ? 'border-zinc-800' : 'border-zinc-100 dark:border-zinc-800'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className={`w-4 h-4 ${vehicle.isPrimary ? 'text-emerald-500' : 'text-emerald-500'}`} />
                                        <span className={`text-xs font-bold ${vehicle.isPrimary ? 'text-zinc-300' : 'text-zinc-600 dark:text-zinc-400'}`}>Exact Fitment Active</span>
                                    </div>
                                    <button className={`flex items-center gap-1 text-xs font-bold hover:underline ${vehicle.isPrimary ? 'text-amber-500' : 'text-black dark:text-white'}`}>
                                        Shop Parts <Search className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className={`flex flex-col gap-2 pt-3 border-t ${vehicle.isPrimary ? 'border-zinc-800' : 'border-zinc-100 dark:border-zinc-800'}`}>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button 
                                            onClick={() => setSelectedVehicleForMaintenance(vehicle)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-black dark:text-white transition-colors"
                                        >
                                            <Cog className="w-3.5 h-3.5 text-blue-500" />
                                            <span className="truncate">Maintenance</span>
                                        </button>
                                        <button 
                                            onClick={() => setSelectedVehicleForRecalls(vehicle)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-black dark:text-white transition-colors relative"
                                        >
                                            <Search className="w-3.5 h-3.5 text-red-500" />
                                            <span className="truncate">Recalls</span>
                                            {vehicle.year === '2023' && <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                                        </button>
                                        <button 
                                            onClick={() => setSelectedVehicleForCMRIS(vehicle)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-black dark:text-white transition-colors relative"
                                        >
                                            <Shield className="w-3.5 h-3.5 text-green-500" />
                                            <span className="truncate">CMRIS</span>
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedVehicleToTrack(vehicle)}
                                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-black dark:text-white transition-colors"
                                    >
                                        <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                                        Live GPS Track
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <VehicleTrackerModal 
                isOpen={!!selectedVehicleToTrack} 
                onClose={() => setSelectedVehicleToTrack(null)} 
                vehicleName={selectedVehicleToTrack ? `${selectedVehicleToTrack.year} ${selectedVehicleToTrack.make} ${selectedVehicleToTrack.model}` : ''}
            />

            <MaintenanceModal 
                isOpen={!!selectedVehicleForMaintenance} 
                onClose={() => setSelectedVehicleForMaintenance(null)} 
                vehicleName={selectedVehicleForMaintenance ? `${selectedVehicleForMaintenance.year} ${selectedVehicleForMaintenance.make} ${selectedVehicleForMaintenance.model}` : ''}
            />

            <RecallsModal 
                isOpen={!!selectedVehicleForRecalls} 
                onClose={() => setSelectedVehicleForRecalls(null)} 
                vehicleName={selectedVehicleForRecalls ? `${selectedVehicleForRecalls.year} ${selectedVehicleForRecalls.make} ${selectedVehicleForRecalls.model}` : ''}
                hasRecalls={selectedVehicleForRecalls?.year === '2023'}
            />

            <CMRISModal 
                isOpen={!!selectedVehicleForCMRIS} 
                onClose={() => setSelectedVehicleForCMRIS(null)} 
                vehicleName={selectedVehicleForCMRIS ? (selectedVehicleForCMRIS.id === 'general' ? 'General Registry Portal' : `${selectedVehicleForCMRIS.year} ${selectedVehicleForCMRIS.make} ${selectedVehicleForCMRIS.model}`.trim()) : ''}
            />

            <VehicleMediaModal
                isOpen={!!selectedVehicleForMedia}
                onClose={() => setSelectedVehicleForMedia(null)}
                vehicle={selectedVehicleForMedia}
            />
        </div>
    );
};
