import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
    { name: 'Coaching', path: '/coaching' },
    { name: 'Diet Food', path: '/diet-food' },
    { name: 'Supplements', path: '/supplements' },
    { name: 'Gym Wear', path: '/gym-wear' },
    { name: 'Equipment', path: '/equipment' },
    { name: 'Calculator', path: '/calculator' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 bg-body-dark/80 backdrop-blur-md border-b border-body-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                            <img src="/images/FinalLogobrown.png" alt="BodyBar" className="h-8 w-auto brightness-0 invert hover:opacity-80 transition-opacity" />
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        clsx(
                                            'px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200',
                                            isActive
                                                ? 'text-body-accent'
                                                : 'text-gray-300 hover:text-white hover:bg-body-secondary'
                                        )
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="text-gray-300 hover:text-white p-2">
                            <User size={20} />
                        </button>
                        <button className="text-gray-300 hover:text-white p-2 relative">
                            <ShoppingBag size={20} />
                            {/* Cart badge placement would go here */}
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-body-secondary focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-body-card border-b border-body-secondary">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    clsx(
                                        'block px-3 py-2 rounded-md text-base font-medium',
                                        isActive
                                            ? 'text-body-accent bg-body-secondary'
                                            : 'text-gray-300 hover:text-white hover:bg-body-secondary'
                                    )
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
