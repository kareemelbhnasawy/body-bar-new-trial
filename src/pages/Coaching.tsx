import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Loader2, Calendar, Star, CheckCircle, Dumbbell, Users, Trophy } from 'lucide-react';
import { CategoryBanner } from '../components/ui/CategoryBanner';
import { Button } from '../components/ui/Button';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { BookingModal } from '../components/ui/BookingModal';

// ─── Training packages ───────────────────────────────────────────────────────
const PACKAGES = [
    {
        title:    'Starter Pack',
        duration: '1 Month',
        sessions: '8 sessions',
        price:    1499,
        features: ['Initial fitness assessment', 'Custom workout plan', 'Nutrition guidance', 'WhatsApp support'],
        featured: false,
    },
    {
        title:    'Transform Pack',
        duration: '3 Months',
        sessions: '24 sessions',
        price:    3999,
        features: ['Everything in Starter', 'Monthly body analysis', 'Macro meal planning', 'Weekly check-ins', 'Progress tracking'],
        featured: true,
        badge:    'Most Popular',
    },
    {
        title:    'Elite Pack',
        duration: '6 Months',
        sessions: '52 sessions',
        price:    6999,
        features: ['Everything in Transform', 'Unlimited messaging', 'Monthly lab reviews', 'Supplement advice', 'Competition prep'],
        featured: false,
    },
];

// ─── Coach roster ────────────────────────────────────────────────────────────
const LOCAL_COACHES = [
    { name: 'Alyona',       title: 'Fitness Coach',     specialty: 'General fitness, strength, mobility', years: '9 yrs',  image: '/coaches_images/alyona.webp',     bio: 'Certified trainer with 9 years sculpting physiques. Master of general fitness, strength, bodybuilding, and nutrition coaching.' },
    { name: 'Ingy Sweid',   title: 'General Fitness',   specialty: 'Strength, cardio, yoga & holistic nutrition',    years: '8 yrs',  image: '/coaches_images/ingy_sweid.webp', bio: 'Qualified trainer and nutritionist integrating strength, cardio, and yoga for a well-balanced healthy life.' },
    { name: 'Coach Ramzy',  title: 'Personal Trainer',  specialty: 'CrossFit, athletic performance',      years: '10 yrs', image: '/coaches_images/ramzy.webp',       bio: "Dubai's leading certified personal trainer with over 10 years of experience. Certified in CrossFit and group exercise." },
    { name: 'Nikoleta',     title: 'Personal Trainer',  specialty: 'Weight loss, muscle building',        years: '7 yrs',  image: '/coaches_images/nikoleta.webp',    bio: 'Specializes in weight loss, strength & conditioning, muscle building, and postural correction.' },
    { name: 'Khaled',       title: 'Coach',             specialty: 'Functional training, bodybuilding',   years: '12 yrs', image: '/coaches_images/khaled.webp',      bio: 'Professional athlete and certified nutritionist. Expertise in functional training and athletic performance.' },
    { name: 'Elena',        title: 'Holistic Coach',    specialty: 'Tai Chi, Qi Gong, breathwork',        years: '5 yrs',  image: '/coaches_images/elena.webp',       bio: 'Holistic Health Coach & Hypnotherapist. Tailored sessions blending movement, breath, and visualization.' },
    { name: 'Someyah',      title: 'Personal Trainer',  specialty: 'Personalized effective programs',     years: '6 yrs',  image: '/coaches_images/someyah.webp',     bio: 'Certified trainer dedicated to helping others achieve their goals with 6 years of experience.' },
    { name: 'Ibrahim',      title: 'Fitness Coach',     specialty: 'Weight loss, nutrition, endurance',   years: '12 yrs', image: '/coaches_images/ibrahim.webp',     bio: '12 years of experience in weight loss, diet planning and endurance coaching to maximize your true potential.' },
    { name: 'Diana',        title: 'Personal Trainer',  specialty: 'CrossFit, body sculpting',            years: '7 yrs',  image: '/coaches_images/diana.webp',       bio: 'Certified personal trainer & CrossFit coach with 7 years of experience sculpting bodies.' },
];

