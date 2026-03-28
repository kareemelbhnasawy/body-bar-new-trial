import React from 'react';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    rating?: number;
    description?: string;
    badge?: string;
    badgeVariant?: 'hot' | 'new' | 'popular' | 'value';
}

const BADGE_CLASSES: Record<NonNullable<Product['badgeVariant']>, string> = {
    hot:     'bg-red-600 text-white',
    new:     'bg-green-600 text-white',
    popular: 'bg-amber-500 text-black',
    value:   'bg-violet-600 text-white',
};

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();
    const { toggle, isWishlisted } = useWishlist();
    const { user } = useAuth();
    const wishlisted = isWishlisted(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return; // silently no-op if not logged in
        toggle({
            product_id: product.id,
            product_name: product.name,
            product_price: product.price,
            product_image: product.image,
        });
    };

    const ratingValue = product.rating ?? 4.8;
    const fullStars = Math.floor(ratingValue);
    const badgeClass = product.badgeVariant ? BADGE_CLASSES[product.badgeVariant] : BADGE_CLASSES.hot;

    return (
        <Link to={`/product/${product.id}`} className="block group cursor-pointer h-full">
            <div className="bg-body-card border border-body-border rounded-xl overflow-hidden flex flex-col h-full transition-shadow duration-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)]">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-body-dark shrink-0">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge && (
                        <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${badgeClass}`}>
                            {product.badge}
                        </span>
                    )}
                    {/* Wishlist heart */}
                    <button
                        onClick={handleWishlist}
                        aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                        className={`absolute top-2 right-2 size-7 flex items-center justify-center rounded-full transition-colors duration-150 cursor-pointer ${
                            wishlisted
                                ? 'bg-body-accent text-white'
                                : 'bg-body-dark/70 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100'
                        }`}
                    >
                        <Heart size={13} className={wishlisted ? 'fill-white' : ''} />
                    </button>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1 gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-body-accent font-bold">
                        {product.category}
                    </span>

                    <h3 className="text-white text-sm font-semibold line-clamp-2 leading-snug flex-1 text-pretty">
                        {product.name}
                    </h3>

                    {/* Stars */}
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-px">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star
                                    key={i}
                                    size={10}
                                    className={i <= fullStars ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
                                />
                            ))}
                        </div>
                        <span className="text-[10px] text-body-muted tabular-nums">({ratingValue})</span>
                    </div>

                    {/* Price + Add to Cart */}
                    <div className="flex items-center justify-between pt-2 mt-auto border-t border-body-border">
                        <span className="text-white font-bold text-sm tabular-nums">
                            AED {product.price.toFixed(0)}
                        </span>
                        <button
                            onClick={handleAddToCart}
                            aria-label={`Add ${product.name} to cart`}
                            className="flex items-center gap-1.5 bg-body-accent hover:bg-orange-500 text-black font-bold text-xs px-3 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer"
                        >
                            <ShoppingBag size={11} />
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
