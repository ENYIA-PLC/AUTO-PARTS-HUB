import React, { useState } from 'react';
import { Storefront } from './components/Storefront';
import { TrackerMap } from './components/TrackerMap';
import { AuthModal } from './components/AuthModal';
import { SellerProfile } from './components/SellerProfile';
import { AddPartModal } from './components/AddPartModal';
import { DIYHub } from './components/DIYHub';
import { Mailbox } from './components/Mailbox';
import { Route, Map as MapIcon, ShoppingBag, PlusCircleIcon, ChevronRight, User, LogOut, Sun, Moon, Settings, Wrench, Mail } from 'lucide-react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useToast } from './ToastContext';

type TabId = 'marketplace' | 'tracker' | 'seller-profile' | 'diy' | 'mail';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('marketplace');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddPartOpen, setIsAddPartOpen] = useState(false);
  const { user, accessToken, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-800 dark:text-zinc-200 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-zinc-50 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveTab('marketplace')}>
             <div className="relative w-10 h-10 bg-gradient-to-tr from-zinc-900 to-zinc-800 dark:from-white dark:to-zinc-200 rounded-xl flex items-center justify-center shadow-lg border border-zinc-700 dark:border-zinc-300 group-hover:border-amber-500 dark:group-hover:border-amber-500 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-amber-500/20 to-transparent"></div>
                <Wrench className="w-5 h-5 text-amber-500 z-10 -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out" />
             </div>
             <span className="font-black text-2xl tracking-tighter text-black dark:text-white flex items-center">
                PARTS<span className="text-amber-500">HUB</span>
             </span>
          </div>
          
          <div className="hidden md:flex items-center gap-1 bg-white dark:bg-[#141414] p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <button 
                onClick={() => setActiveTab('marketplace')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    activeTab === 'marketplace' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Market
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('tracker')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    activeTab === 'tracker' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4" /> Tracker
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('seller-profile')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    activeTab === 'seller-profile' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Sellers
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('diy')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    activeTab === 'diy' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4" /> DIY Hub
                </div>
            </button>
            <button 
                onClick={() => setActiveTab('mail')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    activeTab === 'mail' ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200/50 dark:bg-zinc-800/50'
                }`}
            >
                <div className="flex items-center gap-2 relative">
                    <Mail className="w-4 h-4" /> Inbox
                    {accessToken && <span className="absolute -top-1 -right-2 w-2 h-2 bg-amber-500 rounded-full"></span>}
                </div>
            </button>
          </div>

          <div className="flex items-center gap-4">
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
                Sell a Part
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
                    Sign In
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
      </main>
      
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <AddPartModal isOpen={isAddPartOpen} onClose={() => setIsAddPartOpen(false)} />

      {/* Footer minimal */}
      <footer className="py-8 border-t border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-[#060606] text-zinc-500 text-center text-sm">
        <p>© 2025 PartsHub Marketplace. Confidential Roadmap Phase 1 Shipped.</p>
      </footer>
      
      {/* Mobile Nav Bar (bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-50 dark:bg-[#0a0a0a]/90 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-900 flex justify-around items-center px-4 z-50">
        <button className={`p-2 flex flex-col items-center gap-1 ${activeTab === 'marketplace' ? 'text-amber-500' : 'text-zinc-500'}`} onClick={() => setActiveTab('marketplace')}>
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-bold">Shop</span>
        </button>
        <button className={`p-2 flex flex-col items-center gap-1 ${activeTab === 'tracker' ? 'text-amber-500' : 'text-zinc-500'}`} onClick={() => setActiveTab('tracker')}>
            <MapIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold">Track</span>
        </button>
        <button className={`p-2 flex flex-col items-center gap-1 ${activeTab === 'mail' ? 'text-amber-500' : 'text-zinc-500'}`} onClick={() => setActiveTab('mail')}>
            <Mail className="w-5 h-5" />
            <span className="text-[10px] font-bold">Inbox</span>
        </button>
        <button className={`p-2 flex flex-col items-center gap-1 ${activeTab === 'diy' ? 'text-amber-500' : 'text-zinc-500'}`} onClick={() => setActiveTab('diy')}>
            <Wrench className="w-5 h-5" />
            <span className="text-[10px] font-bold">DIY</span>
        </button>
      </div>
    </div>
  );
}
