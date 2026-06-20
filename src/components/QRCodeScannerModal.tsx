import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useLanguage } from '../LanguageContext';
import { QrCode, X } from 'lucide-react';
import { motion } from 'framer-motion';

export const QRCodeScannerModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { t } = useLanguage();
    const [scanResult, setScanResult] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render((decodedText) => {
            setScanResult(decodedText);
            // Optionally, handle the result, like searching for the product
        }, (error) => {
            // Error callback
        });

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#141414] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <h2 className="text-xl font-black text-black dark:text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center">
                            <QrCode className="w-5 h-5" />
                        </span>
                        {t('qrScanner') || 'QR Scanner'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-black dark:hover:text-white flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6">
                    {scanResult ? (
                        <div className="text-center py-8">
                            <div className="inline-flex w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full items-center justify-center mb-4">
                                <QrCode className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white mb-2">Scan Successful!</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 mb-6 bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl break-all">
                                {scanResult}
                            </p>
                            <button
                                onClick={() => setScanResult(null)}
                                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors w-full"
                            >
                                Scan Another Code
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div id="reader" className="w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"></div>
                            <p className="text-sm text-zinc-500 text-center mt-4">
                                Point your camera at a QR code to scan.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
