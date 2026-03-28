import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface WishlistItem {
    product_id: string;
    product_name: string;
    product_price: number;
    product_image: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    isLoading: boolean;
    toggle: (item: WishlistItem) => Promise<void>;
    isWishlisted: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load wishlist from Supabase when user changes
    useEffect(() => {
        if (!user || !supabase) {
            setItems([]);
            return;
        }
        setIsLoading(true);
        supabase
            .from('wishlists')
            .select('product_id, product_name, product_price, product_image')
            .eq('user_id', user.id)
            .then(({ data }) => {
                setItems((data as WishlistItem[]) ?? []);
                setIsLoading(false);
            });
    }, [user]);

    const isWishlisted = useCallback(
        (productId: string) => items.some(i => i.product_id === productId),
        [items],
    );

    const toggle = useCallback(
        async (item: WishlistItem) => {
            if (!user || !supabase) return;

            const alreadySaved = items.some(i => i.product_id === item.product_id);

            if (alreadySaved) {
                // Optimistic remove
                setItems(prev => prev.filter(i => i.product_id !== item.product_id));
                await supabase
                    .from('wishlists')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('product_id', item.product_id);
            } else {
                // Optimistic add
                setItems(prev => [...prev, item]);
                await supabase.from('wishlists').insert({
                    user_id: user.id,
                    product_id: item.product_id,
                    product_name: item.product_name,
                    product_price: item.product_price,
                    product_image: item.product_image,
                });
            }
        },
        [user, items],
    );

    return (
        <WishlistContext.Provider value={{ items, isLoading, toggle, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
    return ctx;
}
