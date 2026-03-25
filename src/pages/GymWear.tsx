import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ui/ProductCard';
import { mockProducts } from '../data/mockData';

export default function GymWear() {
    const [filter, setFilter] = useState<'All' | 'Men' | 'Women'>('All');

    const products = mockProducts.filter(p =>
        (p.category === 'Men' || p.category === 'Women') && // Using category field from mock data
        (filter === 'All' || p.category === filter)
    );

    return (
        <div className="bg-body-dark min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">Gym Wear</h1>
                        <p className="text-body-accent font-medium">Performance apparel for every move.</p>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex bg-body-card rounded-xl p-1 mt-6 md:mt-0 w-fit border border-white/5 shadow-xl"
                    >
                        {(['All', 'Men', 'Women'] as const).map((gender) => (
                            <button
                                key={gender}
                                onClick={() => setFilter(gender)}
                                className={`px-8 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${filter === gender
                                    ? 'bg-body-accent text-body-dark shadow-md'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {gender}
                            </button>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
                </motion.div>
            </div>
        </div>
    );
}
