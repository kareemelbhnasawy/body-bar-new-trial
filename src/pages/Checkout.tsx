import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { items, cartTotal, clearCart } = useCart();
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSuccess(true);
        clearCart();
        setTimeout(() => {
            navigate('/profile');
        }, 3000);
    };

    if (isSuccess) {
        return (
            <div className="bg-body-dark min-h-screen flex items-center justify-center p-4">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-body-card p-12 rounded-3xl border border-body-accent/30 text-center max-w-lg shadow-[0_0_50px_rgba(255,100,42,0.15)]"
                >
                    <CheckCircle className="w-24 h-24 text-body-accent mx-auto mb-6" />
                    <h1 className="text-4xl font-black text-white mb-4">Order Confirmed!</h1>
                    <p className="text-gray-400 text-lg mb-8">Your gear is being prepped. We'll email your receipt shortly.</p>
                    <p className="text-sm text-body-accent font-bold animate-pulse">Redirecting to your profile...</p>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="bg-body-dark min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty.</h1>
                <Link to="/supplements">
                    <Button className="bg-body-accent text-body-dark">Return to Shop</Button>
                </Link>
            </div>
        );
    }

    const shipping = 15.00;
    const total = cartTotal + shipping;

    return (
        <div className="bg-body-dark min-h-screen py-12 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/supplements" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shopping
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <div>
                        <h2 className="text-3xl font-black text-white mb-8">Secure Checkout</h2>
                        
                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Shipping Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="First Name" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                    <input required placeholder="Last Name" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                </div>
                                <input required placeholder="Address" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="City" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                    <input required placeholder="Zip Code" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Payment Details</h3>
                                <input required placeholder="Card Number" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="MM/YY" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                    <input required placeholder="CVC" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-body-card border border-white/5 rounded-3xl p-8 sticky top-24 shadow-xl">
                            <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>
                            
                            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 rounded bg-black flex-shrink-0 border border-white/10 overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-medium text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-gray-400 text-xs mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-white font-bold text-sm">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-3">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-white">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black pt-4 border-t border-white/10">
                                    <span className="text-white">Total</span>
                                    <span className="text-body-accent">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                form="checkout-form" 
                                size="xl" 
                                className="w-full mt-8 bg-body-accent text-white hover:text-black shadow-[0_0_20px_rgba(255,100,42,0.3)]"
                            >
                                Place Order
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
