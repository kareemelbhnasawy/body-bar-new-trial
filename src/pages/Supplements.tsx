import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ui/ProductCard';
import { mockProducts } from '../data/mockData';
import { Button } from '../components/ui/Button';

const categories = ['All', 'Amino & Recovery', 'Creatine', 'Protein', 'Energy', 'Vitamins'];

export default function Supplements() {
    const [activeCategory, setActiveCategory] = useState('All');

    // Filter products based on category (using mock logic)
    // In a real app, this would query Supabase
    const products = mockProducts.filter(p =>
        // Just a basic filter for demonstration since mock data categories might not match exactly
        // "s" prefix in ID generally implies supplement in our mock data
        p.id.startsWith('s') &&
        (activeCategory === 'All' || p.category.includes(activeCategory) || activeCategory === 'Protein' && p.category === 'Mass Gainer')
    );

    return (
        <div className="bg-body-dark min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Supplements</h1>
                    <p className="text-body-muted max-w-2xl mx-auto">
                        Premium supplements to support your training and recovery.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? 'primary' : 'ghost'}
                            onClick={() => setActiveCategory(cat)}
                            className="rounded-full"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {products.length > 0 ? (
                        products.map(product => (
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
