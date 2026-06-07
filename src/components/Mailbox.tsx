import React, { useEffect, useState } from 'react';
import { Mail, Search, Inbox, Send, RefreshCw, Archive, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'motion/react';

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload?: {
    headers: { name: string; value: string }[];
    body: { data?: string };
    parts?: any[];
  };
}

export const Mailbox = () => {
    const { user, accessToken, signInWithGoogle } = useAuth();
    const [messages, setMessages] = useState<GmailMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);

    const fetchMessages = async () => {
        if (!accessToken) return;
        setLoading(true);
        setError(null);
        try {
            const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=20&q=in:inbox', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!listRes.ok) throw new Error('Failed to fetch messages');
            const data = await listRes.json();
            
            if (data.messages && data.messages.length > 0) {
                const detailedMessages = await Promise.all(
                    data.messages.map(async (msg: {id: string}) => {
                        const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        });
                        return detailRes.json();
                    })
                );
                setMessages(detailedMessages);
            } else {
                setMessages([]);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchMessages();
        }
    }, [accessToken]);

    const getHeader = (message: GmailMessage, name: string) => {
        return message.payload?.headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
    };

    if (!user || !accessToken) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
                    <Mail className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-3xl font-black text-black dark:text-white mb-4">Connect Gmail</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-center max-w-md mb-8">
                    To access your buyer messages and order updates directly from PartsHub, please sign in and grant Gmail access.
                </p>
                <button 
                     onClick={signInWithGoogle}
                     className="px-6 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-amber-500 rounded-xl font-bold text-zinc-900 dark:text-white flex items-center gap-3 transition-colors shadow-sm"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-140px)]">
                {/* Sidebar */}
                <div className={`w-full md:w-80 bg-white dark:bg-[#141414] rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                        <h2 className="text-xl font-black text-black dark:text-white flex items-center justify-between mb-4">
                            Inbox
                            <button onClick={fetchMessages} disabled={loading} className="text-zinc-500 hover:text-amber-500 transition-colors p-2 rounded-lg hover:bg-amber-500/10">
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input 
                                type="text"
                                placeholder="Search messages..."
                                className="w-full pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl text-sm focus:ring-1 focus:ring-amber-500 text-black dark:text-white placeholder:text-zinc-500"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">
                        {loading && messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                            </div>
                        ) : error ? (
                            <div className="p-4 text-center text-sm text-red-500">
                                {error}
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-4 text-center">
                                <Inbox className="w-12 h-12 mb-3 text-zinc-300 dark:text-zinc-700" />
                                <p className="text-sm">Your inbox is empty</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                {messages.map(msg => (
                                    <button 
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors ${selectedMessage?.id === msg.id ? 'bg-amber-50 dark:bg-amber-500/5' : ''}`}
                                    >
                                        <div className="text-sm font-bold text-black dark:text-white truncate mb-1">
                                            {getHeader(msg, 'From').split('<')[0].replace(/"/g, '')}
                                        </div>
                                        <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate mb-1">
                                            {getHeader(msg, 'Subject') || '(No Subject)'}
                                        </div>
                                        <div className="text-xs text-zinc-500 truncate">
                                            {msg.snippet}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Email Viewer */}
                <div className={`flex-1 bg-white dark:bg-[#141414] rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden ${!selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                    {selectedMessage ? (
                        <>
                            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#141414]/80 backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setSelectedMessage(null)}
                                        className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-black dark:hover:text-white"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <h3 className="text-lg font-black text-black dark:text-white truncate max-w-[200px] md:max-w-md">
                                        {getHeader(selectedMessage, 'Subject')}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors hover:text-black dark:hover:text-white">
                                        <Archive className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center uppercase">
                                        {getHeader(selectedMessage, 'From').charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-black dark:text-white">
                                            {getHeader(selectedMessage, 'From')}
                                        </div>
                                        <div className="text-xs text-zinc-500">
                                            to {getHeader(selectedMessage, 'To')}
                                        </div>
                                    </div>
                                    <div className="ml-auto text-xs text-zinc-400">
                                        {new Date(getHeader(selectedMessage, 'Date')).toLocaleString()}
                                    </div>
                                </div>
                                
                                <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
                                    {/* Super basic snippet rendering for now, full HTML parsing requires more robust logic */}
                                    <p className="whitespace-pre-wrap">{selectedMessage.snippet}</p>
                                    <div className="my-8 px-4 py-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        This is a preview snippet from Gmail.
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0a0a0a]">
                                <div className="flex gap-3">
                                    <input 
                                        type="text" 
                                        placeholder="Quick reply..."
                                        className="flex-1 bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
                                    />
                                    <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-colors flex items-center gap-2">
                                        <Send className="w-4 h-4" />
                                        Send
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                            <Mail className="w-16 h-16 mb-4 text-zinc-200 dark:text-zinc-800" />
                            <p className="font-medium text-black dark:text-white">Select a message to read</p>
                            <p className="text-sm">Nothing selected</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
