import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-body-card pt-12 pb-8 border-t border-body-secondary mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="inline-block">
                            <img src="/images/FinalLogobrown.png" alt="BodyBar" className="h-10 w-auto brightness-0 invert hover:opacity-80 transition-opacity" />
                        </Link>
                        <p className="text-body-muted text-sm">
                            One stop shop for all your body needs. From meal plans to machines.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-body-muted hover:text-body-accent transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-body-muted hover:text-body-accent transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-body-muted hover:text-body-accent transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-body-muted">
                            <li><Link to="/diet-food" className="hover:text-white transition-colors">Diet Food</Link></li>
                            <li><Link to="/supplements" className="hover:text-white transition-colors">Supplements</Link></li>
                            <li><Link to="/gym-wear" className="hover:text-white transition-colors">Gym Wear</Link></li>
                            <li><Link to="/equipment" className="hover:text-white transition-colors">Equipment</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-body-muted">
                            <li><Link to="/coaching" className="hover:text-white transition-colors">Coaching</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
                        <p className="text-body-muted text-sm mb-4">
                            Subscribe for 10% off your first order.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-body-dark border border-body-secondary text-white px-3 py-2 rounded focus:outline-none focus:border-body-accent text-sm w-full"
                            />
                            <button className="bg-body-accent text-body-dark font-bold px-4 py-2 rounded hover:bg-opacity-90 transition-colors text-sm">
                                Join
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-body-secondary mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-body-muted">
                    <p>&copy; {new Date().getFullYear()} BodyBar. All rights reserved.</p>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <MessageCircle size={16} /> <span>Need help? Chat with us</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
