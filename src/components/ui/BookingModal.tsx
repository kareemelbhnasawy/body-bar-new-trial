import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { Button } from './Button';
import { useCart } from '../../context/CartContext';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    baseProduct: any; // The generic product from DB to use as a base ID
    initialCoach?: string; // e.g. 'Bassem'
}

const COACHES = [
    "Bassem", "Alyona", "Elena", "Ingy Sweid", "Nikoleta", 
    "Someyah", "Ramzy", "Ibrahim", "Diana", "Khaled"
];

const PACKAGES = [
    { label: '1 Session', sessions: 1, price: 375 },
    { label: '10 Sessions', sessions: 10, price: 3500 },
    { label: '20 Sessions', sessions: 20, price: 5500 }
];

export function BookingModal({ isOpen, onClose, baseProduct, initialCoach = 'Bassem' }: BookingModalProps) {
    const [selectedCoach, setSelectedCoach] = useState(initialCoach);
    const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        // Fallback for base product if none passed
        const productBase = baseProduct || { id: 'generic-coaching', name: 'Coaching Session', category: 'coaching', image: 'https://placehold.co/500x500/171717/ededed?text=Coaching' };
        
        addToCart({
            ...productBase,
            id: `${productBase.id}-${selectedCoach.replace(/\s+/g, '-')}-${selectedPackage.sessions}`,
            name: `One-to-One Training - ${selectedPackage.label} (Trainer: ${selectedCoach})`,
            price: selectedPackage.price,
            quantity
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-body-card border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20">
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div className="p-6 md:p-8">
                        <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tight border-b border-white/10 pb-4 pr-10">
                            Book Your Sessions
                        </h2>

                        <div className="space-y-8">
                            {/* Packages */}
                            <div>
                                <label className="block text-gray-400 font-bold mb-3 uppercase tracking-wider text-sm">Number of Sessions</label>
                                <div className="flex flex-wrap gap-3">
                                    {PACKAGES.map(pkg => (
                                        <button
                                            key={pkg.sessions}
                                            onClick={() => setSelectedPackage(pkg)}
                                            className={`px-6 py-3 rounded-xl border font-bold transition-all duration-300 ${
                                                selectedPackage.sessions === pkg.sessions 
                                                    ? 'bg-body-accent text-body-dark border-body-accent shadow-[0_0_15px_rgba(255,100,42,0.3)]' 
                                                    : 'bg-black/50 text-white border-white/10 hover:border-body-accent/50'
                                            }`}
                                        >
                                            {pkg.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Coaches */}
                            <div>
                                <label className="block text-gray-400 font-bold mb-3 uppercase tracking-wider text-sm">Select Coach</label>
                                <div className="flex flex-wrap gap-2">
                                    {COACHES.map(coach => (
                                        <button
                                            key={coach}
                                            onClick={() => setSelectedCoach(coach)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all duration-300 ${
                                                selectedCoach === coach 
                                                    ? 'bg-white text-black border-white' 
                                                    : 'bg-black/50 text-gray-300 border-white/10 hover:border-white/50'
                                            }`}
                                        >
                                            {coach}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Summary & Quantity */}
                            <div className="flex flex-col md:flex-row items-start md:items-end justify-between pt-6 border-t border-white/10 gap-6">
                                <div>
                                    <p className="text-gray-400 mb-1 text-sm font-bold uppercase tracking-widest">Total Price</p>
                                    <p className="text-4xl font-black text-body-accent">AED {(selectedPackage.price * quantity).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="flex items-center bg-black/50 rounded-lg border border-white/10 overflow-hidden h-[50px]">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 h-full text-white hover:bg-white/10 transition-colors">-</button>
                                        <span className="w-10 text-center font-bold text-white">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="px-4 h-full text-white hover:bg-white/10 transition-colors">+</button>
                                    </div>
                                    <Button size="lg" className="flex-1 bg-body-accent text-body-dark hover:bg-white font-black uppercase tracking-wider h-[50px] px-8" onClick={handleAddToCart}>
                                        <Calendar className="w-5 h-5 mr-2" /> Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
