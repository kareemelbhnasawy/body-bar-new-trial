import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { Button } from '../components/ui/Button';

const coaches = [
    {
        id: 'bassem',
        name: 'Bassem Abo Hashem',
        title: 'Head Coach',
        bio: 'Elite athlete with over 15 years of experience and 1000+ success stories.',
        image: 'https://placehold.co/400x500/171717/ededed?text=Bassem',
        specialties: ['Bodybuilding', 'Contest Prep']
    },
    {
        id: 'alyona',
        name: 'Alyona',
        title: 'Fitness Coach',
        bio: '9 years experience offering tailored programs for fitness and mobility.',
        image: 'https://placehold.co/400x500/171717/ededed?text=Alyona',
        specialties: ['Mobility', 'Strength']
    },
    {
        id: 'ramzy',
        name: 'Coach Ramzy',
        title: 'Personal Trainer',
        bio: 'Experienced in CrossFit and group exercise dynamics.',
        image: 'https://placehold.co/400x500/171717/ededed?text=Ramzy',
        specialties: ['CrossFit', 'HIIT']
    }
];

export default function Coaching() {
    return (
        <div className="bg-body-dark min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Our Coaches</h1>
                    <p className="text-body-accent font-medium max-w-2xl mx-auto">
                        Expert guidance to help you smash your goals. Choose your mentor.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {coaches.map((coach, i) => (
                        <motion.div
                            key={coach.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-body-card rounded-xl overflow-hidden border border-body-secondary group hover:border-body-accent transition-colors"
                        >
                            <div className="aspect-[4/5] bg-body-dark relative overflow-hidden">
                                <img
                                    src={coach.image}
                                    alt={coach.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <h3 className="text-2xl font-bold text-white">{coach.name}</h3>
                                    <p className="text-body-accent font-medium">{coach.title}</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-body-muted text-sm mb-4 line-clamp-3">{coach.bio}</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {coach.specialties.map(spec => (
                                        <span key={spec} className="px-2 py-1 bg-body-secondary text-xs rounded text-gray-300">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <Button className="flex-1">Book Session</Button>
                                    <Button variant="ghost" className="px-3"><Instagram size={20} /></Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Corporate / Group Info */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    className="mt-24 bg-body-card rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-body-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="md:flex items-center justify-between gap-12 relative z-10">
                        <div className="flex-1 mb-8 md:mb-0">
                            <h2 className="text-4xl font-black text-white mb-4">Corporate Wellness</h2>
                            <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                                Boost your team's productivity and health with our customized corporate programs.
                                We offer group sessions, health talks, and team building activities out of our premier facilities.
                            </p>
                            <Button size="xl" className="bg-body-accent text-body-dark hover:bg-white shadow-[0_0_20px_rgba(255,100,42,0.3)]">
                                Inquire Now
                            </Button>
                        </div>
                        <div className="flex-1 bg-black/50 h-72 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
                            <img src="https://placehold.co/600x400/171717/333333?text=Corporate+Wellness" alt="Corporate" className="w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
