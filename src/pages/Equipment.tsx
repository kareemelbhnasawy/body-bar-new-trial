import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { Loader2, Bike, SlidersHorizontal } from 'lucide-react';
import { CategoryBanner } from '../components/ui/CategoryBanner';

type TabFilter  = 'All' | 'Machines' | 'Home Gym';
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

const BADGE_CYCLE: { badge: string; badgeVariant: 'hot' | 'new' | 'popular' | 'value' }[] = [
    { badge: 'Hot',     badgeVariant: 'hot'     },
    { badge: 'New',     badgeVariant: 'new'     },
    { badge: 'Popular', badgeVariant: 'popular' },
    { badge: 'Value',   badgeVariant: 'value'   },
];

export default function Equipment() {
    const [tab,  setTab]  = useState<TabFilter>('All');
    const [sort, setSort] = useState<SortOption>('default');

    const { products, loading, error } = useProducts('equipment');

    const enriched = products.map((p, i) => ({ ...p, ...BADGE_CYCLE[i % BADGE_CYCLE.length] }));

    const filtered = enriched.filter(p => {
        if (tab === 'All') return true;
        const n = p.name.toLowerCase();
        const c = p.category.toLowerCase();
        const isMachine = n.includes('machine') || c.includes('machine') || n.includes('press') || n.includes('rack');
        if (tab === 'Machines') return isMachine;
        return !isMachine; // Home Gym
    });

    const sorted = [...filtered].sort((a, b) => {
        if (sort === 'price-asc')  return a.price - b.price;
        if (sort === 'price-desc') return b.price - a.price;
        if (sort === 'rating')     return (b.rating ?? 0) - (a.rating ?? 0);
        return 0;
    });

    if (loading) {
        return (
            <div className="min-h-dvh bg-body-dark flex items-center justify-center">
                <Loader2 className="size-10 text-body-accent animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-dvh bg-body-dark flex items-center justify-center text-red-400">
                Failed to load products.
            </div>
        );
    }

    return (
        <div className="bg-body-dark min-h-dvh">
            <CategoryBanner filterKey="equipment" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter + sort bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    {/* Tabs */}
                    <div className="flex bg-body-card border border-body-border rounded-xl p-1 gap-1">
                        {(['All', 'Machines', 'Home Gym'] as TabFilter[]).map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors duration-150 cursor-pointer ${
                                    tab === t
                                        ? 'bg-body-accent text-black'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2 shrink-0">
                        <SlidersHorizontal size={14} className="text-body-muted" />
                        <select
                            value={sort}
                            onChange={e => setSort(e.target.value as SortOption)}
                            className="bg-body-card border border-body-border text-sm text-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-body-accent cursor-pointer"
                        >
                            <option value="default">Sort: Default</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                {/* Grid — larger cards for equipment (fewer per row) */}
                {sorted.length === 0 ? (
                    <div className="py-20 text-center border border-body-border rounded-xl bg-body-card">
                        <Bike size={40} className="mx-auto text-body-muted mb-4" />
                        <p className="text-gray-400">No products in this category.</p>
                        <button onClick={() => setTab('All')} className="text-body-accent text-sm mt-2 hover:underline cursor-pointer">
                            Show all
                        </button>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {sorted.map((product, i) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
