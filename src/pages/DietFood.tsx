import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Utensils, Check, Truck, Clock, Flame, ChevronRight, ShoppingCart, Leaf, Apple, Download, Sparkles, CheckCircle, Star, Zap } from 'lucide-react';
import { CategoryBanner } from '../components/ui/CategoryBanner';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

// ─── Official Body Bar Meal Plans (from PDF leaflets) ─────────────────────────
const OFFICIAL_PLANS = [
    {
        id: 'slim-bar',
        name: 'The Slim Bar',
        subtitle: 'Weight Loss Plan',
        calorieRange: '1200-1500',
        goal: 'Weight Loss',
        price: 2690,
        color: '#3B82F6', // Blue
        gradient: 'from-blue-600 to-blue-800',
        icon: '🔥',
        description: '35 meals/snacks per week designed for effective weight loss while maintaining energy and nutrition.',
        mealsPerWeek: 35,
        features: ['Calorie deficit optimized', 'High satiety meals', 'Low carb options', 'Daily variety guaranteed'],
        tagline: 'Transform your body with precision nutrition',
        leafletUrl: '/meals-leaflets/BlueLeaflet.pdf',
    },
    {
        id: 'al-kudra-bar',
        name: 'Al Kudra Bar',
        subtitle: 'Athlete & Maintenance',
        calorieRange: '2000-2200',
        goal: 'Maintenance',
        price: 2999,
        color: '#F97316', // Orange
        gradient: 'from-orange-500 to-orange-700',
        icon: '⚡',
        description: 'Perfect for athletes and those maintaining lean muscle. Balanced macros for sustained performance.',
        mealsPerWeek: 35,
        features: ['Balanced macros', 'Lean muscle support', 'Performance fuel', 'Recovery optimized'],
        tagline: 'Fuel your performance, maintain your gains',
        leafletUrl: '/meals-leaflets/OrangeLeafletNEW.pdf',
        popular: true,
    },
    {
        id: 'rep-max-bar',
        name: 'Rep Max Bar',
        subtitle: 'Muscle Gain Plan',
        calorieRange: '3000-3300',
        goal: 'Muscle Gain',
        price: 3199,
        color: '#22C55E', // Green
        gradient: 'from-green-500 to-green-700',
        icon: '💪',
        description: 'High-calorie bulking plan with optimal protein and carbs for maximum muscle growth.',
        mealsPerWeek: 35,
        features: ['Calorie surplus', 'High protein', 'Muscle building', 'Mass gainer meals'],
        tagline: 'Build serious muscle with serious nutrition',
        leafletUrl: '/meals-leaflets/GreenLeaflet.pdf',
    },
];

const PLAN_BENEFITS = [
    { icon: Leaf, label: 'No Added Sugar', desc: 'Clean ingredients only' },
    { icon: CheckCircle, label: 'GMO Free', desc: 'Natural & healthy' },
    { icon: Sparkles, label: 'Fresh Daily', desc: 'Never frozen' },
    { icon: Truck, label: 'Free Delivery', desc: 'To your doorstep' },
];

const GOAL_FILTERS = ['All', 'Weight Loss', 'Muscle Gain', 'Keto', 'High Protein', 'Maintenance'] as const;
type GoalFilter = typeof GOAL_FILTERS[number];

const DURATION_FILTERS = ['All', '5-Day', '10-Day', '20-Day', 'Monthly'] as const;
type DurationFilter = typeof DURATION_FILTERS[number];

/** Infer a goal tag from product name */
function inferGoal(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('keto'))          return 'Keto';
    if (n.includes('weight') || n.includes('loss') || n.includes('lean') || n.includes('slim')) return 'Weight Loss';
    if (n.includes('bulk') || n.includes('muscle') || n.includes('gain') || n.includes('rep max')) return 'Muscle Gain';
    if (n.includes('kudra') || n.includes('athlete') || n.includes('maintain')) return 'Maintenance';
    if (n.includes('protein'))       return 'High Protein';
    return 'High Protein';
}

/** Infer duration tag from product name */
function inferDuration(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('month'))  return 'Monthly';
    if (n.includes('20'))     return '20-Day';
    if (n.includes('10'))     return '10-Day';
    if (n.includes('5'))      return '5-Day';
    return 'Monthly';
}

/** Assign badge by index */
const BADGE_CYCLE = [
    { label: 'Most Popular', cls: 'bg-amber-500 text-black' },
    { label: 'Best Value',   cls: 'bg-violet-600 text-white' },
    { label: "Chef's Choice",cls: 'bg-green-600 text-white'  },
    { label: 'New',          cls: 'bg-body-accent text-black' },
];

