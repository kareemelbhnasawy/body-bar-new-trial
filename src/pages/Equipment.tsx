import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Loader2 } from 'lucide-react';

export default function Equipment() {
    const [activeTab, setActiveTab] = useState<'Machines' | 'Home Equipment'>('Machines');

    const { products, loading, error } = useProducts('equipment');

    const filteredProducts = products.filter(p => {
        const name = p.name.toLowerCase();
        const cat = p.category.toLowerCase();
        
        if (activeTab === 'Machines') {
             return name.includes('machine') || cat.includes('machine') || name.includes('press') || name.includes('rack');
        } else {
             // Home Equipment
             return !name.includes('machine') && !cat.includes('machine') && !name.includes('press') && !name.includes('rack');
        }
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-body-dark flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-body-accent animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-body-dark flex items-center justify-center text-red-500">
                Error loading products: {error}
            </div>
        );
    }

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
                    {filteredProducts.map(product => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="col-span-full text-center text-body-muted">
                            Loading equipment... (Ensure mock data covers this category)
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
