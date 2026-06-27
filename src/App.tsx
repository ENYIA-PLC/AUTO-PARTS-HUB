import React, { useState } from 'react';
import { Storefront } from './components/Storefront';
import { TrackerMap } from './components/TrackerMap';
import { AuthModal } from './components/AuthModal';
import { SellerProfile } from './components/SellerProfile';
import { AddPartModal } from './components/AddPartModal';
import { DIYHub } from './components/DIYHub';
import { Mailbox } from './components/Mailbox';
import { MyGarage } from './components/MyGarage';
import { WishlistModal } from './components/WishlistModal';
import { MechanicsGrid } from './components/MechanicsGrid';
import { OrderHistory } from './components/OrderHistory';
import { Route, Map as MapIcon, ShoppingBag, PlusCircleIcon, ChevronRight, User, LogOut, Sun, Moon, Settings, Wrench, Mail, Car, Globe, Heart, Users, ClipboardList, QrCode, Frame } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';
import { useLanguage } from './LanguageContext';
import { QRCodeScannerModal } from './components/QRCodeScannerModal';
import { InteractiveVehicleDiagram } from './components/InteractiveVehicleDiagram';

type TabId = 'marketplace' | 'tracker' | 'seller-profile' | 'diy' | 'mail' | 'garage' | 'wishlist' | 'mechanics' | 'orders' | 'diagram';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('marketplace');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddPartOpen, setIsAddPartOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { user, accessToken, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-800 dark:text-zinc-200 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <nav className="z-50 bg-zinc-50 dark:bg-[#0a0a0a] border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveTab('marketplace')}>
             <div className="relative w-10 h-10 bg-gradient-to-tr from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-200 rounded-xl flex items-center justify-center shadow-lg border border-zinc-700 dark:border-zinc-300 group-hover:border-amber-500 dark:group-hover:border-amber-500 transition-all duration-300 overflow-hidden shrink-0">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-amber-500/20 to-transparent"></div>
                <Wrench className="w-5 h-5 text-amber-500 z-10 -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out" />
             </div>
             <span className="font-black text-xl lg:text-2xl tracking-tighter text-black dark:text-white flex items-center">
                PARTS<span className="text-amber-500 hidden sm:inline">HUB</span>
             </span>
          </div>
          
          <div className="hidden md:flex items-center gap-1 bg-white dark:bg-[#141414] p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto max-w-[50%] lg:max-w-[60%] scrollbar-hide shadow-inner">
            <button 
                onClick={() => setActiveTab('marketplace')}
                className={`px-3 lg:px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'marketplace' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> {t('market')}
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('tracker')}
                className={`px-3 lg:px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'tracker' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4" /> {t('tracker')}
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('seller-profile')}
                className={`px-3 lg:px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'seller-profile' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> {t('sellers')}
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('diy')}
                className={`px-3 lg:px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'diy' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4" /> {t('diyHub')}
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('mail')}
                className={`px-3 lg:px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'mail' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2 relative">
                    <Mail className="w-4 h-4" /> {t('inbox')}
                    {accessToken && <span className="absolute -top-1 -right-2 w-2 h-2 bg-amber-500 rounded-full"></span>}
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('garage')}
                className={`px-3 lg:px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'garage' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" /> {t('garage')}
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('orders')}
                className={`px-3 lg:px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'orders' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" /> {t('orders')}
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('diagram')}
                className={`px-3 lg:px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap hidden xl:block ${
                    activeTab === 'diagram' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Frame className="w-4 h-4" /> Diagram
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('mechanics')}
                className={`px-3 lg:px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap hidden lg:block ${
                    activeTab === 'mechanics' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> {t('mechanics')}
                </div>
            </button>
          </div>

          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 p-2 rounded-full text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-xs font-bold"
                aria-label="Toggle language"
            >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
            </button>
            <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-zinc-500 hover:text-amber-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Scan QR Code"
            >
                <QrCode className="w-5 h-5" />
            </button>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
                onClick={() => setIsAddPartOpen(true)}
                className="hidden sm:flex items-center gap-2 text-sm font-bold text-amber-500 hover:bg-amber-500/10 px-4 py-2 rounded-full transition-colors border border-amber-500/20"
            >
                <PlusCircleIcon className="w-4 h-4" />
                {t('sellAPart')}
            </button>
            {user ? (
                <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full pl-2 pr-4 py-1">
                    <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="Avatar" className="w-7 h-7 rounded-full" />
                    <span className="text-sm font-bold text-black dark:text-white max-w-[100px] truncate">{user.displayName || user.email}</span>
                    <button onClick={logout} className="text-zinc-500 hover:text-red-500 transition-colors ml-2">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsAuthOpen(true)} className="bg-black text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors shadow-lg">
                    {t('signIn')}
                </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pb-24">
        {activeTab === 'marketplace' && <Storefront />}
        {activeTab === 'tracker' && <TrackerMap />}
        {activeTab === 'seller-profile' && <SellerProfile />}
        {activeTab === 'diy' && <DIYHub />}
        {activeTab === 'mail' && <Mailbox />}
        {activeTab === 'garage' && <MyGarage />}
        {activeTab === 'wishlist' && <WishlistModal />}
        {activeTab === 'mechanics' && <MechanicsGrid />}
        {activeTab === 'orders' && <OrderHistory />}
        {activeTab === 'diagram' && <InteractiveVehicleDiagram />}
      </main>
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <AddPartModal isOpen={isAddPartOpen} onClose={() => setIsAddPartOpen(false)} />
      <QRCodeScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

      {/* Footer minimal */}
      <footer className="py-8 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-[#060606] text-zinc-500 text-center text-sm">
        <p>{t('footer' as any) || '© 2025 PartsHub Marketplace. Confidential Roadmap Phase 1 Shipped.'}</p>
      </footer>
      
      {/* Mobile Nav Bar (bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-50 dark:bg-[#0a0a0a]/90 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-900 flex justify-around items-center px-4 z-50">
        <button className={`p-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'marketplace' ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`} onClick={() => setActiveTab('marketplace')}>
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-bold">{t('shop')}</span>
        </button>
        <button className={`p-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'tracker' ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`} onClick={() => setActiveTab('tracker')}>
            <MapIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">{t('track')}</span>
        </button>
        <button className={`p-2 flex flex-col items-center gap-1 transition-colors relative ${activeTab === 'mail' ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`} onClick={() => setActiveTab('mail')}>
            <div className="relative">
                <Mail className="w-5 h-5" />
                {accessToken && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-zinc-50 dark:border-[#1a1a1a]"></span>}
            </div>
            <span className="text-[10px] font-bold">{t('inbox')}</span>
        </button>
        <button className={`p-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'diy' ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`} onClick={() => setActiveTab('diy')}>
            <Wrench className="w-5 h-5" />
            <span className="text-[10px] font-bold">{t('diy')}</span>
        </button>
        <button className={`p-2 flex flex-col items-center gap-1 transition-colors ${activeTab === 'garage' ? 'text-amber-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`} onClick={() => setActiveTab('garage')}>
            <Car className="w-5 h-5" />
            <span className="text-[10px] font-bold">{t('garage')}</span>
        </button>
      </div>
    </div>
  );
}
