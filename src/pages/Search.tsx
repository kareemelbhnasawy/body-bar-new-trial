import React, { useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Loader2, SearchX } from 'lucide-react';
import { ProductCard } from '../components/ui/ProductCard';
import { useSearch } from '../hooks/useSearch';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';
    const { results, loading, error } = useSearch(query);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

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
                        {query ? (
                            <>Results for &ldquo;{query}&rdquo;</>
                        ) : (
                            'Search Products'
                        )}
                    </h1>
                    {!loading && query && (
                        <p className="text-body-muted mt-2 text-sm">
                            {results.length === 0 ? 'No products found.' : `${results.length} product${results.length !== 1 ? 's' : ''} found`}
                        </p>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="size-10 text-body-accent animate-spin" />
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="py-20 text-center">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Empty query */}
                {!query && !loading && (
                    <div className="py-20 text-center border border-body-border rounded-xl bg-body-card">
                        <Search size={40} className="mx-auto text-body-muted mb-4" />
                        <p className="text-gray-400 text-sm">Enter a search term above to find products.</p>
                    </div>
                )}

                {/* No results */}
                {query && !loading && !error && results.length === 0 && (
                    <div className="py-20 text-center border border-body-border rounded-xl bg-body-card">
                        <SearchX size={40} className="mx-auto text-body-muted mb-4" />
                        <p className="text-white font-semibold mb-1">No products match &ldquo;{query}&rdquo;</p>
                        <p className="text-body-muted text-sm mb-6">Try a different keyword or browse a category.</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {[
                                { label: 'Meals', path: '/diet-food' },
                                { label: 'Training', path: '/coaching' },
                                { label: 'Sportswear', path: '/gym-wear' },
                                { label: 'Supplements', path: '/supplements' },
                                { label: 'Equipment', path: '/equipment' },
                            ].map(c => (
                                <Link
                                    key={c.path}
                                    to={c.path}
                                    className="px-4 py-2 bg-body-secondary border border-body-border rounded-lg text-sm text-gray-300 hover:text-white hover:border-body-accent/40 transition-colors"
                                >
                                    {c.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results grid */}
                {query && !loading && !error && results.length > 0 && (
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
                )}
            </div>
        </div>
    );
}
