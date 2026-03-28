import React from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Utensils, ShoppingBag, Dumbbell, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
    { label: 'Home',     path: '/',         icon: Home,      end: true  },
    { label: 'Meals',    path: '/diet-food', icon: Utensils,  end: false },
    { label: 'Training', path: '/coaching',  icon: Dumbbell,  end: false },
] as const;

export default function MobileNav() {
    const { setIsCartOpen, cartCount } = useCart();
    const navigate = useNavigate();

    return createPortal(
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-body-dark border-t border-body-border pb-safe">
            <div className="flex items-center justify-around h-16">
                {NAV_ITEMS.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-full h-full gap-1 relative transition-colors ${
                                isActive ? 'text-body-accent' : 'text-gray-400'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="mobile-tab-indicator"
                                        className="absolute top-0 w-10 h-0.5 bg-body-accent rounded-b-full"
                                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                    />
                                )}
                                <item.icon size={20} />
                                <span className="text-[10px] font-semibold">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Cart */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    aria-label={`Cart (${cartCount} items)`}
                    className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    <div className="relative">
                        <ShoppingBag size={20} />
                        {cartCount > 0 && (
                            <motion.span
                                key={cartCount}
                                initial={{ scale: 0.6 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1.5 -right-2 min-w-4 h-4 bg-body-accent text-black text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 tabular-nums"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </div>
                    <span className="text-[10px] font-semibold">Cart</span>
                </button>

                {/* Profile */}
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full gap-1 relative transition-colors ${
                            isActive ? 'text-body-accent' : 'text-gray-400'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-tab-indicator"
                                    className="absolute top-0 w-10 h-0.5 bg-body-accent rounded-b-full"
                                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                />
                            )}
                            <User size={20} />
                            <span className="text-[10px] font-semibold">Profile</span>
                        </>
                    )}
                </NavLink>
            </div>
        </div>,
        document.body
    );
}