export default function Coaching() {
    const { products, loading } = useProducts('coaching');
    const { addToCart } = useCart();

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedCoach,      setSelectedCoach]      = useState('Bassem');

    const openBooking = (coachName: string) => {
        setSelectedCoach(coachName);
        setIsBookingModalOpen(true);
    };

    const bassemPlans = products.filter(p =>
        p.name.toLowerCase().includes('bassem') ||
        p.name.toLowerCase().includes('coaching') ||
        p.name.toLowerCase().includes('one-to-one')
    );

    if (loading) {
        return (
            <div className="min-h-dvh bg-body-dark flex items-center justify-center">
                <Loader2 className="size-10 text-body-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-body-dark min-h-dvh">
            <CategoryBanner filterKey="coaching" subtitle="Certified trainers. Proven programs. Real transformations." />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

                {/* ── Featured: Coach Bassem ─────────────────────── */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-body-card border border-body-accent/20 rounded-2xl overflow-hidden"
                    >
                        <div className="flex flex-col lg:flex-row">
                            {/* Photo */}
                            <div className="lg:w-80 shrink-0 relative bg-body-secondary h-64 lg:h-auto">
                                <img
                                    src="/coaches_images/bassem.webp"
                                    alt="Coach Bassem"
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />
                                <span className="absolute top-3 left-3 bg-body-accent text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded">
                                    Head Trainer
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="font-display text-3xl font-black uppercase text-white">Coach Bassem</h2>
                                            <p className="text-body-accent text-sm font-bold tracking-wider uppercase">Head Trainer & Founder</p>
                                        </div>
                                        <a href="#" aria-label="Instagram" className="size-9 rounded-full bg-body-secondary flex items-center justify-center text-gray-400 hover:text-body-accent transition-colors">
                                            <Instagram size={16} />
                                        </a>
                                    </div>
                                    <p className="text-gray-400 mb-6 leading-relaxed text-pretty">
                                        With over a decade of elite training experience, Coach Bassem has helped hundreds of athletes and beginners shatter their plateaus. His evidence-based approach to hypertrophy, strength, and nutrition guarantees results.
                                    </p>
                                </div>

                                {/* Bassem's programs */}
                                {bassemPlans.length > 0 ? (
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-body-muted mb-3 border-b border-body-border pb-2">Exclusive Programs</h4>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {bassemPlans.map(plan => (
                                                <div key={plan.id} className="bg-body-dark rounded-xl p-4 border border-body-border hover:border-body-accent/40 transition-colors">
                                                    <h5 className="text-white font-bold text-sm">{plan.name}</h5>
                                                    <p className="text-body-accent font-black text-xl mt-1 tabular-nums">AED 375<span className="text-sm font-normal text-body-muted">/session</span></p>
                                                    <Button size="sm" className="mt-3 w-full bg-body-accent text-black hover:bg-orange-400 font-bold" onClick={() => openBooking('Bassem')}>
                                                        <Calendar size={13} className="mr-1.5" /> Book Session
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Button size="md" className="bg-body-accent text-black hover:bg-orange-400 font-bold self-start" onClick={() => openBooking('Bassem')}>
                                        <Calendar size={15} className="mr-2" /> Book a Session
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ── Training Packages ─────────────────────────── */}
                <section>
                    <div className="mb-6">
                        <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white text-balance">Training Packages</h2>
                        <p className="text-body-muted text-sm mt-1">Structured programs to drive consistent, measurable results.</p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {PACKAGES.map(pkg => (
                            <div
                                key={pkg.title}
                                className={`relative rounded-xl border p-6 flex flex-col gap-4 ${pkg.featured ? 'bg-body-accent/5 border-body-accent' : 'bg-body-card border-body-border'}`}
                            >
                                {pkg.badge && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-body-accent text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                        {pkg.badge}
                                    </span>
                                )}
                                <div>
                                    <h3 className="text-white font-bold text-lg">{pkg.title}</h3>
                                    <p className="text-body-muted text-xs mt-0.5">{pkg.sessions} · {pkg.duration}</p>
                                </div>
                                <ul className="space-y-2 flex-1">
                                    {pkg.features.map(f => (
                                        <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                                            <CheckCircle size={13} className="text-body-accent mt-0.5 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="border-t border-body-border pt-4">
                                    <p className="text-white font-black text-2xl tabular-nums">AED {pkg.price.toLocaleString()}</p>
                                    <Button
                                        size="sm"
                                        className={`mt-3 w-full font-bold ${pkg.featured ? 'bg-body-accent text-black hover:bg-orange-400' : 'bg-body-secondary text-white hover:bg-body-accent hover:text-black'}`}
                                        onClick={() => openBooking('Bassem')}
                                    >
                                        <Calendar size={13} className="mr-1.5" /> Choose Package
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Coach Roster ──────────────────────────────── */}
                <section>
                    <div className="mb-6">
                        <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white text-balance">Our Elite Roster</h2>
                        <p className="text-body-muted text-sm mt-1">Specialists across every training discipline.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {LOCAL_COACHES.map((coach, i) => (
                            <motion.div
                                key={coach.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-body-card border border-body-border rounded-2xl overflow-hidden group hover:border-body-accent/30 transition-colors flex flex-col"
                            >
                                <div className="relative h-56 overflow-hidden bg-body-secondary">
                                    <img
                                        src={coach.image}
                                        alt={coach.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/60 to-transparent" />
                                </div>
                                <div className="p-5 flex flex-col flex-1 gap-3">
                                    <div>
                                        <p className="text-[10px] text-body-accent uppercase tracking-widest font-bold">{coach.title} · {coach.years}</p>
                                        <h3 className="text-white font-bold text-lg mt-0.5">{coach.name}</h3>
                                        <p className="text-body-muted text-xs mt-0.5">{coach.specialty}</p>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 text-pretty flex-1">{coach.bio}</p>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[1,2,3,4,5].map(i => <Star key={i} size={11} className="text-amber-400 fill-amber-400" />)}
                                        <span className="text-body-muted text-xs ml-1">5.0</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="w-full bg-body-secondary text-white hover:bg-body-accent hover:text-black font-bold border border-body-border transition-colors"
                                        onClick={() => openBooking(coach.name)}
                                    >
                                        <Calendar size={13} className="mr-1.5" /> Book {coach.name.split(' ')[0]}
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── Corporate Wellness ────────────────────────── */}
                <section>
                    <div className="bg-body-card border border-body-border rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white mb-3 text-balance">Corporate Wellness</h2>
                            <p className="text-gray-400 leading-relaxed text-pretty mb-5">
                                Boost your team's productivity and health with customized corporate programs. Group sessions, health talks, and team-building activities.
                            </p>
                            <Button size="md" className="bg-body-accent text-black hover:bg-orange-400 font-bold">
                                Inquire Now
                            </Button>
                        </div>
                        <div className="w-full md:w-72 h-48 rounded-xl overflow-hidden shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
                                alt="Corporate Wellness"
                                className="w-full h-full object-cover opacity-70"
                            />
                        </div>
                    </div>
                </section>
            </div>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                baseProduct={products[0]}
                initialCoach={selectedCoach}
            />
        </div>
    );
}
