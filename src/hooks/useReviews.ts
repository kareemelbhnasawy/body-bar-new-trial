import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Review {
    id: string;
    created_at: string;
    product_id: string;
    user_id: string | null;
    display_name: string;
    rating: number;
    body: string | null;
    verified: boolean;
}

interface UseReviewsResult {
    reviews: Review[];
    loading: boolean;
    avgRating: number;
    submitReview: (params: { productId: string; userId: string; displayName: string; rating: number; body?: string }) => Promise<void>;
}

export function useReviews(productId: string): UseReviewsResult {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchReviews = useCallback(async () => {
        if (!productId || !supabase) return;
        setLoading(true);
        const { data } = await supabase
            .from('reviews')
            .select('*')
            .eq('product_id', productId)
            .order('created_at', { ascending: false });
        setReviews((data as Review[]) ?? []);
        setLoading(false);
    }, [productId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const avgRating =
        reviews.length === 0
            ? 0
            : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    const submitReview = useCallback(
        async ({ productId, userId, displayName, rating, body }: {
            productId: string;
            userId: string;
            displayName: string;
            rating: number;
            body?: string;
        }) => {
            if (!supabase) return;
            await supabase.from('reviews').insert({
                product_id: productId,
                user_id: userId,
                display_name: displayName,
                rating,
                body: body ?? null,
            });
            await fetchReviews();
        },
        [fetchReviews],
    );

    return { reviews, loading, avgRating, submitReview };
}
