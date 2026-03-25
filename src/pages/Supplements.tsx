import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/ui/Button';
import { Loader2 } from 'lucide-react';

const categories = ['All', 'Amino & Recovery', 'Creatine', 'Protein', 'Energy', 'Vitamins'];

export default function Supplements() {
    const [activeCategory, setActiveCategory] = useState('All');
    
    // Fetch live products from Supabase
    const { products, loading, error } = useProducts('supplements');

    // Filter products on the client based on category
    const filteredProducts = products.filter(p => {
        if (activeCategory === 'All') return true;
        const name = p.name.toLowerCase();
        const type = p.category.toLowerCase();
        
        switch(activeCategory) {
            case 'Amino & Recovery':
                return name.includes('amino') || name.includes('bcaa') || name.includes('glutamine') || type.includes('amino');
            case 'Creatine':
                return name.includes('creatine');
            case 'Protein':
                return name.includes('protein') || name.includes('mass gainer') || name.includes('whey') || type.includes('protein');
            case 'Energy':
                return name.includes('energy') || name.includes('pre') || name.includes('workout');
            case 'Vitamins':
                return name.includes('centrum') || name.includes('vitamin') || type.includes('vitamin');
            default:
                return true;
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
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Supplements</h1>
                    <p className="text-body-accent font-medium max-w-2xl mx-auto">
                        Premium supplements to support your training and recovery.
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-2 mb-12 bg-body-card/50 p-2 rounded-2xl border border-white/5 w-fit mx-auto"
                >
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? 'primary' : 'ghost'}
                            onClick={() => setActiveCategory(cat)}
                            className={`rounded-xl transition-all duration-300 ${activeCategory === cat ? 'bg-body-accent text-body-dark shadow-md' : 'text-gray-400 hover:text-white'}`}
                        >
                            {cat}
                        </Button>
                    ))}
                </motion.div>

                {/* Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-body-muted py-12">
                            No products found in this category.
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
