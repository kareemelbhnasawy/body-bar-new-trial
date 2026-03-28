import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight, ChevronRight, ChevronLeft, Truck, ShieldCheck, Award, Smartphone,
    Star, Calendar, CheckCircle, Flame, Clock, Users,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductCarousel } from '../components/ui/ProductCarousel';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../lib/categories';
import type { Product } from '../components/ui/ProductCard';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Assign ecommerce badges to products by index so the UI feels live. */
function withBadges(products: Product[]): Product[] {
    const BADGES: { badge: string; badgeVariant: Product['badgeVariant'] }[] = [
        { badge: 'Most Popular', badgeVariant: 'popular' },
        { badge: 'Best Value',   badgeVariant: 'value'   },
        { badge: 'Hot',          badgeVariant: 'hot'     },
        { badge: 'New',          badgeVariant: 'new'     },
    ];
    return products.map((p, i) => ({ ...p, ...BADGES[i % BADGES.length] }));
}

// ─── Hero carousel slides ────────────────────────────────────────────────────
const HERO_SLIDES = [
    {
        id:       'meals',
        tag:      '#1 Category',
        heading:  'Chef-Crafted\nMeal Plans',
        sub:      'Fresh, macro-balanced plans delivered daily. Weight loss, muscle gain, keto and more.',
        cta:      'Shop Meal Plans',
        ctaPath:  '/diet-food',
        img:      '/images/category_diet_food_1771074226839.png',
        accent:   '#22C55E',
    },
    {
        id:       'coaches',
        tag:      'Personal Training',
        heading:  'Train With\nThe Best',
        sub:      '9 certified coaches. Personalised programs. Proven transformations.',
        cta:      'Find a Coach',
        ctaPath:  '/coaching',
        img:      '/images/category_coaching_1771074301340.png',
        accent:   '#F55A1A',
    },
    {
        id:       'sportswear',
        tag:      'Sportswear',
        heading:  'Wear Built\nFor Performance',
        sub:      'Premium fitness apparel engineered for every workout.',
        cta:      'Shop Sportswear',
        ctaPath:  '/gym-wear',
        img:      '/images/category_gym_wear_1771074258065.png',
        accent:   '#A78BFA',
    },
    {
        id:       'supplements',
        tag:      'Supplements',
        heading:  'Fuel Your\nTraining',
        sub:      'Lab-tested protein, creatine, amino acids and vitamins — all in one place.',
        cta:      'Shop Supplements',
        ctaPath:  '/supplements',
        img:      '/images/category_supplements_1771074241033.png',
        accent:   '#FBBF24',
    },
    {
        id:       'equipment',
        tag:      'Equipment',
        heading:  'Build Your\nHome Gym',
        sub:      'Commercial machines, barbells, dumbbells and accessories.',
        cta:      'Shop Equipment',
        ctaPath:  '/equipment',
        img:      '/images/category_equipment_1771074286353.png',
        accent:   '#60A5FA',
    },
] as const;

const TRUST_BADGES = [
    { icon: Truck,       label: 'Free delivery AED 250+' },
    { icon: Users,       label: '5,000+ members'          },
    { icon: ShieldCheck, label: 'Certified coaches'        },
    { icon: Award,       label: 'Lab-tested products'      },
] as const;

// ─── Static mock meal plans (shown when Supabase has no diet-food rows) ─────
const MOCK_MEAL_PLANS: Product[] = [
    { id: 'mock-1', name: '5-Day High-Protein Plan', category: 'Meal Plans', price: 299, image: '/images/category_diet_food_1771074226839.png', rating: 4.9, badge: 'Most Popular', badgeVariant: 'popular' },
    { id: 'mock-2', name: '10-Day Weight Loss Plan', category: 'Meal Plans', price: 549, image: '/images/category_diet_food_1771074226839.png', rating: 4.8, badge: 'Best Value', badgeVariant: 'value' },
    { id: 'mock-3', name: '20-Day Lean Bulk Plan',   category: 'Meal Plans', price: 999, image: '/images/category_diet_food_1771074226839.png', rating: 4.9, badge: 'Hot', badgeVariant: 'hot' },
    { id: 'mock-4', name: 'Monthly Keto Plan',        category: 'Meal Plans', price: 1499, image: '/images/category_diet_food_1771074226839.png', rating: 5.0, badge: 'New', badgeVariant: 'new' },
];

