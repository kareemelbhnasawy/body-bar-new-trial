import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MessageCircle, Truck, ShieldCheck, Award, Lock } from 'lucide-react';
import { CATEGORIES } from '../lib/categories';

const TRUST_ITEMS = [
    { icon: Truck,       title: 'Free Delivery',     desc: 'On orders over AED 250' },
    { icon: ShieldCheck, title: 'Certified Coaches',  desc: 'Verified expert trainers' },
    { icon: Award,       title: 'Premium Quality',    desc: 'Lab-tested products' },
    { icon: Lock,        title: 'Secure Checkout',    desc: 'Stripe-powered payments' },
];

export default function Footer() {
    return (
        <footer className="bg-body-card border-t border-body-border mt-auto">
            {/* Trust bar */}
            <div className="border-b border-body-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-start gap-3">
                                <div className="size-10 rounded-lg bg-body-accent/10 flex items-center justify-center shrink-0">
                                    <Icon size={18} className="text-body-accent" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-semibold">{title}</p>
                                    <p className="text-body-muted text-xs mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main footer grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/">
                            <img
                                src="/images/FinalLogobrown.png"
                                alt="BodyBar"
                                className="h-9 w-auto brightness-0 invert hover:opacity-80 transition-opacity"
                            />
                        </Link>
                        <p className="text-body-muted text-sm text-pretty leading-relaxed">
                            Your complete fitness ecosystem. Meals, coaching, gear and supplements — all in one place.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" aria-label="Instagram" className="size-9 rounded-lg bg-body-secondary flex items-center justify-center text-body-muted hover:text-body-accent hover:bg-body-accent/10 transition-colors">
                                <Instagram size={16} />
                            </a>
                            <a href="#" aria-label="Facebook" className="size-9 rounded-lg bg-body-secondary flex items-center justify-center text-body-muted hover:text-body-accent hover:bg-body-accent/10 transition-colors">
                                <Facebook size={16} />
                            </a>
                            <a href="#" aria-label="Twitter / X" className="size-9 rounded-lg bg-body-secondary flex items-center justify-center text-body-muted hover:text-body-accent hover:bg-body-accent/10 transition-colors">
                                <Twitter size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Shop — canonical category order */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-2.5 text-sm">
                            {CATEGORIES.map(cat => (
                                <li key={cat.label}>
                                    <Link
                                        to={cat.path}
                                        className="text-body-muted hover:text-white transition-colors"
                                    >
                                        {cat.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><a href="#" className="text-body-muted hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-body-muted hover:text-white transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="text-body-muted hover:text-white transition-colors">Returns & Refunds</a></li>
                            <li><Link to="/calculator" className="text-body-muted hover:text-white transition-colors">Calorie Calculator</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Stay Updated</h4>
                        <p className="text-body-muted text-sm mb-4 text-pretty">
                            Subscribe for 10% off your first order.
                        </p>
                        <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 bg-body-dark border border-body-border text-white placeholder-body-muted px-3 py-2 rounded-lg focus:outline-none focus:border-body-accent text-sm transition-colors"
                            />
                            <button
                                type="submit"
                                className="bg-body-accent text-black font-bold px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors text-sm cursor-pointer shrink-0"
                            >
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-body-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-body-muted">
                    <p>&copy; {new Date().getFullYear()} BodyBar. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link>
                        <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                            <MessageCircle size={14} />
                            <span>Need help? Chat with us</span>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
