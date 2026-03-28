import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Loader2, Star, ShieldCheck, Truck, Heart,
    ShoppingBag, Zap, Clock, Package, ChevronDown, Send,
    CheckCircle2, Lock,
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../hooks/useReviews';
import MuxPlayer from '@mux/mux-player-react';

const TRUST_ITEMS = [
    { icon: ShieldCheck, label: 'Quality Assured', sub: 'Tested & verified products' },
    { icon: Truck,       label: 'Free Delivery',  sub: 'On orders over AED 250' },
    { icon: Lock,        label: 'Secure Payment', sub: 'SSL encrypted checkout' },
    { icon: Package,     label: 'Easy Returns',   sub: '14-day return policy' },
];

function StarRow({ value, size = 16 }: { value: number; size?: number }) {
    const full = Math.floor(value);
    return (
        <div className="flex items-center gap-px">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={size}
                    className={i <= full ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
                />
            ))}
        </div>
    );
}

// Meal-plan metadata inferred from product name
function isMealPlan(name: string) {
    return name.toLowerCase().includes('meal plan') || name.toLowerCase().includes('meal');
}

const MEAL_FAQS = [
    {
        q: 'How does delivery work?',
        a: 'Fresh meals are prepared daily and delivered to your door between 7–10 AM. A delivery window confirmation is sent the evening before.',
    },
    {
        q: 'Can I customise my macros?',
        a: 'Yes — after purchase you can specify your calorie target, intolerances, and preferences via the onboarding form.',
    },
    {
        q: 'What is the minimum plan duration?',
        a: 'Our shortest plan is 5 days. Longer plans offer a discounted per-meal rate.',
    },
    {
        q: 'Are the meals halal?',
        a: 'All BodyBar meals are 100% halal-certified.',
    },
];

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-body-border last:border-0">
            <button
                onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between py-4 text-left text-white text-sm font-semibold hover:text-body-accent transition-colors cursor-pointer"
            >
                {q}
                <ChevronDown
                    size={16}
                    className={`shrink-0 text-body-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-4 text-body-muted text-sm leading-relaxed">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toggle, isWishlisted } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { products, loading, error } = useProducts();
    const product = products.find(p => p.id === id);

    // Reviews
    const { reviews, loading: reviewsLoading, avgRating, submitReview } = useReviews(id ?? '');
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewBody, setReviewBody] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    if (loading) {
        return (
            <div className="min-h-dvh bg-body-dark flex items-center justify-center">
                <Loader2 className="size-12 text-body-accent animate-spin" />
            </div>
        );
    }

    if (!product || error) {
        return (
            <div className="min-h-dvh bg-body-dark flex flex-col items-center justify-center gap-4 text-center px-4">
                <h2 className="font-display text-4xl font-black uppercase text-white">Product Not Found</h2>
                <p className="text-body-muted text-sm">This product may have been removed or is temporarily unavailable.</p>
                <Link
                    to="/supplements"
                    className="mt-2 px-6 py-3 bg-body-accent hover:bg-orange-500 text-black font-bold rounded-xl transition-colors"
                >
                    Return to Shop
                </Link>
            </div>
        );
    }

    const wishlisted = isWishlisted(product.id);
    const displayRating = avgRating > 0 ? avgRating : (product.rating ?? 4.8);
    const reviewCount = reviews.length;
    const mealPlan = isMealPlan(product.name);

    const handleAddToCart = () => {
        addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        navigate('/checkout');
    };

    const handleWishlist = () => {
        if (!user) return;
        toggle({ product_id: product.id, product_name: product.name, product_price: product.price, product_image: product.image });
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !reviewName.trim()) return;
        setReviewSubmitting(true);
        await submitReview({ productId: product.id, userId: user.id, displayName: reviewName, rating: reviewRating, body: reviewBody });
        setReviewSubmitting(false);
        setReviewSubmitted(true);
        setReviewName('');
        setReviewBody('');
        setReviewRating(5);
    };

    return (
        <div className="bg-body-dark min-h-dvh">
            {/* Back */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-body-muted hover:text-white text-sm transition-colors cursor-pointer"
                >
                    <ArrowLeft size={16} /> Back
                </button>
            </div>

            {/* Main product section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

                    {/* ── Left: Image / Video ───────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="bg-body-card border border-body-border rounded-2xl overflow-hidden aspect-square flex items-center justify-center relative group">
                            {product.videoPlaybackId ? (
                                <MuxPlayer
                                    playbackId={product.videoPlaybackId}
                                    autoPlay="muted"
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover [&::part(video)]:object-cover"
                                />
                            ) : (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            )}
                        </div>
                    </motion.div>

                    {/* ── Right: Details ─────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col gap-5"
                    >
                        {/* Category chip */}
                        <span className="text-body-accent text-xs font-bold uppercase tracking-widest">
                            {product.category}
                        </span>

                        {/* Product name */}
                        <h1 className="font-display text-4xl sm:text-5xl font-black uppercase text-white tracking-tight text-balance leading-none">
                            {product.name}
                        </h1>

                        {/* Rating row */}
                        <div className="flex items-center gap-3">
                            <StarRow value={displayRating} size={16} />
                            <span className="text-body-muted text-sm tabular-nums">
                                {displayRating.toFixed(1)} ({reviewCount > 0 ? `${reviewCount} review${reviewCount !== 1 ? 's' : ''}` : 'No reviews yet'})
                            </span>
                        </div>

                        {/* Price */}
                        <p className="font-display text-5xl font-black text-white tabular-nums">
                            AED {product.price.toFixed(0)}
                        </p>

                        {/* Meal plan macros strip */}
                        {mealPlan && (
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { label: 'Calories', value: '~1,800 kcal' },
                                    { label: 'Protein',  value: '140g' },
                                    { label: 'Carbs',    value: '180g' },
                                    { label: 'Fat',      value: '55g' },
                                ].map(m => (
                                    <div key={m.label} className="bg-body-card border border-body-border rounded-xl p-3 text-center">
                                        <p className="text-body-accent font-bold text-sm tabular-nums">{m.value}</p>
                                        <p className="text-body-muted text-[10px] uppercase tracking-wider mt-0.5">{m.label}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <p className="text-body-muted text-sm leading-relaxed text-pretty">
                                {product.description}
                            </p>
                        )}

                        {/* Meal plan sample menu */}
                        {mealPlan && (
                            <div className="bg-body-card border border-body-border rounded-xl p-4">
                                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                                    <Clock size={14} className="text-body-accent" />
                                    Sample Day Menu
                                </h3>
                                <ul className="space-y-1.5">
                                    {[
                                        { time: 'Breakfast', meal: 'Egg white omelette with spinach & whole-grain toast' },
                                        { time: 'Snack',     meal: 'Greek yogurt with berries' },
                                        { time: 'Lunch',     meal: 'Grilled chicken breast, brown rice & roasted veg' },
                                        { time: 'Snack',     meal: 'Mixed nuts & apple' },
                                        { time: 'Dinner',    meal: 'Salmon fillet with quinoa & steamed broccoli' },
                                    ].map(row => (
                                        <li key={row.time} className="flex items-start gap-3 text-sm">
                                            <span className="text-body-accent font-bold text-[10px] uppercase tracking-wide w-16 shrink-0 pt-0.5">{row.time}</span>
                                            <span className="text-body-muted">{row.meal}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 bg-body-accent hover:bg-orange-500 text-black font-bold py-3.5 px-6 rounded-xl transition-colors duration-150 cursor-pointer"
                            >
                                <ShoppingBag size={18} />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-black font-bold py-3.5 px-6 rounded-xl transition-colors duration-150 cursor-pointer"
                            >
                                <Zap size={18} />
                                Buy Now
                            </button>
                            <button
                                onClick={handleWishlist}
                                aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                                className={`size-14 flex items-center justify-center rounded-xl border transition-colors duration-150 cursor-pointer shrink-0 ${
                                    wishlisted
                                        ? 'bg-body-accent border-body-accent text-white'
                                        : 'border-body-border text-gray-400 hover:border-body-accent/50 hover:text-white'
                                }`}
                            >
                                <Heart size={20} className={wishlisted ? 'fill-white' : ''} />
                            </button>
                        </div>

                        {/* Trust grid */}
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-body-border">
                            {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
                                <div key={label} className="flex items-start gap-3">
                                    <Icon size={16} className="text-body-accent shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white text-xs font-semibold">{label}</p>
                                        <p className="text-body-muted text-[11px]">{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Meal plan FAQ */}
                        {mealPlan && (
                            <div className="border-t border-body-border pt-4">
                                <h3 className="text-white font-bold text-sm mb-2">Delivery FAQ</h3>
                                {MEAL_FAQS.map(faq => <FaqItem key={faq.q} {...faq} />)}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* ── Reviews section ────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-body-border">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Rating summary */}
                    <div className="lg:col-span-1">
                        <h2 className="font-display text-3xl font-black uppercase text-white mb-4">Reviews</h2>
                        <div className="bg-body-card border border-body-border rounded-xl p-6 text-center">
                            <p className="font-display text-6xl font-black text-white tabular-nums">
                                {displayRating.toFixed(1)}
                            </p>
                            <StarRow value={displayRating} size={20} />
                            <p className="text-body-muted text-sm mt-2 tabular-nums">
                                {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Write a review */}
                        {user && !reviewSubmitted && (
                            <div className="mt-6 bg-body-card border border-body-border rounded-xl p-4">
                                <h3 className="text-white font-bold text-sm mb-4">Write a Review</h3>
                                <form onSubmit={handleSubmitReview} className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={reviewName}
                                        onChange={e => setReviewName(e.target.value)}
                                        required
                                        className="bg-body-secondary border border-body-border text-white text-sm rounded-lg px-3 py-2.5 placeholder-body-muted focus:outline-none focus:border-body-accent"
                                    />
                                    {/* Star picker */}
                                    <div className="flex items-center gap-1">
                                        {[1,2,3,4,5].map(n => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setReviewRating(n)}
                                                aria-label={`Rate ${n} stars`}
                                                className="cursor-pointer"
                                            >
                                                <Star
                                                    size={20}
                                                    className={n <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        placeholder="Share your experience (optional)"
                                        value={reviewBody}
                                        onChange={e => setReviewBody(e.target.value)}
                                        rows={3}
                                        className="bg-body-secondary border border-body-border text-white text-sm rounded-lg px-3 py-2.5 placeholder-body-muted focus:outline-none focus:border-body-accent resize-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={reviewSubmitting}
                                        className="flex items-center justify-center gap-2 bg-body-accent hover:bg-orange-500 disabled:opacity-60 text-black font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
                                    >
                                        {reviewSubmitting
                                            ? <Loader2 size={15} className="animate-spin" />
                                            : <><Send size={13} /> Submit Review</>
                                        }
                                    </button>
                                </form>
                            </div>
                        )}

                        {reviewSubmitted && (
                            <div className="mt-6 bg-green-900/30 border border-green-700/40 rounded-xl p-4 flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                                <p className="text-green-300 text-sm font-semibold">Review submitted — thank you!</p>
                            </div>
                        )}

                        {!user && (
                            <p className="mt-4 text-body-muted text-xs">
                                <Link to="/profile" className="text-body-accent hover:underline">Sign in</Link> to leave a review.
                            </p>
                        )}
                    </div>

                    {/* Review list */}
                    <div className="lg:col-span-2">
                        {reviewsLoading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="size-8 text-body-accent animate-spin" />
                            </div>
                        )}
                        {!reviewsLoading && reviews.length === 0 && (
                            <div className="py-12 text-center border border-body-border rounded-xl bg-body-card">
                                <Star size={32} className="mx-auto text-body-muted mb-3" />
                                <p className="text-gray-400 text-sm">Be the first to review this product.</p>
                            </div>
                        )}
                        {!reviewsLoading && reviews.length > 0 && (
                            <div className="space-y-4">
                                {reviews.map(r => (
                                    <div key={r.id} className="bg-body-card border border-body-border rounded-xl p-5">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div>
                                                <p className="text-white font-semibold text-sm">{r.display_name}</p>
                                                <p className="text-body-muted text-[11px] tabular-nums">
                                                    {new Date(r.created_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <StarRow value={r.rating} size={13} />
                                        </div>
                                        {r.body && <p className="text-body-muted text-sm leading-relaxed text-pretty">{r.body}</p>}
                                        {r.verified && (
                                            <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-green-400">
                                                <CheckCircle2 size={10} /> Verified Purchase
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
