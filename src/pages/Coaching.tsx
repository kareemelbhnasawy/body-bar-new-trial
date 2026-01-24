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
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-white mb-4">Our Coaches</h1>
                    <p className="text-body-muted max-w-2xl mx-auto">
                        Expert guidance to help you smash your goals. Choose your mentor.
                    </p>
                </div>

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
                <div className="mt-24 bg-body-card rounded-2xl p-8 md:p-12 border border-body-secondary">
                    <div className="md:flex items-center justify-between gap-12">
                        <div className="flex-1 mb-8 md:mb-0">
                            <h2 className="text-3xl font-bold text-white mb-4">Corporate Wellness</h2>
                            <p className="text-body-muted mb-6">
                                Boost your team's productivity and health with our customized corporate programs.
                                We offer group sessions, health talks, and team building activities.
                            </p>
                            <Button size="lg" variant="secondary">Inquire Now</Button>
                        </div>
                        <div className="flex-1 bg-body-secondary h-64 rounded-xl flex items-center justify-center">
                            <p className="text-body-muted">Corporate Event Image Placeholder</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
