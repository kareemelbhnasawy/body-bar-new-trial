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
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-6">Equipment</h1>

                    <div className="inline-flex bg-body-card rounded-full p-1 border border-body-secondary">
                        {(['Machines', 'Home Equipment'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === tab
                                    ? 'bg-white text-body-dark'
                                    : 'text-body-muted hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

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
