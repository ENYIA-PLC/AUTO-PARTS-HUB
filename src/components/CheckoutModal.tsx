import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Mail, CreditCard, Lock, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useAuth } from '../AuthContext';
import { usePaystackPayment } from 'react-paystack';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSuccess: (paymentLink: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, product, onSuccess }) => {
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'opay' | 'card' | 'link'>('paystack');

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user]);

    const totalAmount = product ? product.price + 2500 : 0;

    const config = {
        reference: (new Date()).getTime().toString(),
        email: email || 'guest@example.com',
        amount: totalAmount * 100, // Paystack amount is in kobo
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        currency: 'NGN',
    };

    const initializePayment = usePaystackPayment(config);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        if (paymentMethod === 'paystack') {
            initializePayment({
                onSuccess: (reference: any) => {
                    setIsProcessing(false);
                    // Call the original onSuccess prop but maybe pass the ref instead of a mocked link
                    onSuccess(`https://paystack.com/pay/receipt/${reference.reference}`);
                },
                onClose: () => {
                    setIsProcessing(false);
                }
            });
        } else if (paymentMethod === 'opay') {
            // Simulate OPay gateway delay
            setTimeout(() => {
                setIsProcessing(false);
                const mockOpayRef = Math.random().toString(36).substring(7);
                onSuccess(`https://opayweb.com/pay/mock-${mockOpayRef}`);
            }, 1500);
        } else {
            // Simulate standard card/link processing
            setTimeout(() => {
                setIsProcessing(false);
                const methodStr = paymentMethod === 'link' ? 'link' : 'card';
                const mockRef = Math.random().toString(36).substring(7);
                onSuccess(`https://example.com/pay/${methodStr}-${mockRef}`);
            }, 1500);
        }
    };

    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 dark:bg-black/80 backdrop-blur-sm">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white dark:bg-[#141414] border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#141414] z-10">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <span className="font-bold text-black dark:text-white">Secure Checkout</span>
                            </div>
                            <button onClick={onClose} className="text-zinc-500 hover:text-black dark:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="flex gap-4 mb-6 p-4 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                                <div>
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm line-clamp-2">{product.name}</h3>
                                    <div className="text-xs text-zinc-500 mt-1">Qty: 1</div>
                                    <div className="font-black text-amber-500 mt-1">₦{product.price.toLocaleString()}</div>
                                </div>
                            </div>

                            <form onSubmit={handlePayment} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com" 
                                            className="w-full h-10 pl-9 pr-4 bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">Delivery Address</label>
                                    <textarea 
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full h-24 p-3 bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-xl text-black dark:text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none text-sm"
                                        placeholder="Enter your full delivery address in Nigeria..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-2">Payment Method</label>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'paystack' ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900'}`}>
                                            <input type="radio" name="payment" value="paystack" checked={paymentMethod === 'paystack'} onChange={() => setPaymentMethod('paystack')} className="hidden" />
                                            <CreditCard className={`w-5 h-5 ${paymentMethod === 'paystack' ? 'text-amber-500' : 'text-zinc-500'}`} />
                                            <span className={`text-sm font-bold ${paymentMethod === 'paystack' ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-600 dark:text-zinc-400'}`}>Paystack</span>
                                        </label>
                                        <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'opay' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900'}`}>
                                            <input type="radio" name="payment" value="opay" checked={paymentMethod === 'opay'} onChange={() => setPaymentMethod('opay')} className="hidden" />
                                            <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center text-white font-black text-[10px]">O</div>
                                            <span className={`text-sm font-bold ${paymentMethod === 'opay' ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-600 dark:text-zinc-400'}`}>OPay</span>
                                        </label>
                                        <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900'}`}>
                                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                                            <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-amber-500' : 'text-zinc-500'}`} />
                                            <span className={`text-sm font-bold ${paymentMethod === 'card' ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-600 dark:text-zinc-400'}`}>Card (Manual)</span>
                                        </label>
                                        <label className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'link' ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900'}`}>
                                            <input type="radio" name="payment" value="link" checked={paymentMethod === 'link'} onChange={() => setPaymentMethod('link')} className="hidden" />
                                            <Smartphone className={`w-5 h-5 ${paymentMethod === 'link' ? 'text-amber-500' : 'text-zinc-500'}`} />
                                            <span className={`text-sm font-bold ${paymentMethod === 'link' ? 'text-zinc-800 dark:text-zinc-200' : 'text-zinc-600 dark:text-zinc-400'}`}>Payment Link</span>
                                        </label>
                                    </div>
                                </div>

                                {paymentMethod === 'paystack' ? (
                                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-6 h-6 text-amber-500" />
                                            <div>
                                                <div className="text-sm font-bold text-amber-600 dark:text-amber-400">Paystack Secure Payment</div>
                                                <div className="text-xs text-amber-500/70">You will be redirected securely to Paystack to complete your purchase.</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : paymentMethod === 'opay' ? (
                                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-white font-black text-xs">O</div>
                                            <div>
                                                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">OPay Rapid Checkout</div>
                                                <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Pay instantly from your OPay wallet or linked accounts.</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : paymentMethod === 'card' ? (
                                    <div className="space-y-4 p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-3 flex gap-1 opacity-20">
                                            <div className="w-6 h-4 bg-white/20 rounded"></div>
                                            <div className="w-6 h-4 bg-white/20 rounded"></div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-zinc-500 mb-1">Card Number</label>
                                            <div className="relative">
                                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                <input 
                                                    type="text" 
                                                    placeholder="0000 0000 0000 0000" 
                                                    className="w-full h-10 pl-9 pr-4 bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                                                    required={paymentMethod === 'card'}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-zinc-500 mb-1">Expiry Date</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="MM/YY" 
                                                    className="w-full h-10 px-3 bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                                                    required={paymentMethod === 'card'}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-zinc-500 mb-1">CVV</label>
                                                <div className="relative">
                                                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                                    <input 
                                                        type="text" 
                                                        placeholder="123" 
                                                        className="w-full h-10 px-3 pr-9 bg-zinc-50 dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-lg text-black dark:text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                                                        required={paymentMethod === 'card'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="w-6 h-6 text-amber-500" />
                                            <div>
                                                <div className="text-sm font-bold text-amber-600 dark:text-amber-400">Payment Link</div>
                                                <div className="text-xs text-amber-500/70">A payment link will be securely generated and sent.</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                                    <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                                        <span>Subtotal</span>
                                        <span>₦{product.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                                        <span>Shipping (Lagos)</span>
                                        <span>₦2,500</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black text-black dark:text-white">
                                        <span>Total</span>
                                        <span>₦{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isProcessing || !email || !address}
                                    className={`w-full h-12 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${paymentMethod === 'opay' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600 text-black'}`}
                                >
                                    {isProcessing ? (paymentMethod === 'paystack' ? 'Connecting to Paystack...' : paymentMethod === 'opay' ? 'Connecting to OPay...' : 'Processing...') : paymentMethod === 'link' ? `Generate Payment Link` : `Pay ₦${totalAmount.toLocaleString()} Now`}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