export default function DietFood() {
    const { products, loading } = useProducts('diet-food');
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [goalFilter,     setGoalFilter]     = useState<GoalFilter>('All');
    const [durationFilter, setDurationFilter] = useState<DurationFilter>('All');

    const enriched = products.map((p, i) => ({
        ...p,
        goal:     inferGoal(p.name),
        duration: inferDuration(p.name),
        badge:    BADGE_CYCLE[i % BADGE_CYCLE.length],
    }));

    const filtered = enriched.filter(p => {
        const goalOk     = goalFilter     === 'All' || p.goal     === goalFilter;
        const durationOk = durationFilter === 'All' || p.duration === durationFilter;
        return goalOk && durationOk;
    });

    const handleAddToCart = (product: any) => {
        addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    };

    const handleBuyNow = (product: any) => {
        handleAddToCart(product);
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-dvh bg-body-dark flex items-center justify-center">
                <Loader2 className="size-10 text-body-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-body-dark min-h-dvh">
            <CategoryBanner filterKey="diet-food" subtitle="Chef-crafted, macro-balanced plans delivered fresh to your door." />

            {/* ── OFFICIAL MEAL PLANS SECTION ─────────────────────────── */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-body-border">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="inline-block bg-body-accent/10 border border-body-accent/30 text-body-accent text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                            Monthly Subscription Plans
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white mb-3">
                            Choose Your <span className="text-body-accent">Body Bar</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-pretty">
                            Designed by a nutrition coach and personal trainer, cooked by a celebrity chef. 
                            All plans include daily delivery to your doorstep.
                        </p>
                    </div>

                    {/* Plan Benefits Bar */}
                    <div className="flex flex-wrap justify-center gap-6 mb-10">
                        {PLAN_BENEFITS.map(({ icon: Icon, label, desc }) => (
                            <div key={label} className="flex items-center gap-2 text-sm">
                                <div className="size-8 rounded-full bg-body-accent/10 flex items-center justify-center">
                                    <Icon size={14} className="text-body-accent" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-xs">{label}</p>
                                    <p className="text-gray-500 text-[10px]">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Plan Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {OFFICIAL_PLANS.map((plan, idx) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative bg-body-card rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                    plan.popular 
                                        ? 'border-body-accent shadow-xl shadow-body-accent/20 scale-[1.02]' 
                                        : 'border-body-border hover:border-body-accent/50'
                                }`}
                            >
                                {/* Popular badge */}
                                {plan.popular && (
                                    <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-body-accent text-black text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-b-lg">
                                        Most Popular
                                    </div>
                                )}

                                {/* Colored header */}
                                <div className={`h-2 bg-gradient-to-r ${plan.gradient}`} />

                                <div className="p-6">
                                    {/* Plan icon & name */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className="text-3xl mb-2 block">{plan.icon}</span>
                                            <h3 className="text-white font-bold text-xl">{plan.name}</h3>
                                            <p className="text-sm font-medium" style={{ color: plan.color }}>{plan.subtitle}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-white font-black text-3xl tabular-nums">AED {plan.price.toLocaleString()}</span>
                                            <p className="text-gray-500 text-xs">/month</p>
                                        </div>
                                    </div>

                                    {/* Calorie badge */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span 
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                                            style={{ background: `${plan.color}20`, color: plan.color, border: `1px solid ${plan.color}40` }}
                                        >
                                            <Flame size={12} />
                                            {plan.calorieRange} KCAL/day
                                        </span>
                                        <span className="text-gray-500 text-xs">{plan.mealsPerWeek} meals/week</span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-400 text-sm mb-5 text-pretty">{plan.description}</p>

                                    {/* Features */}
                                    <ul className="space-y-2 mb-6">
                                        {plan.features.map(f => (
                                            <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                                                <Check size={14} className="text-body-accent shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Actions */}
                                    <div className="space-y-2">
                                        <Button 
                                            className={`w-full font-bold ${plan.popular ? 'bg-body-accent text-black hover:bg-orange-400' : 'bg-body-secondary text-white hover:bg-body-accent hover:text-black border border-body-border'}`}
                                            onClick={() => {
                                                addToCart({ id: plan.id, name: `${plan.name} - Monthly Plan`, price: plan.price, image: '/images/category_diet_food_1771074226839.png' });
                                                navigate('/checkout');
                                            }}
                                        >
                                            <ShoppingCart size={15} className="mr-2" />
                                            Subscribe Now
                                        </Button>
                                        <a 
                                            href={plan.leafletUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-body-accent transition-colors py-2"
                                        >
                                            <Download size={12} />
                                            View Full Menu (PDF)
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Special diets note */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            🥗 <span className="text-gray-400">Special menus available for</span>{' '}
                            <span className="text-body-accent font-semibold">Keto</span> and{' '}
                            <span className="text-green-500 font-semibold">Vegan</span> diets.{' '}
                            <a href="https://wa.me/971569222772" target="_blank" rel="noopener" className="text-body-accent hover:underline">
                                WhatsApp us →
                            </a>
                        </p>
                    </div>

                    {/* First order discount */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 bg-gradient-to-r from-body-accent/10 via-body-accent/5 to-transparent border border-body-accent/30 rounded-xl p-6"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-body-accent/20 flex items-center justify-center">
                                    <Zap size={20} className="text-body-accent" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg">Get 10% OFF Your First Order!</p>
                                    <p className="text-gray-400 text-sm">New customers save on their first monthly plan</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-body-dark border-2 border-dashed border-body-accent/50 rounded-lg px-4 py-2 text-center">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Use Code</p>
                                    <p className="text-body-accent font-black text-lg tracking-wider">WELCOME10</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-gray-500 text-xs mt-4">
                            ✓ Sign in or create an account at checkout to apply the code
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── ADDITIONAL PRODUCTS SECTION ─────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {products.length > 0 && (
                    <>
                        <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Utensils size={18} className="text-body-accent" />
                            More Meal Options
                        </h3>
                        {/* Filter row */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {/* Goal filters */}
                    <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-xs text-body-muted font-semibold uppercase tracking-wider mr-1">Goal:</span>
                        {GOAL_FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setGoalFilter(f)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                                    goalFilter === f
                                        ? 'bg-body-accent text-black'
                                        : 'bg-body-card border border-body-border text-gray-400 hover:text-white hover:border-body-accent/40'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    {/* Duration filters */}
                    <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-xs text-body-muted font-semibold uppercase tracking-wider mr-1">Duration:</span>
                        {DURATION_FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setDurationFilter(f)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                                    durationFilter === f
                                        ? 'bg-body-secondary text-white border border-white/30'
                                        : 'bg-body-card border border-body-border text-gray-400 hover:text-white hover:border-body-accent/40'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product grid */}
                {filtered.length === 0 ? (
                    <div className="py-20 text-center border border-body-border rounded-xl bg-body-card">
                        <Utensils size={40} className="mx-auto text-body-muted mb-4" />
                        <p className="text-gray-400 font-semibold mb-2">No plans match your filters</p>
                        <button onClick={() => { setGoalFilter('All'); setDurationFilter('All'); }} className="text-body-accent text-sm hover:underline cursor-pointer">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map((plan, i) => (
                            <motion.div
                                key={plan.id}
                                layout
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-body-card border border-body-border rounded-2xl overflow-hidden flex flex-col group hover:border-body-accent/40 transition-colors"
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden bg-body-dark">
                                    <img
                                        src={plan.image}
                                        alt={plan.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded ${plan.badge.cls}`}>
                                        {plan.badge.label}
                                    </span>
                                    <div className="absolute top-3 right-3 flex gap-1.5">
                                        <span className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                                            {plan.duration}
                                        </span>
                                        <span className="bg-black/70 backdrop-blur-sm text-body-accent text-[10px] font-semibold px-2 py-0.5 rounded">
                                            {plan.goal}
                                        </span>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5 flex flex-col flex-1 gap-3">
                                    <div>
                                        <h3 className="text-white font-bold text-lg leading-snug text-balance">{plan.name}</h3>
                                        <p className="text-body-muted text-sm mt-1.5 line-clamp-2 text-pretty"
                                           dangerouslySetInnerHTML={{ __html: plan.description || 'Premium meal plan balanced for absolute performance.' }}
                                        />
                                    </div>

                                    {/* Plan specs */}
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            `${plan.duration} plan`,
                                            '3 meals/day',
                                            plan.goal,
                                        ].map(tag => (
                                            <span key={tag} className="flex items-center gap-1 text-[10px] text-gray-400 bg-body-secondary px-2 py-0.5 rounded-full border border-body-border">
                                                <Check size={9} className="text-body-accent" /> {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Price + actions */}
                                    <div className="mt-auto pt-3 border-t border-body-border">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-white font-black text-2xl tabular-nums">AED {plan.price.toFixed(0)}</span>
                                            <span className="text-body-muted text-xs">Free delivery</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                className="flex-1 bg-body-accent text-black hover:bg-orange-400 font-bold text-sm"
                                                onClick={() => handleBuyNow(plan)}
                                            >
                                                Buy Now
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="px-3 bg-body-secondary text-white hover:bg-body-accent hover:text-black border border-body-border"
                                                onClick={() => handleAddToCart(plan)}
                                                aria-label="Add to cart"
                                            >
                                                <ShoppingCart size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
                    </>
                )}
            </div>
        </div>
    );
}
