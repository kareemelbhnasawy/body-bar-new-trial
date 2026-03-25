import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const plans = [
    {
        id: 'slim',
        name: 'The Slim Bar',
        calories: '1200 - 1500 kcal',
        type: 'Vegan or Balanced',
        features: ['Free Nutrition Consultation', 'Weekend Pause', 'Fresh Daily Delivery', 'Allergy Customization'],
        price: 'Daily from AED 100', // Example
        color: 'border-body-accent/50'
    },
    {
        id: 'kudra',
        name: 'Al Kudra Bar',
        calories: '2000 - 2200 kcal',
        type: 'Balanced Diet',
        features: ['Performance Focused', 'Free Consultation', 'Weekend Pause', 'High Protein'],
        price: 'Daily from AED 130',
        color: 'border-white/20'
    },
    {
        id: 'repmax',
        name: 'Rep Max Bar',
        calories: '3000 - 3300 kcal',
        type: 'Bulking / High Energy',
        features: ['Maximum Calories', 'Free Consultation', 'Weekend Pause', 'Athlete Portions'],
        price: 'Daily from AED 160',
        color: 'border-body-accent'
    }
];

export default function DietFood() {
    return (
        <div className="bg-body-dark min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Fine-Dine Healthy Meals</h1>
                    <p className="text-body-accent font-medium max-w-2xl mx-auto">
                        Gourmet meals designed for athletes. Delicious flavor meets essential nutrients.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-body-card rounded-2xl p-8 border-t-4 ${plan.color} relative overflow-hidden group`}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                {/* Abstract shape */}
                                <div className="w-32 h-32 rounded-full bg-body-accent blur-2xl" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                            <div className="text-body-accent font-mono text-sm mb-4">{plan.calories}</div>
                            <p className="text-body-muted text-sm mb-6 uppercase tracking-wider">{plan.type}</p>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feat, idx) => (
                                    <li key={idx} className="flex items-start text-sm text-gray-300">
                                        <Check size={16} className="text-body-accent mr-2 mt-0.5" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <p className="text-white font-semibold mb-4">{plan.price}</p>
                                <Button className={`w-full ${plan.id !== 'kudra' ? 'bg-body-accent text-body-dark hover:bg-white' : 'bg-white text-body-dark hover:bg-body-accent'}`}>
                                    View Plan <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
