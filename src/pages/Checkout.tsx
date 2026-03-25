import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Truck, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// These categories require Stripe-ONLY payment (no cash on delivery)
const DIGITAL_CATEGORIES = ['training programs', 'coaching', 'healthy meals', 'diet-food'];

function isDigitalProduct(category: string | undefined) {
    if (!category) return false;
    const cat = category.toLowerCase();
    return DIGITAL_CATEGORIES.some(d => cat.includes(d));
}

export default function Checkout() {
    const { items, cartTotal, clearCart } = useCart();
    const { user, isLoading } = useAuth();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe'>('cod');
    const navigate = useNavigate();

    // Check if ANY item in the cart is digital — forces Stripe-only
    const hasDigitalItem = useMemo(() => 
        items.some(item => isDigitalProduct(item.category)),
    [items]);

    const shipping = hasDigitalItem ? 0 : 15.00;
    const total = cartTotal + shipping;

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !supabase) return;

        setIsPlacingOrder(true);
        setError(null);

        try {
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total_amount: total,
                    status: 'pending',
                    payment_method: paymentMethod === 'cod' ? 'cash_on_delivery' : 'stripe',
                })
                .select()
                .single();

            if (orderError) throw orderError;

            const orderItemsInsert = items.map(item => ({
                order_id: orderData.id,
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsInsert);

            if (itemsError) throw itemsError;

            setOrderId(orderData.id);

            if (paymentMethod === 'cod') {
                // Cash on delivery — no payment gateway needed
                setIsSuccess(true);
                clearCart();
                setTimeout(() => navigate('/profile'), 3000);
            } else {
                // Stripe — fetch payment intent
                const { data: piData, error: funcError } = await supabase.functions.invoke('create-payment-intent', {
                    body: { orderId: orderData.id }
                });
                if (funcError) throw funcError;
                setClientSecret(piData.clientSecret);
            }
        } catch (err: any) {
            console.error('Failed to initiate checkout:', err);
            setError(err.message || 'Something went wrong.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (isLoading) return null;
    if (!user) return <Navigate to="/login" replace />;

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
                    <p className="text-gray-400 text-lg mb-8">
                        {paymentMethod === 'cod'
                            ? "Your order is placed! Our team will contact you to arrange delivery."
                            : "Payment received! Your gear is being prepped."}
                    </p>
                    <p className="text-sm text-body-accent font-bold animate-pulse">Redirecting to your profile...</p>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="bg-body-dark min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty.</h1>
                <Link to="/supplements"><Button className="bg-body-accent text-body-dark">Return to Shop</Button></Link>
            </div>
        );
    }

    return (
        <div className="bg-body-dark min-h-screen py-12 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to={-1 as any} className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-3xl font-black text-white">Secure Checkout</h2>

                        {error && (
                            <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Payment method selector — only show if cart has NO digital items */}
                        {!hasDigitalItem && !clientSecret && (
                            <div className="bg-body-card rounded-2xl border border-white/5 p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                                            paymentMethod === 'cod'
                                                ? 'border-body-accent bg-body-accent/10 text-white'
                                                : 'border-white/10 text-gray-400 hover:border-white/30'
                                        }`}
                                    >
                                        <Truck className="w-6 h-6" />
                                        <span className="font-bold text-sm">Cash on Delivery</span>
                                        <span className="text-xs opacity-70">Pay when you receive</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('stripe')}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                                            paymentMethod === 'stripe'
                                                ? 'border-body-accent bg-body-accent/10 text-white'
                                                : 'border-white/10 text-gray-400 hover:border-white/30'
                                        }`}
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        <span className="font-bold text-sm">Pay Online</span>
                                        <span className="text-xs opacity-70">Visa, Mastercard, Apple Pay</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Digital-only notice */}
                        {hasDigitalItem && !clientSecret && (
                            <div className="flex items-start gap-3 bg-body-accent/10 border border-body-accent/30 rounded-xl p-4">
                                <Lock className="w-5 h-5 text-body-accent flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-300">
                                    Your cart includes an <strong className="text-body-accent">online / digital product</strong>. Secure online payment is required to activate your plan instantly.
                                </p>
                            </div>
                        )}

                        {/* Stripe payment form (after order creation) */}
                        {clientSecret ? (
                            <div className="bg-body-card border border-body-accent/20 rounded-3xl p-8 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-body-accent flex items-center justify-center text-sm font-black">2</span>
                                    Complete Payment
                                </h3>
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        clientSecret,
                                        appearance: {
                                            theme: 'night',
                                            variables: {
                                                colorPrimary: '#ff642a',
                                                colorBackground: '#1a253c',
                                                colorText: '#ffffff',
                                                colorDanger: '#df1b41',
                                                fontFamily: 'Inter, system-ui, sans-serif',
                                                spacingUnit: '4px',
                                                borderRadius: '8px',
                                            }
                                        }
                                    }}
                                >
                                    <CheckoutForm
                                        total={total}
                                        orderId={orderId!}
                                        onSuccess={() => {
                                            setIsSuccess(true);
                                            clearCart();
                                            setTimeout(() => navigate('/profile'), 3000);
                                        }}
                                    />
                                </Elements>
                            </div>
                        ) : (
                            /* Shipping form (step 1) */
                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-body-card rounded-2xl border border-white/5 p-6 space-y-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm text-gray-400">1</span>
                                    Shipping Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="First Name" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                    <input required placeholder="Last Name" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                </div>
                                <input required placeholder="Address" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="City" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                    <input required placeholder="Zip Code" className="bg-black/40 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-body-accent w-full" />
                                </div>

                                <Button
                                    type="submit"
                                    size="xl"
                                    disabled={isPlacingOrder}
                                    className="w-full mt-2 font-black uppercase tracking-widest rounded-md"
                                    style={{
                                        backgroundColor: (hasDigitalItem || paymentMethod === 'stripe') ? '#3ae0e5' : '#ff733b',
                                        color: (hasDigitalItem || paymentMethod === 'stripe') ? '#000' : '#fff',
                                    }}
                                >
                                    {isPlacingOrder
                                        ? 'Please wait...'
                                        : (hasDigitalItem || paymentMethod === 'stripe')
                                            ? 'Proceed to Secure Payment →'
                                            : `Place Order — AED ${total.toFixed(2)}`}
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* Right column — order summary */}
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
                                            {item.category && isDigitalProduct(item.category) && (
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-body-accent bg-body-accent/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                    Digital
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-white font-bold text-sm">
                                            AED {(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-3">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white">AED {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-white">
                                        {shipping === 0 ? <span className="text-green-400 font-bold">FREE</span> : `AED ${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                {!hasDigitalItem && (
                                    <div className="flex justify-between text-gray-500 text-xs">
                                        <span>Payment</span>
                                        <span>{paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online Payment'}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-black pt-4 border-t border-white/10">
                                    <span className="text-white">Total</span>
                                    <span className="text-body-accent">AED {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
