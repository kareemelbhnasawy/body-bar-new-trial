import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Clock, Settings, LogOut, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Mock user data
const user = {
    name: "Alex Fitness",
    email: "alex@example.com",
    joined: "January 2026",
    orders: [
        { id: "#ORD-001", date: "Mar 15, 2026", status: "Delivered", total: 145.00 },
        { id: "#ORD-002", date: "Feb 28, 2026", status: "Delivered", total: 89.50 },
    ]
};

export default function Profile() {
    const [activeTab, setActiveTab] = useState('orders');

    return (
        <div className="bg-body-dark min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-body-card border border-white/5 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
                    <div className="w-24 h-24 rounded-full bg-body-accent flex items-center justify-center text-body-dark text-3xl font-black">
                        {user.name.charAt(0)}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                        <p className="text-body-muted">{user.email} • Joined {user.joined}</p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white">
                        <Settings className="w-4 h-4 mr-2" /> Edit Profile
                    </Button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Nav */}
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'orders' ? 'bg-body-accent text-body-dark' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <ShoppingBag className="w-5 h-5" /> Order History
                        </button>
                        <button
                            onClick={() => setActiveTab('plans')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'plans' ? 'bg-body-accent text-body-dark' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Star className="w-5 h-5" /> My Plans
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-red-500 hover:bg-red-500/10 mt-8">
                            <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="md:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-body-card border border-white/5 rounded-3xl p-8 shadow-lg min-h-[400px]"
                        >
                            {activeTab === 'orders' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
                                    <div className="space-y-4">
                                        {user.orders.map(order => (
                                            <div key={order.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20 hover:border-body-accent/50 transition-colors">
                                                <div>
                                                    <p className="text-white font-bold">{order.id}</p>
                                                    <p className="text-sm text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {order.date}</p>
                                                </div>
                                                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" /> {order.status}
                                                    </span>
                                                    <span className="font-black text-white">${order.total.toFixed(2)}</span>
                                                    <Button variant="ghost" size="sm">View</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'plans' && (
                                <div className="text-center py-12">
                                    <Star className="w-16 h-16 text-body-accent mx-auto mb-4 opacity-50" />
                                    <h2 className="text-2xl font-bold text-white mb-2">No Active Plans</h2>
                                    <p className="text-gray-400 mb-6">You aren't subscribed to any coaching or meal plans yet.</p>
                                    <Button className="bg-body-accent text-body-dark">Explore Coaching</Button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
