import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Standardized frontend product model
export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    rating?: number;
    description?: string;
    videoPlaybackId?: string;
}

const MUX_VIDEO_MAPPING: Record<string, string> = {
    'ice-bath-barrel-plunge': 'DMwPNSEGySzwk02X93uLXiyW70000oH3Jt7RrcBtRO5601g',
    'womens-high-impact-seamless-bra-midnight-blue': 'JYA485QcqoGvtBp00TqqVIQBfOE285qRJbzG4bfcjPFo',
    'womens-seamless-scrunch-short-midnight-blue': 'FZLuetVkfxoYThaOrJQClibnJmQcBjTA8RhO3SPKrIA',
    'womens-seamless-scrunch-short-pink-cosmos': 'Td02agWHGUZneDzsChk6lUJ8hpYrhm0000FzizweAGbXu8'
};

export function useProducts(categoryFilter?: string) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                if (!supabase) {
                    throw new Error("Supabase client is not configured.");
                }

                let query = supabase.from('products').select('*');

                let { data, error: fetchError } = await query;

                if (fetchError) throw fetchError;

                let rawProducts = data || [];

                if (categoryFilter) {
                    const filter = categoryFilter.toLowerCase();
                    rawProducts = rawProducts.filter((p: any) => {
                        const type = (p.product_type || '').toLowerCase();
                        const title = (p.title || '').toLowerCase();
                        
                        if (filter === 'supplements') {
                            return type.includes('protein') || type.includes('mass gainer') || type.includes('amino') || type.includes('supplements') || title.includes('glutamine') || title.includes('centrum') || title.includes('bcaa');
                        }
                        if (filter === 'equipment') {
                            return type.includes('machine') || type.includes('gym accessories') || title.includes('powerbag') || title.includes('barbell') || title.includes('dumbbell');
                        }
                        if (filter === 'diet-food') {
                            return type.includes('healthy meals') || title.includes('meal plan');
                        }
                        if (filter === 'coaching') {
                            return type.includes('training programs') || title.includes('coaching');
                        }
                        if (filter === 'gym-wear') {
                            return title.includes('shirt') || title.includes('hoodie') || title.includes('legging') || title.includes('cap') || title.includes('wear');
                        }
                        return true;
                    });
                }

                // Map Shopify schema to our frontend Product interface
                const mappedProducts: Product[] = rawProducts.map((item: any) => ({
                    id: String(item.id),
                    name: item.title,
                    price: Number(item.price_range_v2?.min_variant_price?.amount || 0),
                    category: item.product_type || categoryFilter || 'Uncategorized',
                    // Use featured_image if available, otherwise a placeholder
                    image: item.featured_image?.url || 'https://placehold.co/500x500/171717/ededed?text=No+Image',
                    rating: 5,
                    description: item.body_html?.replace(/<[^>]*>?/gm, '') || item.description || '',
                    videoPlaybackId: MUX_VIDEO_MAPPING[item.handle] || undefined,
                }));

                setProducts(mappedProducts);
            } catch (err: any) {
                console.error('Error fetching products:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [categoryFilter]);

    return { products, loading, error };
}
