import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard, type Product } from './ProductCard';

interface ProductCarouselProps {
    products: Product[];
    loading?: boolean;
    skeletonCount?: number;
}

export function ProductCarousel({ products, loading = false, skeletonCount = 5 }: ProductCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[200px] sm:w-[220px] bg-body-card rounded-xl overflow-hidden animate-pulse">
                        <div className="aspect-square bg-body-secondary" />
                        <div className="p-3 space-y-2">
                            <div className="h-2.5 bg-body-secondary rounded w-1/3" />
                            <div className="h-3.5 bg-body-secondary rounded w-3/4" />
                            <div className="h-3 bg-body-secondary rounded w-1/2" />
                            <div className="h-7 bg-body-secondary rounded mt-3" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 text-body-muted text-sm border border-body-border rounded-xl">
                Products coming soon.
            </div>
        );
    }

    return (
        <div className="relative group/carousel">
            {/* Left scroll button — desktop only */}
            <button
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden md:flex items-center justify-center size-10 rounded-full bg-body-card border border-body-border text-white hover:bg-body-secondary transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
            >
                <ChevronLeft size={18} />
            </button>

            {/* Scroll track */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
            >
                {products.map(product => (
                    <div key={product.id} className="flex-shrink-0 w-[200px] sm:w-[220px]">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Right scroll button — desktop only */}
            <button
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden md:flex items-center justify-center size-10 rounded-full bg-body-card border border-body-border text-white hover:bg-body-secondary transition-colors shadow-lg opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
}
