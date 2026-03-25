import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ui/ProductCard';
import { mockProducts } from '../data/mockData';

export default function Equipment() {
    const [activeTab, setActiveTab] = useState<'Machines' | 'Home Equipment'>('Machines');

    const products = mockProducts.filter(p =>
        p.category === activeTab || (p.category !== 'Men' && p.category !== 'Women' && !p.id.startsWith('s')) // Simplified mock filter
    );

    return (
        <div className="bg-body-dark min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-5xl font-black text-white mb-6 tracking-tight">Equipment</h1>

                    <div className="inline-flex bg-body-card rounded-xl p-1 border border-white/5 shadow-xl">
                        {(['Machines', 'Home Equipment'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === tab
                                    ? 'bg-body-accent text-body-dark shadow-md'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {products.map(product => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-full text-center text-body-muted">
                            Loading equipment... (Ensure mock data covers this category)
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
