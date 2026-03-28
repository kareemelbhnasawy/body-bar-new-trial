import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Loader2, SearchX, Star, Dumbbell } from 'lucide-react';
import { ProductCard } from '../components/ui/ProductCard';
import { useSearch } from '../hooks/useSearch';
import { supabase } from '../lib/supabase';

interface CoachResult {
    id: number;
    name: string;
    specialty: string;
    image: string;
    rating: number;
    featured: boolean;
}

const BROWSE_LINKS = [
    { label: 'Meals',        path: '/diet-food'    },
    { label: 'Training',     path: '/coaching'     },
    { label: 'Sportswear',   path: '/gym-wear'     },
    { label: 'Supplements',  path: '/supplements'  },
    { label: 'Equipment',    path: '/equipment'    },
];

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const { results, loading, error } = useSearch(query);

    const [coaches, setCoaches]           = useState<CoachResult[]>([]);
    const [coachLoading, setCoachLoading] = useState(false);

    // Search coaches table in parallel
    useEffect(() => {
        const q = query.trim();
        if (!q || q.length < 2 || !supabase) {
            setCoaches([]);
            return;
        }
        setCoachLoading(true);
        supabase
            .from('coaches')
            .select('id, name, specialty, image, rating, featured')
            .or(`name.ilike.%${q}%,specialty.ilike.%${q}%`)
            .limit(6)
            .then(({ data }) => {
                setCoaches((data as CoachResult[]) ?? []);
                setCoachLoading(false);
            });
    }, [query]);

    const totalResults = results.length + coaches.length;
    const isLoading    = loading || coachLoading;

    return (
        <div className="bg-body-dark min-h-dvh">
            {/* Header */}
            <div className="bg-body-card border-b border-body-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Search size={18} className="text-body-accent" />
                        <span className="text-body-accent text-sm font-bold uppercase tracking-widest">Search</span>
                    </div>
                    <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-white tracking-tight text-balance">
                        {query ? <>Results for &ldquo;{query}&rdquo;</> : 'Search Products'}
                    </h1>
                    {!isLoading && query && (
                        <p className="text-body-muted mt-2 text-sm">
                            {totalResults === 0
                                ? 'No results found.'
                                : `${totalResults} result${totalResults !== 1 ? 's' : ''} found`}
                        </p>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

                {/* Loading */}
                {isLoading && (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="size-10 text-body-accent animate-spin" />
                    </div>
                )}

                {/* Error */}
                {error && !isLoading && (
                    <div className="py-20 text-center">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Empty query */}
                {!query && !isLoading && (
                    <div className="py-20 text-center border border-body-border rounded-xl bg-body-card">
                        <Search size={40} className="mx-auto text-body-muted mb-4" />
                        <p className="text-white font-semibold mb-1">What are you looking for?</p>
                        <p className="text-body-muted text-sm mb-6">Search products, coaches, meal plans, supplements and more.</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {BROWSE_LINKS.map(c => (
                                <Link key={c.path} to={c.path}
                                    className="px-4 py-2 bg-body-secondary border border-body-border rounded-lg text-sm text-gray-300 hover:text-white hover:border-body-accent/40 transition-colors">
                                    {c.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* No results */}
                {query && !isLoading && !error && totalResults === 0 && (
                    <div className="py-20 text-center border border-body-border rounded-xl bg-body-card">
                        <SearchX size={40} className="mx-auto text-body-muted mb-4" />
                        <p className="text-white font-semibold mb-1">No results for &ldquo;{query}&rdquo;</p>
                        <p className="text-body-muted text-sm mb-6">Try a different keyword or browse a category.</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {BROWSE_LINKS.map(c => (
                                <Link key={c.path} to={c.path}
                                    className="px-4 py-2 bg-body-secondary border border-body-border rounded-lg text-sm text-gray-300 hover:text-white hover:border-body-accent/40 transition-colors">
                                    {c.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Coach results */}
                {!isLoading && coaches.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Dumbbell size={16} className="text-body-accent" />
                            <h2 className="font-display text-xl font-black uppercase text-white tracking-tight">Coaches</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {coaches.map((coach, i) => (
                                <motion.div
                                    key={coach.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link to="/coaching" className="block group cursor-pointer">
                                        <div className="bg-body-card border border-body-border rounded-xl overflow-hidden hover:border-body-accent/40 transition-colors">
                                            <div className="aspect-3/4 overflow-hidden bg-body-dark">
                                                <img
                                                    src={coach.image}
                                                    alt={coach.name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="p-3">
                                                <p className="text-white font-bold text-sm">{coach.name}</p>
                                                <p className="text-body-muted text-[11px] mt-0.5 line-clamp-1">{coach.specialty}</p>
                                                <div className="flex items-center gap-px mt-1.5">
                                                    {[1,2,3,4,5].map(n => (
                                                        <Star key={n} size={9}
                                                            className={n <= Math.floor(coach.rating ?? 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Product results */}
                {!isLoading && !error && results.length > 0 && (
                    <section>
                        {coaches.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <Search size={16} className="text-body-accent" />
                                <h2 className="font-display text-xl font-black uppercase text-white tracking-tight">Products</h2>
                            </div>
                        )}
                        <motion.div
                            layout
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                        >
                            {results.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                )}
            </div>
        </div>
    );
}
