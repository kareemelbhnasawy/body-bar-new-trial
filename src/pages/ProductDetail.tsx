import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Loader2, Star, ShieldCheck, Truck } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import MuxPlayer from '@mux/mux-player-react';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);

    const { products, loading, error } = useProducts();
    const product = products.find(p => p.id === id);

    if (loading) {
        return (
            <div className="min-h-screen bg-body-dark flex items-center justify-center text-white">
                <Loader2 className="w-12 h-12 text-body-accent animate-spin" />
            </div>
        );
    }

    if (!product || error) {
        return (
            <div className="min-h-screen bg-body-dark flex items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                    <Link to="/supplements"><Button>Return to Shop</Button></Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
        });
    };

    const handleBuyItNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    return (
        <div className="bg-body-dark min-h-screen py-12 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to={-1 as any} className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Image Gallery */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-body-card rounded-3xl p-8 border border-white/5 flex items-center justify-center relative overflow-hidden group aspect-square"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-body-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {product.videoPlaybackId ? (
                            <MuxPlayer
                                playbackId={product.videoPlaybackId}
                                autoPlay="muted"
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover rounded-2xl relative z-10 [&::part(video)]:object-cover"
                            />
                        ) : (
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full max-w-md object-contain mix-blend-lighten transform group-hover:scale-105 transition-transform duration-700 relative z-10" 
                            />
                        )}
                    </motion.div>

                    {/* Product Details */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col justify-center"
                    >
                        <div className="mb-2">
                            <span className="text-body-accent text-sm font-bold uppercase tracking-wider">{product.category}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{product.name}</h1>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                                ))}
                            </div>
                            <span className="text-gray-400 text-sm">({product.rating || 5} Rating)</span>
                        </div>

                        <p className="text-4xl font-black text-white mb-8">AED {product.price.toFixed(2)}</p>
                        
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            {product.description || "Premium product description goes here."}
                        </p>

                        {/* Action Area & FOMO Timer */}
                        <div className="flex flex-col gap-4 mb-12 w-full max-w-sm">
                            <Button 
                                size="xl" 
                                onClick={handleAddToCart}
                                className="w-full bg-[#ff733b] hover:bg-[#e56835] text-white font-bold uppercase tracking-widest rounded-md"
                            >
                                Add to Cart
                            </Button>
                            <Button 
                                size="xl" 
                                onClick={handleBuyItNow}
                                className="w-full bg-[#3ae0e5] hover:bg-[#20c5ca] text-black font-bold uppercase tracking-widest rounded-md"
                            >
                                Buy It Now
                            </Button>

                            {/* Countdown Sales Box */}
                            <div className="mt-4 bg-[#ffc34a] rounded-md p-6 text-center border border-black/10 shadow-lg">
                                <h3 className="text-white text-3xl mb-1 font-medium drop-shadow-md">10% OFF Hurry up!</h3>
                                <p className="text-[#2b354d] text-lg font-medium mb-2">Sale ends in:</p>
                                <div className="text-[#1a253c] font-bold text-5xl tracking-widest font-mono mb-2">
                                    00:01:54:54
                                </div>
                                <div className="flex justify-center gap-6 text-[#fff8ed] font-medium text-sm">
                                    <span>2Days</span>
                                    <span>10Hrs</span>
                                    <span>5Mins</span>
                                    <span>40Secs</span>
                                </div>
                            </div>
                        </div>

                        {/* Guarantees */}
                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-6 h-6 text-body-accent flex-shrink-0" />
                                <div>
                                    <h4 className="text-white font-bold text-sm">Quality Assured</h4>
                                    <p className="text-gray-500 text-xs mt-1">Tested for purity and potency.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Truck className="w-6 h-6 text-body-accent flex-shrink-0" />
                                <div>
                                    <h4 className="text-white font-bold text-sm">Fast Shipping</h4>
                                    <p className="text-gray-500 text-xs mt-1">Free delivery over AED 400.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

