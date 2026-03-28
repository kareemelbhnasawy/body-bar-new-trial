import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Utensils, Check, Truck, Clock, Flame, ChevronRight, ShoppingCart } from 'lucide-react';
import { CategoryBanner } from '../components/ui/CategoryBanner';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';

const GOAL_FILTERS = ['All', 'Weight Loss', 'Muscle Gain', 'Keto', 'High Protein', 'Maintenance'] as const;
type GoalFilter = typeof GOAL_FILTERS[number];

const DURATION_FILTERS = ['All', '5-Day', '10-Day', '20-Day', 'Monthly'] as const;
type DurationFilter = typeof DURATION_FILTERS[number];

/** Infer a goal tag from product name */
function inferGoal(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('keto'))          return 'Keto';
    if (n.includes('weight') || n.includes('loss') || n.includes('lean')) return 'Weight Loss';
    if (n.includes('bulk') || n.includes('muscle') || n.includes('gain')) return 'Muscle Gain';
    if (n.includes('protein'))       return 'High Protein';
    if (n.includes('maintain'))      return 'Maintenance';
    return 'High Protein';
}

/** Infer duration tag from product name */
function inferDuration(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('month'))  return 'Monthly';
    if (n.includes('20'))     return '20-Day';
    if (n.includes('10'))     return '10-Day';
    if (n.includes('5'))      return '5-Day';
    return '10-Day';
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            </div>
        </div>
    );
}
