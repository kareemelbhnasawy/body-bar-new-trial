import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { Button } from './Button';
import { useCart } from '../../context/CartContext';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    baseProduct: any;
    initialCoach?: string;
}

const COACHES = [
    'Bassem', 'Alyona', 'Elena', 'Ingy Sweid', 'Nikoleta',
    'Someyah', 'Ramzy', 'Ibrahim', 'Diana', 'Khaled',
];

const PACKAGES = [
    { label: '1 Session',   sessions: 1,  price: 375  },
    { label: '10 Sessions', sessions: 10, price: 3500 },
    { label: '20 Sessions', sessions: 20, price: 5500 },
];

export function BookingModal({ isOpen, onClose, baseProduct, initialCoach = 'Bassem' }: BookingModalProps) {
    const [selectedCoach,   setSelectedCoach]   = useState(initialCoach);
    const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);
    const [quantity,        setQuantity]        = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        const productBase = baseProduct || {
            id: 'generic-coaching',
            name: 'Coaching Session',
            category: 'coaching',
            image: 'https://placehold.co/500x500/171717/ededed?text=Coaching',
        };
        addToCart({
            ...productBase,
            id:    `${productBase.id}-${selectedCoach.replace(/\s+/g, '-')}-${selectedPackage.sessions}`,
            name:  `One-to-One Training — ${selectedPackage.label} (${selectedCoach})`,
            price: selectedPackage.price,
            quantity,
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Sheet — slides up on mobile, scales in on desktop */}
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className="relative z-10 w-full sm:max-w-lg bg-body-card border-t sm:border sm:rounded-2xl border-body-border shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[85dvh]"
                    >
                        {/* Drag handle — mobile only */}
                        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
                            <div className="w-10 h-1 rounded-full bg-white/20" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-body-border shrink-0">
                            <h2 className="font-display text-2xl font-black uppercase text-white tracking-tight">
                                Book Sessions
                            </h2>
                            <button
                                onClick={onClose}
                                aria-label="Close"
                                className="size-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">
                            {/* Packages */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-body-muted mb-3">Number of Sessions</p>
                                <div className="flex flex-col gap-2">
                                    {PACKAGES.map(pkg => (
                                        <button
                                            key={pkg.sessions}
                                            onClick={() => setSelectedPackage(pkg)}
                                            className={`flex items-center justify-between px-4 py-3.5 rounded-xl border font-bold text-sm transition-colors duration-150 cursor-pointer ${
                                                selectedPackage.sessions === pkg.sessions
                                                    ? 'bg-body-accent/10 border-body-accent text-white'
                                                    : 'bg-body-secondary border-body-border text-gray-300 hover:border-body-accent/40'
                                            }`}
                                        >
                                            <span>{pkg.label}</span>
                                            <span className={selectedPackage.sessions === pkg.sessions ? 'text-body-accent' : 'text-body-muted'}>
                                                AED {pkg.price.toLocaleString()}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Coaches */}
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-body-muted mb-3">Select Coach</p>
                                <div className="flex flex-wrap gap-2">
                                    {COACHES.map(coach => (
                                        <button
                                            key={coach}
                                            onClick={() => setSelectedCoach(coach)}
                                            className={`px-3.5 py-2 rounded-lg border text-sm font-semibold transition-colors duration-150 cursor-pointer ${
                                                selectedCoach === coach
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-body-secondary border-body-border text-gray-300 hover:border-white/40'
                                            }`}
                                        >
                                            {coach}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sticky footer — price + CTA */}
                        <div className="shrink-0 border-t border-body-border px-5 py-4 bg-body-card pb-safe">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-body-muted font-bold">Total</p>
                                    <p className="text-2xl font-black text-body-accent tabular-nums">
                                        AED {(selectedPackage.price * quantity).toLocaleString()}
                                    </p>
                                </div>
                                {/* Quantity stepper */}
                                <div className="flex items-center bg-body-secondary border border-body-border rounded-xl overflow-hidden h-10">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        aria-label="Decrease quantity"
                                        className="w-10 h-full text-white hover:bg-white/10 transition-colors cursor-pointer text-lg font-bold"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-bold text-white text-sm tabular-nums">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        aria-label="Increase quantity"
                                        className="w-10 h-full text-white hover:bg-white/10 transition-colors cursor-pointer text-lg font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="w-full flex items-center justify-center gap-2 bg-body-accent hover:bg-orange-500 text-black font-black py-3.5 rounded-xl transition-colors cursor-pointer"
                            >
                                <Calendar size={18} />
                                Add to Cart
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
