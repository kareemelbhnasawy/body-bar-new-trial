import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Truck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const product = mockProducts.find(p => p.id === id);

    if (!product) {
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
        });
        // If they want to add multiple at once, we'd adjust the addToCart logic, but for simplicity here's standard add
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
                        className="bg-body-card rounded-3xl p-8 border border-white/5 flex items-center justify-center relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-body-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full max-w-md object-contain mix-blend-lighten transform group-hover:scale-105 transition-transform duration-700 relative z-10" 
                        />
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

                        <p className="text-4xl font-black text-white mb-8">${product.price.toFixed(2)}</p>
                        
                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            {product.description || "Premium product description goes here."}
                        </p>

                        {/* Action Area */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Button 
                                size="xl" 
                                onClick={handleAddToCart}
                                className="flex-1 bg-body-accent text-white hover:text-black shadow-[0_0_20px_rgba(255,100,42,0.3)] transition-all transform hover:scale-105"
                            >
                                Add to Cart
                            </Button>
                            <Button size="xl" variant="outline" className="border-white/20 text-white">
                                Subscribe & Save 10%
                            </Button>
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
                                    <p className="text-gray-500 text-xs mt-1">Free delivery over $100.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

