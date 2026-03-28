import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../components/ui/ProductCard';

interface UseSearchResult {
    results: Product[];
    loading: boolean;
    error: string | null;
}

export function useSearch(query: string): UseSearchResult {
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const q = query.trim();

        if (!q || q.length < 2) {
            setResults([]);
            setLoading(false);
            setError(null);
            return;
        }

        // Clear pending debounce
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
            // Cancel any in-flight request
            if (abortRef.current) abortRef.current.abort();
            abortRef.current = new AbortController();

            setLoading(true);
            setError(null);

            try {
                if (!supabase) throw new Error('Supabase not configured');

                const { data, error: sbError } = await supabase
                    .from('products')
                    .select('*')
                    .ilike('title', `%${q}%`)
                    .limit(40);

                if (sbError) throw sbError;

                const mapped: Product[] = (data ?? []).map((row: any) => ({
                    id: String(row.id),
                    name: row.title ?? '',
                    category: row.product_type ?? '',
                    price: Number(row.price_range_v2?.min_variant_price?.amount ?? row.price ?? 0),
                    image: row.featured_image?.url ?? 'https://placehold.co/500x500/171717/ededed?text=No+Image',
                    rating: row.rating ? Number(row.rating) : undefined,
                    description: row.body_html?.replace(/<[^>]*>?/gm, '') ?? row.description ?? '',
                }));

                setResults(mapped);
            } catch (err: any) {
                if (err?.name !== 'AbortError') {
                    setError('Search failed. Please try again.');
                    setResults([]);
                }
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [query]);

    return { results, loading, error };
}
