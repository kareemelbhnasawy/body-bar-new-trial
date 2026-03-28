import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import MobileNav from '../components/MobileNav';
import { NewsletterModal } from '../components/ui/NewsletterModal';

/**
 * Navbar height breakdown:
 *  - Mobile:  announcement (hidden) + row1 (64px) = 64px  → pt-16
 *  - Desktop: announcement (28px)   + row1 (64px) + row2 (44px) = 136px → pt-[136px]
 */
export default function Layout() {
    return (
        <div className="min-h-dvh bg-body-dark flex flex-col font-sans relative pb-16 md:pb-0">
            <Navbar />
            <main className="grow pt-16 sm:pt-34">
                <Outlet />
            </main>
            <Footer />
            <CartDrawer />
            <MobileNav />
            <NewsletterModal />
        </div>
    );
}
