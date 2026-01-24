import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

export default function Calculator() {
    const [formData, setFormData] = useState({
        gender: 'male',
        age: '',
        height: '',
        weight: '',
        activity: '1.2',
        goal: 'maintain',
    });

    const [result, setResult] = useState<null | { tdee: number, bmr: number, label: string }>(null);

    const calculate = (e: React.FormEvent) => {
        e.preventDefault();
        const { gender, age, height, weight, activity, goal } = formData;

        // Mifflin-St Jeor Equation
        // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
        // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161

        let bmr = (10 * Number(weight)) + (6.25 * Number(height)) - (5 * Number(age));
        bmr = gender === 'male' ? bmr + 5 : bmr - 161;

        const tdee = bmr * Number(activity);

        let targetCalories = tdee;
        let label = 'Maintenance Calories';

        if (goal === 'cut') {
            targetCalories = tdee - 500;
            label = 'Fat Loss Calories';
        } else if (goal === 'bulk') {
            targetCalories = tdee + 500;
            label = 'Bulking Calories';
        }

        setResult({
            bmr: Math.round(bmr),
            tdee: Math.round(targetCalories),
            label
        });
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-body-dark min-h-screen py-12 flex items-center justify-center">
            <div className="max-w-2xl w-full px-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">Smart Calorie Calculator</h1>
                    <p className="text-body-muted">Scientifically calculate your daily nutrition needs.</p>
                </div>

                <div className="bg-body-card border border-body-secondary rounded-2xl p-8 md:p-10 shadow-2xl">
                    <form onSubmit={calculate} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
                                <select name="gender" onChange={handleInput} className="w-full bg-body-dark border border-body-secondary rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-body-accent focus:outline-none">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Age (years)</label>
                                <input required name="age" type="number" onChange={handleInput} className="w-full bg-body-dark border border-body-secondary rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-body-accent focus:outline-none" placeholder="25" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Height (cm)</label>
                                <input required name="height" type="number" onChange={handleInput} className="w-full bg-body-dark border border-body-secondary rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-body-accent focus:outline-none" placeholder="180" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Weight (kg)</label>
                                <input required name="weight" type="number" onChange={handleInput} className="w-full bg-body-dark border border-body-secondary rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-body-accent focus:outline-none" placeholder="80" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Activity Level</label>
                            <select name="activity" onChange={handleInput} className="w-full bg-body-dark border border-body-secondary rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-body-accent focus:outline-none">
                                <option value="1.2">Sedentary (Office job)</option>
                                <option value="1.375">Light Exercise (1-2 days/week)</option>
                                <option value="1.55">Moderate Exercise (3-5 days/week)</option>
                                <option value="1.725">Heavy Exercise (6-7 days/week)</option>
                                <option value="1.9">Athlete (2x per day)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Goal</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['cut', 'maintain', 'bulk'].map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, goal: g })}
                                        className={`py-3 rounded-lg border text-sm font-bold capitalize transition-colors ${formData.goal === g
                                                ? 'border-body-accent bg-body-accent/10 text-body-accent'
                                                : 'border-body-secondary text-body-muted hover:border-gray-500'
                                            }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button size="lg" className="w-full py-4 text-lg">Calculate Results</Button>
                    </form>

                    {result && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-8 pt-8 border-t border-body-secondary"
                        >
                            <div className="text-center">
                                <span className="text-sm text-body-muted uppercase tracking-widest">{result.label}</span>
                                <div className="text-6xl font-black text-white my-4 font-mono">
                                    {result.tdee} <span className="text-xl text-body-accent font-sans font-bold">kcal</span>
                                </div>
                                <div className="inline-block bg-body-secondary rounded-lg px-4 py-2 text-sm text-gray-300">
                                    Base Metabolic Rate (BMR): {result.bmr} kcal
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