// ─── Featured coaches for homepage preview ───────────────────────────────────
const FEATURED_COACHES = [
    { name: 'Coach Bassem', title: 'Head Trainer & Founder', image: '/coaches_images/bassem.webp',   specialty: 'Hypertrophy & Strength' },
    { name: 'Alyona',       title: 'Certified Trainer',       image: '/coaches_images/alyona.webp',   specialty: 'General Fitness & Mobility' },
    { name: 'Coach Ramzy',  title: 'CrossFit & Performance',  image: '/coaches_images/ramzy.webp',    specialty: 'CrossFit & Athletic Performance' },
    { name: 'Nikoleta',     title: 'Transformation Coach',    image: '/coaches_images/nikoleta.webp', specialty: 'Weight Loss & Body Sculpting' },
];

// ─── Section header component ────────────────────────────────────────────────
function SectionHeader({ title, subtitle, linkTo, linkLabel = 'View All' }: {
    title: string; subtitle?: string; linkTo: string; linkLabel?: string;
}) {
    return (
        <div className="flex items-end justify-between mb-5 gap-4">
            <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white text-balance">
                    {title}
                </h2>
                {subtitle && <p className="text-body-muted text-sm mt-1">{subtitle}</p>}
            </div>
            <Link
                to={linkTo}
                className="flex items-center gap-1 text-body-accent text-sm font-semibold hover:text-orange-400 transition-colors shrink-0"
            >
                {linkLabel} <ChevronRight size={15} />
            </Link>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [paused,      setPaused]      = useState(false);

    const { products: mealProducts,       loading: mealLoading       } = useProducts('diet-food');
    const { products: sportswearProducts, loading: sportswearLoading } = useProducts('gym-wear');
    const { products: suppProducts,       loading: suppLoading       } = useProducts('supplements');
    const { products: equipProducts,      loading: equipLoading      } = useProducts('equipment');

    const mealsToShow = mealProducts.length > 0 ? withBadges(mealProducts) : MOCK_MEAL_PLANS;
    const sportswear  = withBadges(sportswearProducts);
    const supplements = withBadges(suppProducts);
    const equipment   = withBadges(equipProducts);

    const total = HERO_SLIDES.length;
    const prev  = useCallback(() => setActiveSlide(i => (i - 1 + total) % total), [total]);
    const next  = useCallback(() => setActiveSlide(i => (i + 1)         % total), [total]);

    // Auto-advance every 4.5 s, pauses on hover
    useEffect(() => {
        if (paused) return;
        const t = setInterval(next, 4500);
        return () => clearInterval(t);
    }, [paused, next]);

    const slide = HERO_SLIDES[activeSlide];

    return (
        <div className="overflow-x-hidden bg-body-dark">

            {/* ── 1. HERO CAROUSEL ─────────────────────────────────── */}
            <section
                className="relative overflow-hidden bg-body-card"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* Slides */}
                <div className="relative h-[420px] sm:h-[500px] md:h-[560px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            {/* Background image */}
                            <img
                                src={slide.img}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Gradient overlay — left-anchored text region */}
                            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10" />

                            {/* Text content */}
                            <div className="absolute inset-0 flex items-center">
                                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full">
                                    <div className="max-w-md">
                                        <motion.span
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded mb-4"
                                            style={{ background: slide.accent + '22', color: slide.accent, border: `1px solid ${slide.accent}44` }}
                                        >
                                            {slide.tag}
                                        </motion.span>
                                        <motion.h1
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15 }}
                                            className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white leading-[1.0] mb-4 text-balance whitespace-pre-line"
                                        >
                                            {slide.heading}
                                        </motion.h1>
                                        <motion.p
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-gray-300 text-sm sm:text-base mb-6 text-pretty leading-relaxed"
                                        >
                                            {slide.sub}
                                        </motion.p>
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.25 }}
                                        >
                                            <Link to={slide.ctaPath}>
                                                <button
                                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm text-black transition-opacity hover:opacity-90 cursor-pointer"
                                                    style={{ background: slide.accent }}
                                                >
                                                    {slide.cta} <ArrowRight size={15} />
                                                </button>
                                            </Link>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Prev / Next arrows */}
                    <button
                        onClick={prev}
                        aria-label="Previous slide"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Next slide"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
                    >
                        <ChevronRight size={18} />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                        {HERO_SLIDES.map((s, i) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSlide(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className="rounded-full transition-all duration-300 cursor-pointer"
                                style={{
                                    width:      i === activeSlide ? '24px' : '8px',
                                    height:     '8px',
                                    background: i === activeSlide ? slide.accent : 'rgba(255,255,255,0.35)',
                                }}
                            />
                        ))}
                    </div>

                    {/* Progress bar */}
                    {!paused && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
                            <motion.div
                                key={`${activeSlide}-progress`}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 4.5, ease: 'linear' }}
                                className="h-full origin-left"
                                style={{ background: slide.accent }}
                            />
                        </div>
                    )}
                </div>

                {/* Trust bar */}
                <div className="bg-body-dark border-t border-body-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-around py-3 gap-4 overflow-x-auto scrollbar-hide">
                            {TRUST_BADGES.map(({ icon: Icon, label }) => (
                                <span key={label} className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
                                    <Icon size={13} className="text-body-accent shrink-0" />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 2. CATEGORY STRIP ────────────────────────────────── */}
            <section className="bg-body-card border-b border-body-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            return (
                                <Link
                                    key={cat.label}
                                    to={cat.path}
                                    className="flex flex-col items-center gap-2 min-w-18 group cursor-pointer"
                                >
                                    <div
                                        className="size-14 rounded-2xl flex items-center justify-center bg-body-secondary border border-body-border group-hover:border-body-accent/50 transition-colors"
                                        style={{ boxShadow: `0 0 0 0 ${cat.color}` }}
                                    >
                                        <Icon size={22} style={{ color: cat.color }} />
                                    </div>
                                    <span className="text-[11px] font-semibold text-gray-400 group-hover:text-white transition-colors text-center leading-tight">
                                        {cat.shortLabel}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 3. AMAZON-STYLE CATEGORY BROWSE ─────────────────── */}
            <section className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Box 1 — Meal Plans */}
                    <Link to="/diet-food" className="group bg-body-card border border-body-border rounded-xl overflow-hidden hover:border-body-accent/40 transition-colors cursor-pointer">
                        <div className="p-4 pb-0">
                            <h3 className="font-bold text-white text-sm mb-3">Chef-Crafted Meal Plans</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-px bg-body-border">
                            {['Weight Loss', 'Muscle Gain', 'Keto', 'High Protein'].map(tag => (
                                <div key={tag} className="bg-body-card p-2">
                                    <img src="/images/category_diet_food_1771074226839.png" alt={tag}
                                        className="w-full aspect-square object-cover rounded group-hover:scale-105 transition-transform duration-300" />
                                    <p className="text-[10px] text-gray-400 mt-1 truncate">{tag}</p>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 py-3">
                            <span className="text-body-accent text-xs font-semibold">See all plans →</span>
                        </div>
                    </Link>

                    {/* Box 2 — Personal Training */}
                    <Link to="/coaching" className="group bg-body-card border border-body-border rounded-xl overflow-hidden hover:border-body-accent/40 transition-colors cursor-pointer">
                        <div className="p-4 pb-0">
                            <h3 className="font-bold text-white text-sm mb-3">Train With the Best</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-px bg-body-border">
                            {[
                                { label: 'Coach Bassem', img: '/coaches_images/bassem.webp' },
                                { label: 'Alyona',       img: '/coaches_images/alyona.webp' },
                                { label: 'Coach Ramzy',  img: '/coaches_images/ramzy.webp' },
                                { label: 'Nikoleta',     img: '/coaches_images/nikoleta.webp' },
                            ].map(c => (
                                <div key={c.label} className="bg-body-card p-2">
                                    <img src={c.img} alt={c.label}
                                        className="w-full aspect-square object-cover object-top rounded group-hover:scale-105 transition-transform duration-300" />
                                    <p className="text-[10px] text-gray-400 mt-1 truncate">{c.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 py-3">
                            <span className="text-body-accent text-xs font-semibold">Book a coach →</span>
                        </div>
                    </Link>

                    {/* Box 3 — Supplements */}
                    <Link to="/supplements" className="group bg-body-card border border-body-border rounded-xl overflow-hidden hover:border-body-accent/40 transition-colors cursor-pointer">
                        <div className="p-4 pb-0">
                            <h3 className="font-bold text-white text-sm mb-3">Top Supplements</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-px bg-body-border">
                            {['Protein', 'Creatine', 'Amino & Recovery', 'Vitamins'].map(tag => (
                                <div key={tag} className="bg-body-card p-2">
                                    <img src="/images/category_supplements_1771074241033.png" alt={tag}
                                        className="w-full aspect-square object-cover rounded group-hover:scale-105 transition-transform duration-300" />
                                    <p className="text-[10px] text-gray-400 mt-1 truncate">{tag}</p>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 py-3">
                            <span className="text-body-accent text-xs font-semibold">Shop supplements →</span>
                        </div>
                    </Link>

                    {/* Box 4 — Equipment & Sportswear */}
                    <div className="flex flex-col gap-4">
                        <Link to="/equipment" className="group bg-body-card border border-body-border rounded-xl overflow-hidden hover:border-body-accent/40 transition-colors cursor-pointer flex-1">
                            <div className="relative h-32 overflow-hidden">
                                <img src="/images/category_equipment_1771074286353.png" alt="Equipment"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-linear-to-t from-body-dark/80 to-transparent" />
                                <div className="absolute bottom-3 left-3">
                                    <p className="text-white font-bold text-sm">Gym Equipment</p>
                                    <span className="text-body-accent text-xs font-semibold">Shop now →</span>
                                </div>
                            </div>
                        </Link>
                        <Link to="/gym-wear" className="group bg-body-card border border-body-border rounded-xl overflow-hidden hover:border-body-accent/40 transition-colors cursor-pointer flex-1">
                            <div className="relative h-32 overflow-hidden">
                                <img src="/images/category_gym_wear_1771074258065.png" alt="Sportswear"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-linear-to-t from-body-dark/80 to-transparent" />
                                <div className="absolute bottom-3 left-3">
                                    <p className="text-white font-bold text-sm">Sportswear</p>
                                    <span className="text-body-accent text-xs font-semibold">Shop now →</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── 5. MEALS — Hero commerce section ─────────────────── */}
            <section className="py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Banner */}
                    <div className="relative rounded-2xl overflow-hidden mb-8 bg-body-card border border-body-border">
                        <div className="absolute inset-0">
                            <img
                                src="/images/category_diet_food_1771074226839.png"
                                alt=""
                                className="w-full h-full object-cover opacity-20"
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-body-dark via-body-dark/80 to-transparent" />
                        </div>
                        <div className="relative z-10 p-6 sm:p-10 max-w-lg">
                            <span className="inline-block bg-body-accent text-black text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded mb-3">
                                #1 Category
                            </span>
                            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white mb-3 text-balance">
                                Meal Plans<br />Delivered to You
                            </h2>
                            <p className="text-gray-400 text-sm mb-5 text-pretty">
                                Chef-crafted, macro-balanced plans. 5-day, 10-day, 20-day and monthly options across weight loss, muscle gain, keto and high-protein goals.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {['Weight Loss', 'Muscle Gain', 'Keto', 'High Protein', 'Maintenance'].map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-body-secondary border border-body-border text-xs text-gray-300 font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <Link to="/diet-food">
                                <Button size="md" className="bg-body-accent text-black hover:bg-orange-400 font-bold">
                                    Browse Meal Plans <ArrowRight size={15} className="ml-1.5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <SectionHeader title="Featured Meal Plans" subtitle="Chef-crafted, macro-balanced. Pick your goal." linkTo="/diet-food" />
                    <ProductCarousel products={mealsToShow} loading={mealLoading} />

                    {/* Meal plan features row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                        {[
                            { icon: Flame,    label: 'Goal-based plans',     desc: 'Weight loss, muscle gain, keto' },
                            { icon: Clock,    label: 'Flexible durations',   desc: '5, 10, 20-day or monthly'     },
                            { icon: Truck,    label: 'Daily delivery',        desc: 'Fresh to your door'            },
                            { icon: CheckCircle, label: 'Macro-tracked',     desc: 'Calories, protein, carbs, fat' },
                        ].map(({ icon: Icon, label, desc }) => (
                            <div key={label} className="bg-body-card border border-body-border rounded-xl p-4 flex flex-col gap-2">
                                <Icon size={18} className="text-body-accent" />
                                <p className="text-white text-sm font-semibold">{label}</p>
                                <p className="text-body-muted text-xs">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 4. PERSONAL TRAINING ─────────────────────────────── */}
            <section className="py-10 px-4 sm:px-6 lg:px-8 bg-body-card border-y border-body-border">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader
                        title="Personal Training"
                        subtitle="Certified coaches. Real results. Packages to suit every goal."
                        linkTo="/coaching"
                        linkLabel="See All Coaches"
                    />

                    {/* Coach cards */}
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 mb-8">
                        {FEATURED_COACHES.map(coach => (
                            <Link
                                key={coach.name}
                                to="/coaching"
                                className="shrink-0 w-50 bg-body-dark border border-body-border rounded-xl overflow-hidden group cursor-pointer hover:border-body-accent/40 transition-colors"
                            >
                                <div className="aspect-3/4 overflow-hidden bg-body-secondary relative">
                                    <img
                                        src={coach.image}
                                        alt={coach.name}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />
                                </div>
                                <div className="p-3">
                                    <p className="text-[10px] text-body-accent uppercase tracking-widest font-bold">{coach.title}</p>
                                    <h3 className="text-white font-bold text-sm mt-0.5">{coach.name}</h3>
                                    <p className="text-body-muted text-xs mt-1 line-clamp-2">{coach.specialty}</p>
                                    <div className="flex items-center gap-0.5 mt-2">
                                        {[1,2,3,4,5].map(i => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Package comparison */}
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            { title: 'Starter Pack',   duration: '1 Month',  sessions: '8 sessions',   price: 1499, desc: 'Perfect for beginners. Assess, plan, and start your transformation.' },
                            { title: 'Transform Pack', duration: '3 Months', sessions: '24 sessions',  price: 3999, desc: 'Our most popular package. Enough time to see real, lasting results.', featured: true },
                            { title: 'Elite Pack',     duration: '6 Months', sessions: '52 sessions',  price: 6999, desc: 'For serious athletes who want the complete coaching experience.' },
                        ].map(pkg => (
                            <div
                                key={pkg.title}
                                className={`relative rounded-xl border p-6 flex flex-col gap-3 ${pkg.featured ? 'bg-body-accent/5 border-body-accent' : 'bg-body-dark border-body-border'}`}
                            >
                                {pkg.featured && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-body-accent text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                )}
                                <div>
                                    <h3 className="text-white font-bold">{pkg.title}</h3>
                                    <p className="text-body-muted text-xs mt-1">{pkg.sessions} · {pkg.duration}</p>
                                </div>
                                <p className="text-gray-400 text-sm flex-1 text-pretty">{pkg.desc}</p>
                                <div className="border-t border-body-border pt-4">
                                    <p className="text-white font-black text-2xl tabular-nums">AED {pkg.price.toLocaleString()}</p>
                                    <Link to="/coaching" className="block mt-3">
                                        <Button
                                            size="sm"
                                            className={`w-full font-bold ${pkg.featured ? 'bg-body-accent text-black hover:bg-orange-400' : 'bg-body-secondary text-white hover:bg-body-accent hover:text-black'}`}
                                        >
                                            <Calendar size={13} className="mr-1.5" /> Book Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 5. SPORTSWEAR ────────────────────────────────────── */}
            <section className="py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader title="Sportswear" subtitle="Performance apparel for every move." linkTo="/gym-wear" />
                    <ProductCarousel products={sportswear} loading={sportswearLoading} />
                </div>
            </section>

            {/* ── 6. SUPPLEMENTS ───────────────────────────────────── */}
            <section className="py-10 px-4 sm:px-6 lg:px-8 bg-body-card border-y border-body-border">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader title="Supplements" subtitle="Fuel your performance. Lab-tested, results-driven." linkTo="/supplements" />
                    <ProductCarousel products={supplements} loading={suppLoading} />
                </div>
            </section>

            {/* ── 7. EQUIPMENT ─────────────────────────────────────── */}
            <section className="py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader title="Equipment" subtitle="Machines, barbells and home gym essentials." linkTo="/equipment" />
                    <ProductCarousel products={equipment} loading={equipLoading} />
                </div>
            </section>

            {/* ── 8. DEALS BANNER ──────────────────────────────────── */}
            <section className="py-10 px-4 sm:px-6 lg:px-8 bg-body-card border-t border-body-border">
                <div className="max-w-7xl mx-auto">
                    <div className="grid sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Meal Bundles',     desc: 'Subscribe & save up to 20%', path: '/diet-food',    color: '#22C55E' },
                            { label: 'Supplement Stack', desc: 'Bundle 3+ and save 15%',     path: '/supplements',  color: '#FBBF24' },
                            { label: 'Home Gym Kit',     desc: 'Complete starter packages',   path: '/equipment',    color: '#60A5FA' },
                        ].map(deal => (
                            <Link
                                key={deal.label}
                                to={deal.path}
                                className="group relative rounded-xl bg-body-dark border border-body-border p-6 flex flex-col gap-2 hover:border-body-accent/40 transition-colors cursor-pointer overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 size-24 rounded-full opacity-10 blur-2xl" style={{ background: deal.color, transform: 'translate(30%, -30%)' }} />
                                <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: deal.color }}>Weekly Deal</span>
                                <h3 className="text-white font-bold text-lg">{deal.label}</h3>
                                <p className="text-body-muted text-sm">{deal.desc}</p>
                                <span className="flex items-center gap-1 text-sm font-semibold mt-2" style={{ color: deal.color }}>
                                    Shop now <ArrowRight size={14} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── 9. APP DOWNLOAD ──────────────────────────────────── */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 border-t border-body-border">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                        {/* Text */}
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-body-accent animate-pulse" />
                                <span className="text-sm text-gray-400 font-medium">Available on iOS & Android</span>
                            </div>
                            <h2 className="font-display text-4xl sm:text-6xl font-black uppercase text-white leading-tight text-balance">
                                FITNESS IN YOUR <span className="text-body-accent">POCKET</span>
                            </h2>
                            <p className="text-gray-400 text-lg text-pretty">
                                Track your progress, log meals, and message your coach directly. The BodyBar app is your daily companion for results.
                            </p>
                            <ul className="space-y-3">
                                {['Custom Workout Plans', 'Macro & Calorie Tracker', 'Direct Coach Messaging', 'Progress Analytics'].map(f => (
                                    <li key={f} className="flex items-center gap-2.5 text-white text-sm">
                                        <CheckCircle size={16} className="text-body-accent shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button size="md" className="bg-white text-black hover:bg-gray-100 font-bold">
                                    <Smartphone size={16} className="mr-2" /> App Store
                                </Button>
                                <Button size="md" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                    <Smartphone size={16} className="mr-2" /> Google Play
                                </Button>
                            </div>
                        </div>

                        {/* Phone mockup */}
                        <div className="shrink-0 flex justify-center">
                            <div className="relative w-60 sm:w-70 aspect-9/19 rounded-[2.5rem] border-[6px] border-body-secondary overflow-hidden shadow-2xl shadow-body-accent/15 bg-body-dark">
                                <img
                                    src="/images/phone_mockup_fitness_app_1771074211736.png"
                                    alt="BodyBar app"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
