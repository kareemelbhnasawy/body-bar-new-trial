import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import MobileNav from '../components/MobileNav';
import { NewsletterModal } from '../components/ui/NewsletterModal';

export default function Layout() {
    return (
        <div className="min-h-screen bg-body-dark flex flex-col font-sans relative md:pb-0 pb-16">
            <Navbar />
            <main className="flex-grow pt-16">
                <Outlet />
            </main>
            <Footer />
            <CartDrawer />
            <MobileNav />
            <NewsletterModal />
        </div>
    );
}
