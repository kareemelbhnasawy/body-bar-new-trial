import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { User, Lock, Mail, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!supabase) {
            setError("Database client is not configured.");
            setLoading(false);
            return;
        }

        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                }
            }
        });

        if (authError) {
            setError(authError.message);
        } else {
            setSuccess(true);
            // Optionally auto-redirect after Registration, but good practice is to make them verify email or just wait
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        }
        
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-body-dark flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-body-card border border-white/10 rounded-3xl p-8 relative z-10 text-center"
                >
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                    <p className="text-gray-400">Welcome to BodyBar, {name}. Taking you to your dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-body-dark flex items-center justify-center p-4 pt-24 pb-12">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-body-accent/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-body-card border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-2">
                        Join <span className="text-body-accent">BodyBar</span>
                    </h2>
                    <p className="text-gray-400">Create your athlete profile today.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/10 flex items-start gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type="text" 
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-body-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-body-accent transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-body-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-body-accent transition-colors"
                                placeholder="athlete@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input 
                                type="password" 
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-body-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-body-accent transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        <p className="text-xs text-gray-500 ml-1">Must be at least 6 characters</p>
                    </div>

                    <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full bg-white text-black hover:bg-body-accent mt-6 group"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                            <span className="flex items-center justify-center">
                                Create Account
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already a member?{' '}
                    <Link to="/login" className="text-white hover:text-body-accent transition-colors font-semibold">
                        Log in here
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
