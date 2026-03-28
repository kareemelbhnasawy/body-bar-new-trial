import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Truck, CreditCard, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const DIGITAL_CATEGORIES = ['training programs', 'coaching', 'healthy meals', 'diet-food'];
function isDigitalProduct(cat: string | undefined) {
    if (!cat) return false;
    return DIGITAL_CATEGORIES.some(d => cat.toLowerCase().includes(d));
}

interface GuestInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
}

const EMPTY_GUEST: GuestInfo = {
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zip: '',
};

export default function Checkout() {
    const { items, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [guest,         setGuest]         = useState<GuestInfo>(EMPTY_GUEST);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe'>('cod');
    const [clientSecret,  setClientSecret]  = useState<string | null>(null);
    const [orderId,       setOrderId]       = useState<string | null>(null);
    const [isPlacing,     setIsPlacing]     = useState(false);
    const [isSuccess,     setIsSuccess]     = useState(false);
    const [error,         setError]         = useState<string | null>(null);

    const hasDigital  = useMemo(() => items.some(i => isDigitalProduct(i.category)), [items]);
    const shipping    = hasDigital ? 0 : 15;
    const total       = cartTotal + shipping;
    const effectiveMethod = paymentMethod;

    const setField = (key: keyof GuestInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setGuest(g => ({ ...g, [key]: e.target.value }));

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return;
        setIsPlacing(true);
        setError(null);

        try {
            // Build order payload — user_id is optional (null for guests)
            const orderPayload: Record<string, any> = {
                total_amount:     total,
                status:           'pending',
                payment_method:   effectiveMethod === 'cod' ? 'cash_on_delivery' : 'stripe',
                guest_email:      user ? null : guest.email,
                guest_phone:      user ? null : guest.phone,
                guest_name:       user ? null : `${guest.firstName} ${guest.lastName}`,
                shipping_address: JSON.stringify({
                    address: guest.address || null,
                    city:    guest.city    || null,
                    zip:     guest.zip     || null,
                }),
            };
            if (user) orderPayload.user_id = user.id;

            const { data: orderData, error: orderErr } = await supabase
                .from('orders')
                .insert(orderPayload)
                .select()
                .single();

            if (orderErr) throw orderErr;

            await supabase.from('order_items').insert(
                items.map(item => ({
                    order_id:     orderData.id,
                    product_id:   item.id,
                    product_name: item.name,
                    quantity:     item.quantity,
                    price:        item.price,
                }))
            );

            setOrderId(orderData.id);

            if (effectiveMethod === 'cod') {
                clearCart();
                setIsSuccess(true);
                setTimeout(() => navigate(user ? '/profile' : '/'), 3000);
            } else {
                const { data: piData, error: funcErr } = await supabase.functions.invoke('create-payment-intent', {
                    body: { orderId: orderData.id },
                });
                if (funcErr) throw funcErr;
                setClientSecret(piData.clientSecret);
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsPlacing(false);
        }
    };

    // ── Success screen ────────────────────────────────────────────────────────
    if (isSuccess) {
        return (
            <div className="bg-body-dark min-h-dvh flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-body-card p-8 sm:p-12 rounded-2xl border border-body-accent/30 text-center max-w-md w-full shadow-2xl"
                >
                    <CheckCircle className="size-20 text-body-accent mx-auto mb-5" />
                    <h1 className="font-display text-4xl font-black uppercase text-white mb-3">Order Confirmed!</h1>
                    <p className="text-gray-400 text-sm mb-6 text-pretty">
                        {paymentMethod === 'cod'
                            ? 'Your order is placed! Our team will contact you to arrange delivery.'
                            : 'Payment received! Your gear is being prepped.'}
                    </p>
                    {user
                        ? <p className="text-xs text-body-accent font-bold animate-pulse">Redirecting to your profile…</p>
                        : <Link to="/" className="text-body-accent text-sm font-semibold hover:underline">← Back to shop</Link>
                    }
                </motion.div>
            </div>
        );
    }

    // ── Empty cart ────────────────────────────────────────────────────────────
    if (items.length === 0) {
        return (
            <div className="bg-body-dark min-h-dvh flex flex-col items-center justify-center gap-4 p-4 text-center">
                <ShoppingBag size={48} className="text-body-muted" />
                <h1 className="font-display text-3xl font-black uppercase text-white">Your cart is empty</h1>
                <Link to="/supplements" className="bg-body-accent hover:bg-orange-500 text-black font-bold px-6 py-3 rounded-xl transition-colors">
                    Shop Now
                </Link>
            </div>
        );
    }

    const inputCls = 'bg-body-secondary border border-body-border text-white placeholder-body-muted text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-body-accent w-full transition-colors';

    return (
        <div className="bg-body-dark min-h-dvh pb-24 md:pb-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-body-muted hover:text-white text-sm transition-colors cursor-pointer mb-6"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mb-8">
                    Checkout
                </h1>

                {/* Mobile: order summary first */}
                <div className="lg:hidden mb-6">
                    <OrderSummary items={items} cartTotal={cartTotal} shipping={shipping} total={total}
                        hasDigital={hasDigital} paymentMethod={paymentMethod} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* ── Left: form ─────────────────────────────────────── */}
                    <div className="lg:col-span-3 flex flex-col gap-5">

                        {/* Guest / account banner */}
                        {!user && (
                            <div className="flex items-start gap-3 bg-body-card border border-body-border rounded-xl p-4">
                                <User size={16} className="text-body-accent shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-300">
                                    You're checking out as a guest.{' '}
                                    <Link to="/login" className="text-body-accent hover:underline font-semibold">Sign in</Link>
                                    {' '}to track your orders, or continue below.
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                                {error}
                            </div>
                        )}


                        {/* Stripe form (step 2) */}
                        {clientSecret ? (
                            <div className="bg-body-card border border-body-border rounded-2xl p-6">
                                <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                                    <span className="size-7 rounded-full bg-body-accent text-black text-xs font-black flex items-center justify-center">2</span>
                                    Complete Payment
                                </h3>
                                <Elements stripe={stripePromise} options={{
                                    clientSecret,
                                    appearance: {
                                        theme: 'night',
                                        variables: {
                                            colorPrimary: '#F55A1A',
                                            colorBackground: '#1A100A',
                                            colorText: '#ffffff',
                                            colorDanger: '#ef4444',
                                            fontFamily: 'Inter, sans-serif',
                                            borderRadius: '10px',
                                        },
                                    },
                                }}>
                                    <CheckoutForm total={total} orderId={orderId!}
                                        onSuccess={() => { setIsSuccess(true); clearCart(); setTimeout(() => navigate(user ? '/profile' : '/'), 3000); }}
                                    />
                                </Elements>
                            </div>
                        ) : (
                            <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-5">

                                {/* Contact info */}
                                <div className="bg-body-card border border-body-border rounded-2xl p-5">
                                    <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                        <span className="size-6 rounded-full bg-white/10 text-gray-400 text-xs font-black flex items-center justify-center">1</span>
                                        Contact Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input required placeholder="First name" value={guest.firstName} onChange={setField('firstName')} className={inputCls} />
                                        <input required placeholder="Last name"  value={guest.lastName}  onChange={setField('lastName')}  className={inputCls} />
                                    </div>
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input required type="email" placeholder="Email address" value={guest.email} onChange={setField('email')} className={inputCls} />
                                        <input required type="tel"   placeholder="Phone number"  value={guest.phone} onChange={setField('phone')} className={inputCls} />
                                    </div>
                                </div>

                                {/* Shipping info (skip for digital-only) */}
                                {!hasDigital && (
                                    <div className="bg-body-card border border-body-border rounded-2xl p-5">
                                        <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                            <span className="size-6 rounded-full bg-white/10 text-gray-400 text-xs font-black flex items-center justify-center">2</span>
                                            Delivery Address
                                        </h3>
                                        <input required placeholder="Street address" value={guest.address} onChange={setField('address')} className={inputCls} />
                                        <div className="mt-3 grid grid-cols-2 gap-3">
                                            <input required placeholder="City"     value={guest.city} onChange={setField('city')} className={inputCls} />
                                            <input           placeholder="ZIP / PO" value={guest.zip}  onChange={setField('zip')}  className={inputCls} />
                                        </div>
                                    </div>
                                )}

                                {/* Payment method */}
                                <div className="bg-body-card border border-body-border rounded-2xl p-5">
                                    <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                        <span className="size-6 rounded-full bg-white/10 text-gray-400 text-xs font-black flex items-center justify-center">3</span>
                                        Payment Method
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                                                paymentMethod === 'cod'
                                                    ? 'border-body-accent bg-body-accent/10 text-white'
                                                    : 'border-body-border text-gray-400 hover:border-white/30'
                                            }`}
                                        >
                                            <Truck size={20} />
                                            <span className="font-bold text-sm">Cash on Delivery</span>
                                            <span className="text-[11px] opacity-70">Pay when you receive</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('stripe')}
                                            className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                                                paymentMethod === 'stripe'
                                                    ? 'border-body-accent bg-body-accent/10 text-white'
                                                    : 'border-body-border text-gray-400 hover:border-white/30'
                                            }`}
                                        >
                                            <CreditCard size={20} />
                                            <span className="font-bold text-sm">Pay Online</span>
                                            <span className="text-[11px] opacity-70">Visa / MC / Apple Pay</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isPlacing}
                                    className={`w-full flex items-center justify-center gap-2 font-black text-sm py-4 rounded-xl transition-colors cursor-pointer disabled:opacity-60 ${
                                                        effectiveMethod === 'stripe'
                                            ? 'bg-white text-black hover:bg-gray-100'
                                            : 'bg-body-accent hover:bg-orange-500 text-black'
                                    }`}
                                >
                                    {isPlacing ? 'Please wait…' : (
                                        effectiveMethod === 'stripe'
                                            ? <>Proceed to Payment → AED {total.toFixed(0)}</>
                                            : <>Place Order — AED {total.toFixed(0)}</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* ── Right: order summary (desktop only) ──────────── */}
                    <div className="hidden lg:block lg:col-span-2">
                        <div className="sticky top-36">
                            <OrderSummary items={items} cartTotal={cartTotal} shipping={shipping} total={total}
                                hasDigital={hasDigital} paymentMethod={paymentMethod} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrderSummary({ items, cartTotal, shipping, total, hasDigital, paymentMethod }: {
    items: any[]; cartTotal: number; shipping: number; total: number;
    hasDigital: boolean; paymentMethod: 'cod' | 'stripe';
}) {
    return (
        <div className="bg-body-card border border-body-border rounded-2xl p-5">
            <h3 className="text-white font-bold text-base mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                        <div className="size-12 rounded-lg bg-body-dark border border-body-border overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-semibold line-clamp-1">{item.name}</p>
                            <p className="text-body-muted text-[11px] mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-white text-xs font-bold tabular-nums shrink-0">
                            AED {(item.price * item.quantity).toFixed(0)}
                        </p>
                    </div>
                ))}
            </div>
            <div className="border-t border-body-border pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white tabular-nums">AED {cartTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400 font-bold' : 'text-white tabular-nums'}>
                        {shipping === 0 ? 'FREE' : `AED ${shipping.toFixed(0)}`}
                    </span>
                </div>
                {!hasDigital && (
                    <div className="flex justify-between text-gray-500 text-xs">
                        <span>Payment</span>
                        <span>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                    </div>
                )}
                <div className="flex justify-between font-black text-base pt-3 border-t border-body-border">
                    <span className="text-white">Total</span>
                    <span className="text-body-accent tabular-nums">AED {total.toFixed(0)}</span>
                </div>
            </div>
        </div>
    );
}
