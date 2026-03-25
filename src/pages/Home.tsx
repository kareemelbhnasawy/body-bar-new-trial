import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Dumbbell, Utensils, Zap, Shirt, Activity, Star, ChevronDown, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeInOut" as any } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const categories = [
    { name: 'Diet Food', path: '/diet-food', icon: Utensils, color: 'text-green-400', desc: 'Gourmet healthy meals delivered.', img: '/images/category_diet_food_1771074226839.png' },
    { name: 'Supplements', path: '/supplements', icon: Zap, color: 'text-yellow-400', desc: 'Fuel your performance.', img: '/images/category_supplements_1771074241033.png' },
    { name: 'Gym Wear', path: '/gym-wear', icon: Shirt, color: 'text-purple-400', desc: 'Premium fitness apparel.', img: '/images/category_gym_wear_1771074258065.png' },
    { name: 'Equipment', path: '/equipment', icon: Dumbbell, color: 'text-blue-400', desc: 'Machines & home gear.', img: '/images/category_equipment_1771074286353.png' },
    { name: 'Coaching', path: '/coaching', icon: Activity, color: 'text-red-400', desc: 'Expert guidance.', img: '/images/category_coaching_1771074301340.png' },
];

export default function Home() {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

    return (
        <div className="overflow-hidden bg-body-dark">
            {/* Hero Section */}
            <section ref={targetRef} className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <motion.div
                    style={{ opacity, scale, y }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-body-dark z-10" />
                    <img
                        src="/images/hero_background_1771074198081.png"
                        alt="Gym Background"
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Content */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="mb-4 flex justify-center">
                            <span className="px-4 py-1.5 rounded-full border border-body-accent/30 bg-body-accent/10 text-body-accent text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
                                #1 Fitness Ecosystem
                            </span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
                            UNLEASH YOUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-body-accent to-orange-500">TRUE POTENTIAL</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-light">
                            Transform your body and mind with our premium coaching, nutrition, and gear. Everything you need, all in one place.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/coaching">
                                <Button size="xl" className="bg-body-accent text-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(255,100,42,0.4)]">
                                    Start Transformation <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/supplements">
                                <Button variant="outline" size="xl" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                                    Explore Store
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce"
                >
                    <ChevronDown className="w-8 h-8 text-body-muted/50" />
                </motion.div>
            </section>

            {/* Marquee Section */}
            <div className="bg-body-accent py-4 overflow-hidden whitespace-nowrap border-y border-black">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" as any }}
                    className="inline-block"
                >
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="text-black font-black text-4xl mx-8 italic uppercase tracking-widest">
                            TRAIN HARD • EAT CLEAN • STAY FOCUSED •
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Categories Bento Grid */}
            <section className="py-24 px-4 bg-body-dark">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase">
                            Our <span className="text-body-accent">Ecosystem</span>
                        </h2>
                        <p className="text-body-muted text-lg max-w-2xl mx-auto">
                            The complete toolkit for your fitness journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                        {/* Large Main Feature */}
                        <Link to="/coaching" className="md:col-span-2 md:row-span-2 group relative rounded-3xl overflow-hidden cursor-pointer border border-white/5">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent z-10" />
                            <img
                                src={categories[4].img}
                                alt="Coaching"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute bottom-0 left-0 p-8 z-20">
                                <div className="flex items-center gap-2 text-body-accent mb-2">
                                    <Activity className="w-6 h-6" />
                                    <span className="font-bold uppercase tracking-wider">Premium Coaching</span>
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-2">Expert 1-on-1 Mentorship</h3>
                                <p className="text-gray-300 max-w-md">Get personalized workout plans and nutrition guides tailored to your specific goals.</p>
                            </div>
                        </Link>

                        {/* Other Categories */}
                        {categories.slice(0, 4).map((cat, idx) => (
                            <Link key={cat.name} to={cat.path} className="group relative rounded-3xl overflow-hidden cursor-pointer border border-white/5 bg-body-card">
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors z-10" />
                                <img
                                    src={cat.img}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20 translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <cat.icon className={`w-8 h-8 ${cat.color} mb-3`} />
                                    <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                                    <p className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{cat.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* App Showcase Section */}
            <section className="py-24 bg-body-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-body-accent/5 blur-3xl rounded-full translate-x-1/2" />

                <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8 z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm">
                            <span className="w-2 h-2 rounded-full bg-body-accent animate-pulse" />
                            Available on iOS & Android
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
                            FITNESS IN <br />
                            YOUR <span className="text-body-accent">POCKET</span>
                        </h2>

                        <p className="text-xl text-gray-400">
                            Track your progress, log your meals, and communicate with your coach instantly. The BodyBar app is your daily companion for success.
                        </p>

                        <ul className="space-y-4">
                            {['Custom Workout Plans', 'Macro & Calorie Tracker', 'Direct Coach Messaging', 'Progress Analytics'].map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-white">
                                    <CheckCircle className="w-5 h-5 text-body-accent" />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-4 pt-4">
                            <Button size="lg" className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.93-.91 1.32.05 2.54.53 3.4 1.34-3.17 1.91-2.67 5.86.36 7.36zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                                    App Store
                                </span>
                            </Button>
                            <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 w-full sm:w-auto">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,10.84L17.84,12.27L15.6,10.03L20.3,13.16C20.67,13.37 20.67,13.91 20.3,14.12L20.3,10.84M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" /></svg>
                                    Google Play
                                </span>
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 relative z-10 flex justify-center">
                        <div className="relative w-[300px] md:w-[350px] aspect-[9/19] rounded-[3rem] border-[8px] border-body-secondary overflow-hidden shadow-2xl shadow-body-accent/20 bg-body-dark">
                            <img
                                src="/images/phone_mockup_fitness_app_1771074211736.png"
                                alt="App Interface"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute top-20 -right-10 bg-body-card/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg animate-bounce delay-700 hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Calories Burned</p>
                                    <p className="text-lg font-bold text-white">450 kcal</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-40 -left-10 bg-body-card/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg animate-bounce delay-1000 hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-body-accent/20 flex items-center justify-center text-body-accent">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Daily Steps</p>
                                    <p className="text-lg font-bold text-white">12,450</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials / Social Proof */}
            <section className="py-20 bg-body-dark border-t border-body-secondary">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-body-muted uppercase tracking-widest mb-8 text-sm">Trusted by 10,000+ Athletes</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {/* Placeholder Logos */}
                        {['Force', 'PowerLift', 'IronGym', 'CrossFit', 'Wellness'].map((brand) => (
                            <h3 key={brand} className="text-2xl font-black text-white">{brand}</h3>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
