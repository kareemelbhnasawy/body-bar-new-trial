import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function NewsletterModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show after 3 seconds on first visit
        const hasSeenNewsletter = localStorage.getItem('hasSeenNewsletter');
        if (!hasSeenNewsletter) {
            const timer = setTimeout(() => setIsOpen(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const close = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenNewsletter', 'true');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#e5e5e5] w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden flex flex-col items-center text-center p-12"
                    >
                        <button
                            onClick={close}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                            GET 10% OFF
                        </h2>
                        
                        <p className="text-gray-700 text-base font-medium mb-8 leading-relaxed max-w-[280px]">
                            Promotions, new products and sales. Directly to your inbox.
                        </p>

                        <div className="w-full relative group mb-4">
                            <input
                                type="email"
                                placeholder="Your e-mail"
                                className="w-full bg-transparent border border-gray-300 rounded-lg py-3 px-4 text-gray-900 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium placeholder-gray-500"
                            />
                        </div>

                        <button 
                            onClick={close}
                            className="w-full bg-[#3ae0e5] text-black font-bold uppercase tracking-wider py-4 rounded-lg hover:bg-[#20c5ca] transition-colors shadow-sm"
                        >
                            SUBSCRIBE
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
