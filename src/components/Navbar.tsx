import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, X, Menu, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../lib/categories';

/** Smart search: match query to a category page */
function resolveSearchPath(q: string): string {
    const lower = q.toLowerCase();
    if (lower.includes('meal') || lower.includes('food') || lower.includes('diet') || lower.includes('nutrition') || lower.includes('plan')) return '/diet-food';
    if (lower.includes('coach') || lower.includes('train') || lower.includes('personal') || lower.includes('program')) return '/coaching';
    if (lower.includes('wear') || lower.includes('shirt') || lower.includes('hoodie') || lower.includes('sport') || lower.includes('apparel') || lower.includes('legging')) return '/gym-wear';
    if (lower.includes('supplement') || lower.includes('protein') || lower.includes('creatine') || lower.includes('vitamin') || lower.includes('amino')) return '/supplements';
    if (lower.includes('equipment') || lower.includes('machine') || lower.includes('dumbbell') || lower.includes('barbell')) return '/equipment';
    return '/supplements';
}

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const { setIsCartOpen, cartCount } = useCart();
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Focus search input when mobile search opens
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            navigate(`/search?q=${encodeURIComponent(q)}`);
            setSearchQuery('');
            setSearchOpen(false);
        }
    };

    return (
        <>
            {/* ── Top announcement strip ─────────────────────────── */}
            <div className="fixed top-0 left-0 right-0 z-51 bg-body-accent text-black text-[11px] font-semibold text-center py-1.5 hidden sm:block">
                Free delivery on orders over AED 250&nbsp;&nbsp;•&nbsp;&nbsp;New meal plans weekly&nbsp;&nbsp;•&nbsp;&nbsp;Certified coaches available now
            </div>

            {/* ── Row 1: Logo + Search + Icons ──────────────────── */}
            <nav className="fixed left-0 right-0 z-50 bg-body-dark/95 backdrop-blur-md border-b border-body-border top-0 sm:top-7">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 h-16">

                        {/* Logo */}
                        <Link to="/" className="shrink-0 mr-2">
                            <img
                                src="/images/FinalLogobrown.png"
                                alt="BodyBar"
                                className="h-8 w-auto brightness-0 invert hover:opacity-80 transition-opacity"
                            />
                        </Link>

                        {/* Search — desktop */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
                            <div className="relative w-full">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-body-muted pointer-events-none" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search meals, coaches, supplements..."
                                    className="w-full bg-body-card border border-body-border text-white placeholder-body-muted text-sm pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-body-accent transition-colors"
                                />
                            </div>
                        </form>

                        {/* Spacer on mobile */}
                        <div className="flex-1 md:hidden" />

                        {/* Icons row */}
                        <div className="flex items-center gap-1">
                            {/* Mobile search toggle */}
                            <button
                                onClick={() => setSearchOpen(v => !v)}
                                aria-label="Search"
                                className="md:hidden p-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <Search size={20} />
                            </button>

                            {/* Profile */}
                            <button
                                onClick={() => navigate('/profile')}
                                aria-label="My account"
                                className="p-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <User size={20} />
                            </button>

                            {/* Cart */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                aria-label={`Cart (${cartCount} items)`}
                                className="relative p-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <ShoppingBag size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 min-w-4.5 h-4.5 bg-body-accent text-black text-[10px] font-bold rounded-full flex items-center justify-center px-1 tabular-nums">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile hamburger */}
                            <button
                                onClick={() => setMobileOpen(v => !v)}
                                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                                className="md:hidden p-2.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile search bar (expanded) */}
                    {searchOpen && (
                        <form onSubmit={handleSearch} className="md:hidden pb-3">
                            <div className="relative">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-body-muted pointer-events-none" />
                                <input
                                    ref={searchInputRef}
                                    type="search"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search meals, coaches, supplements..."
                                    className="w-full bg-body-card border border-body-border text-white placeholder-body-muted text-sm pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-body-accent"
                                />
                            </div>
                        </form>
                    )}
                </div>

                {/* ── Row 2: Category strip — desktop only ────────── */}
                <div className="hidden md:block bg-body-card border-t border-body-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-1 h-11 overflow-x-auto scrollbar-hide">
                            {CATEGORIES.map(cat => (
                                <NavLink
                                    key={cat.label}
                                    to={cat.path}
                                    className={({ isActive }) =>
                                        clsx(
                                            'flex items-center gap-1.5 px-4 h-full text-sm font-semibold whitespace-nowrap transition-colors duration-150 border-b-2 cursor-pointer',
                                            isActive
                                                ? 'text-body-accent border-body-accent'
                                                : 'text-gray-400 hover:text-white border-transparent hover:border-white/20'
                                        )
                                    }
                                >
                                    <cat.icon size={14} />
                                    {cat.label}
                                </NavLink>
                            ))}
                            <NavLink
                                to="/calculator"
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-1.5 px-4 h-full text-sm font-semibold whitespace-nowrap transition-colors duration-150 border-b-2 cursor-pointer ml-auto',
                                        isActive
                                            ? 'text-body-accent border-body-accent'
                                            : 'text-gray-400 hover:text-white border-transparent hover:border-white/20'
                                    )
                                }
                            >
                                Calculator
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── Mobile slide-down menu ─────────────────────────── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    {/* Panel */}
                    <div className="absolute top-16 left-0 right-0 bg-body-card border-b border-body-border shadow-2xl">
                        <nav className="px-4 py-4 space-y-1">
                            {CATEGORIES.map(cat => (
                                <NavLink
                                    key={cat.label}
                                    to={cat.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        clsx(
                                            'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-150',
                                            isActive
                                                ? 'bg-body-accent/10 text-body-accent'
                                                : 'text-gray-300 hover:bg-body-secondary hover:text-white'
                                        )
                                    }
                                >
                                    <cat.icon size={18} />
                                    {cat.label}
                                </NavLink>
                            ))}
                            <NavLink
                                to="/calculator"
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-150',
                                        isActive
                                            ? 'bg-body-accent/10 text-body-accent'
                                            : 'text-gray-300 hover:bg-body-secondary hover:text-white'
                                    )
                                }
                            >
                                Calculator
                            </NavLink>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
