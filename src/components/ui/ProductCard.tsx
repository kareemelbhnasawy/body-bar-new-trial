import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    rating?: number;
    description?: string;
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

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

    return (
        <Link to={`/product/${product.id}`} className="block">
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-body-card rounded-xl overflow-hidden border border-body-secondary group"
            >
                <div className="relative aspect-square overflow-hidden bg-body-dark">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Button 
                            size="sm" 
                            onClick={handleAddToCart}
                            className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-body-accent hover:bg-white text-body-dark hover:text-black shadow-lg"
                        >
                            <ShoppingBag size={18} />
                        </Button>
                    </div>
                </div>

            <div className="p-4">
                <div className="text-xs text-body-accent mb-1 uppercase tracking-wider">{product.category}</div>
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-white font-semibold">AED {product.price}</span>
                    <div className="flex items-center text-yellow-500 text-xs">
                        <Star size={14} fill="currentColor" />
                        <span className="ml-1">{product.rating || 4.8}</span>
                    </div>
                </div>
            </div>
            </motion.div>
        </Link>
    );
}
