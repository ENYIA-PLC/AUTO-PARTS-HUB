import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { signInWithGoogle, user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [authStep, setAuthStep] = useState<'options' | 'phone' | 'otp'>('options');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setAuthStep('options');
            setPhoneNumber('');
            setOtp('');
            setErrorMsg('');
        }
    }, [isOpen]);

    const handleGoogleSignIn = async () => {
        setIsProcessing(true);
        setErrorMsg('');
        try {
            await signInWithGoogle();
            onClose();
        } catch (error: any) {
            console.error('Failed to sign in', error);
            setErrorMsg(error.message || 'Failed to sign in securely.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsProcessing(true);
        try {
            if (!(window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    size: 'invisible',
                });
            }
            
            const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, (window as any).recaptchaVerifier);
            setConfirmationResult(confirmation);
            setAuthStep('otp');
        } catch (error: any) {
            console.error('Error sending OTP', error);
            setErrorMsg(error.message || 'Failed to send OTP. Ensure phone number includes country code (e.g. +234).');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmationResult) return;
        setErrorMsg('');
        setIsProcessing(true);
        try {
            await confirmationResult.confirm(otp);
            onClose();
        } catch (error: any) {
            console.error('Error verifying OTP', error);
            setErrorMsg(error.message || 'Invalid verification code.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 dark:bg-black/80 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-black dark:text-white transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-black text-black dark:text-white mb-2">
                                    Welcome To PartsHub
                                </h2>
                                <p className="text-zinc-500 text-sm">
                                    Sign in or create an account to start buying and selling.
                                </p>
                            </div>

                            {errorMsg && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
                                    {errorMsg}
                                </div>
                            )}

                            {authStep === 'options' && (
                                <div className="space-y-4">
                                    <button 
                                        onClick={handleGoogleSignIn}
                                        disabled={isProcessing}
                                        className="w-full h-12 bg-black text-white dark:bg-white hover:bg-zinc-200 dark:text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Continue with Google
                                    </button>
                                    
                                    <button 
                                        onClick={() => setAuthStep('phone')}
                                        disabled={isProcessing}
                                        className="w-full h-12 bg-[#25D366] hover:bg-[#1da851] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        Continue with WhatsApp / Phone
                                    </button>
                                    
                                    <div className="text-center text-zinc-600 dark:text-zinc-500 text-sm py-2">- OR -</div>

                                    <button 
                                        className="w-full h-12 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-black dark:text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors opacity-50 cursor-not-allowed"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Continue with Email
                                    </button>
                                </div>
                            )}

                            {authStep === 'phone' && (
                                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                        <input 
                                            type="tel" 
                                            placeholder="+2348012345678" 
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full h-12 pl-10 pr-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
                                    >
                                        {isProcessing ? 'Sending Code...' : 'Send Verification Code'}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setAuthStep('options')}
                                        className="w-full text-zinc-500 text-sm hover:text-black dark:hover:text-white transition-colors mt-4"
                                    >
                                        Back to options
                                    </button>
                                </form>
                            )}

                            {authStep === 'otp' && (
                                <form onSubmit={handleOtpSubmit} className="space-y-4">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                                        <input 
                                            type="text" 
                                            placeholder="Enter 6-digit code"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full h-12 pl-10 pr-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 tracking-widest font-mono text-center"
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
                                    >
                                        {isProcessing ? 'Verifying...' : 'Verify Code'}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </form>
                            )}

                            {/* Required for Firebase Phone Auth recaptcha */}
                            <div id="recaptcha-container"></div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
