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
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Gym Wear</h1>
                        <p className="text-body-muted">Performance apparel for every move.</p>
                    </div>
                    <div className="flex bg-body-card rounded-lg p-1 mt-4 md:mt-0 w-fit">
                        {(['All', 'Men', 'Women'] as const).map((gender) => (
                            <button
                                key={gender}
                                onClick={() => setFilter(gender)}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${filter === gender
                                    ? 'bg-body-accent text-body-dark shadow-lg'
                                    : 'text-body-muted hover:text-white'
                                    }`}
                            >
                                {gender}
                            </button>
                        ))}
                    </div>
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
