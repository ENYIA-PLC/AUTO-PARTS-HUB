import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

export const ToastProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-20 md:bottom-20 right-4 md:right-8 z-[200] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md pointer-events-auto ${
                                toast.type === 'success' 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                                    : toast.type === 'error' 
                                        ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' 
                                        : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                            }`}
                        >
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                            {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
                            <span className="text-sm font-medium mr-4">{toast.message}</span>
                            <button 
                                onClick={() => removeToast(toast.id)} 
                                className="opacity-50 hover:opacity-100 transition-opacity ml-auto"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
