import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Dumbbell, Utensils, Zap, Shirt, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const categories = [
    { name: 'Diet Food', path: '/diet-food', icon: Utensils, color: 'text-green-400', desc: 'Gourmet healthy meals delivered.' },
    { name: 'Supplements', path: '/supplements', icon: Zap, color: 'text-yellow-400', desc: 'Fuel your performance.' },
    { name: 'Gym Wear', path: '/gym-wear', icon: Shirt, color: 'text-purple-400', desc: 'Premium fitness apparel.' },
    { name: 'Equipment', path: '/equipment', icon: Dumbbell, color: 'text-blue-400', desc: 'Machines & home gear.' },
    { name: 'Coaching', path: '/coaching', icon: Activity, color: 'text-red-400', desc: 'Expert guidance.' },
];

export default function Home() {
    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative h-[90vh] flex items-center justify-center bg-gradient-to-br from-body-dark via-body-card to-body-secondary overflow-hidden">
                {/* Abstract Background Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-body-accent opacity-5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
                            REDEFINE YOUR <span className="text-body-accent">LIMITS</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-body-muted max-w-2xl mx-auto mb-10">
                            One stop shop for all your body needs. <br />
                            Coaching, Meals, Supplements, and Gear.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/coaching">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Start Transformation <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/supplements">
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Shop Products
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Collections Banner */}
            <section className="py-24 bg-body-dark">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase italic">
                            <span className="text-body-accent">Explore</span> Collections
                        </h2>
                        <p className="text-body-muted">Everything you need to reach your fitness goals.</p>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border border-body-secondary group h-[500px]">
                        <div className="absolute inset-0 bg-gradient-to-t from-body-dark via-transparent to-transparent z-10" />
                        <img
                            src="/collections.png"
                            alt="BodyBar Collections"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-wrap justify-center gap-4">
                            {categories.map(cat => (
                                <Link key={cat.name} to={cat.path}>
                                    <Button variant="secondary" className="backdrop-blur-md bg-black/50 hover:bg-body-accent hover:text-black border border-white/10">
                                        {cat.name}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Banner */}
            <section className="py-24 bg-body-card relative border-y border-body-secondary">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <span className="text-body-accent font-bold tracking-wider text-sm uppercase">Mobile App</span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white">Train Anywhere, Anytime</h2>
                        <p className="text-body-muted text-lg">
                            Download the BodyBar app for customized workout plans, macro tracking, and direct access to your coach.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Button variant="secondary">App Store</Button>
                            <Button variant="secondary">Google Play</Button>
                        </div>
                    </div>
                    <div className="flex-1 bg-body-dark rounded-2xl h-[400px] w-full flex items-center justify-center border border-body-secondary">
                        <p className="text-body-muted">App Screenshot / Mockup Placeholder</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
