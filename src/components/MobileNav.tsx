import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export default function MobileNav() {
    const { setIsCartOpen, cartCount } = useCart();
    const navigate = useNavigate();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Shop', path: '/supplements', icon: Grid },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-body-dark/90 backdrop-blur-xl border-t border-white/10 pb-safe">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-full h-full space-y-1 relative ${
                                isActive ? 'text-body-accent' : 'text-gray-400 hover:text-white'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-nav-indicator"
                                        className="absolute top-0 w-8 h-1 bg-body-accent rounded-b-full shadow-[0_0_10px_rgba(255,100,42,0.5)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon size={22} className={isActive ? 'mt-1' : ''} />
                                <span className="text-[10px] font-medium">{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                <button
                    onClick={() => setIsCartOpen(true)}
                    className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-white relative"
                >
                    <div className="relative">
                        <ShoppingBag size={22} />
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1.5 -right-2 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-body-accent rounded-full border border-body-dark"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium">Cart</span>
                </button>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 relative ${
                            isActive ? 'text-body-accent' : 'text-gray-400 hover:text-white'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-indicator"
                                    className="absolute top-0 w-8 h-1 bg-body-accent rounded-b-full shadow-[0_0_10px_rgba(255,100,42,0.5)]"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <User size={22} className={isActive ? 'mt-1' : ''} />
                            <span className="text-[10px] font-medium">Profile</span>
                        </>
                    )}
                </NavLink>
            </div>
        </div>
    );
}
