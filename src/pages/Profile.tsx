import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Clock, Settings, LogOut, CheckCircle, Loader2, ChevronDown, ChevronUp, Package, X, Save, Heart, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { supabase } from '../lib/supabase';
import { Navigate, Link, useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user, isLoading, signOut } = useAuth();
    const { items: wishlistItems, toggle: toggleWishlist } = useWishlist();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [plans, setPlans] = useState<any[]>([]);

    // Expansion State
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [loadingOrderItems, setLoadingOrderItems] = useState(false);

    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState('');
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    useEffect(() => {
        async function fetchOrders() {
            if (!user || !supabase) return;
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (data) setOrders(data);
            } catch (e) {
                console.error("Error fetching orders:", e);
            } finally {
                setLoadingOrders(false);
            }
        }
        
        async function fetchPlans() {
            if (!user || !supabase) return;
            try {
                // Determine order IDs first for plan mapping
                const { data: oData } = await supabase.from('orders').select('id').eq('user_id', user.id);
                if (oData && oData.length > 0) {
                    const orderIds = oData.map(o => o.id);
                    const { data: itemsData } = await supabase.from('order_items').select('*').in('order_id', orderIds);
                    if (itemsData) {
                        const planItems = itemsData.filter(item => {
                            const n = item.product_name.toLowerCase();
                            return n.includes('plan') || n.includes('coaching') || n.includes('training') || n.includes('diet');
                        });
                        setPlans(planItems);
                    }
                }
            } catch (e) {
                console.error("Error fetching plans:", e);
            }
        }

        if (user) {
            fetchOrders();
            fetchPlans();
            setEditName(user.user_metadata?.full_name || '');
        }
    }, [user]);

    const toggleOrder = async (orderId: string) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
            return;
        }
        
        setExpandedOrderId(orderId);
        setLoadingOrderItems(true);
        
        try {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', orderId);
            
            if (data) setOrderItems(data);
        } catch (e) {
            console.error("Error fetching order items:", e);
        } finally {
            setLoadingOrderItems(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            if (!supabase) return;
            const { error } = await supabase.auth.updateUser({
                data: { full_name: editName }
            });
            if (!error) {
                setIsEditingProfile(false);
                window.location.reload(); // Quick refresh to update global auth context
            } else {
                console.error("Failed to update:", error);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-body-dark flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-body-accent animate-spin" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="bg-body-dark min-h-screen py-12 pt-24">
            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditingProfile && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-body-card border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
                        >
                            <button onClick={() => setIsEditingProfile(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                                    <input 
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-body-accent"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
                                    <input 
                                        value={user.email}
                                        disabled
                                        className="w-full bg-black/20 border border-white/5 rounded-lg p-3 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly.</p>
                                </div>
                                <Button type="submit" className="w-full bg-body-accent text-body-dark hover:bg-white mt-4 shadow-lg" disabled={isUpdatingProfile}>
                                    {isUpdatingProfile ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span className="flex items-center justify-center gap-2 font-bold"><Save className="w-4 h-4"/> Save Changes</span>}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-body-card border border-white/5 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
                    <div className="w-24 h-24 rounded-full bg-body-accent/20 border border-body-accent flex items-center justify-center text-body-accent text-3xl font-black shadow-[0_0_20px_rgba(255,100,42,0.2)]">
                        {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-white tracking-tight">{user.user_metadata?.full_name || 'Athlete'}</h1>
                        <p className="text-gray-400 font-medium">{user.email}</p>
                    </div>
                    <Button onClick={() => setIsEditingProfile(true)} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Settings className="w-4 h-4 mr-2" /> Edit Profile
                    </Button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Nav */}
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'orders' ? 'bg-body-accent text-body-dark shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <ShoppingBag className="w-5 h-5" /> Order History
                        </button>
                        <button
                            onClick={() => setActiveTab('plans')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'plans' ? 'bg-body-accent text-body-dark shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Star className="w-5 h-5" /> My Plans
                        </button>
                        <button
                            onClick={() => setActiveTab('wishlist')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'wishlist' ? 'bg-body-accent text-body-dark shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Heart className="w-5 h-5" /> Saved Items
                        </button>
                        <button
                            onClick={signOut}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-red-500 hover:bg-red-500/10 mt-8"
                        >
                            <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="md:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-body-card border border-white/5 rounded-3xl p-8 shadow-lg min-h-[400px]"
                            >
                                {activeTab === 'orders' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Order History</h2>
                                        {loadingOrders ? (
                                            <div className="flex justify-center py-12">
                                                <Loader2 className="w-8 h-8 text-body-accent animate-spin" />
                                            </div>
                                        ) : orders.length === 0 ? (
                                            <div className="text-center py-12 border border-white/5 rounded-2xl bg-black/20">
                                                <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                                <p className="text-gray-400 mb-4 font-medium">You have no previous orders.</p>
                                                <Link to="/supplements"><Button className="bg-body-accent text-body-dark font-bold text-sm">Start Shopping</Button></Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {orders.map(order => (
                                                    <div key={order.id} className="border border-white/10 rounded-xl overflow-hidden bg-black/20 hover:border-body-accent/30 transition-colors shadow-sm">
                                                        {/* Clickable Order Header */}
                                                        <div 
                                                            onClick={() => toggleOrder(order.id)}
                                                            className="flex flex-col sm:flex-row items-center justify-between p-5 cursor-pointer select-none"
                                                        >
                                                            <div className="flex-1 w-full text-center sm:text-left">
                                                                <div className="flex justify-between sm:justify-start items-center gap-4 w-full mb-1">
                                                                    <p className="text-white font-bold text-sm truncate">{order.id}</p>
                                                                    <div className="sm:hidden text-gray-400">
                                                                        {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-gray-400 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                                                                    <Clock className="w-3.5 h-3.5"/> {new Date(order.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-4 sm:mt-0">
                                                                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider">
                                                                    <CheckCircle className="w-3 h-3" /> {order.status}
                                                                </span>
                                                                <span className="font-black text-white text-lg">AED {Number(order.total_amount).toFixed(2)}</span>
                                                                <div className="hidden sm:block text-gray-400 ml-2">
                                                                    {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Expandable Order Items */}
                                                        <AnimatePresence>
                                                            {expandedOrderId === order.id && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    className="border-t border-white/10 bg-black/40 overflow-hidden"
                                                                >
                                                                    <div className="p-5 space-y-3">
                                                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                                                                            <Package className="w-4 h-4" /> Items in Order
                                                                        </h4>
                                                                        
                                                                        {loadingOrderItems ? (
                                                                            <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-body-accent" /></div>
                                                                        ) : orderItems.length === 0 ? (
                                                                            <p className="text-gray-500 text-sm italic">No items found for this order.</p>
                                                                        ) : (
                                                                            <div className="space-y-3">
                                                                                {orderItems.map(item => (
                                                                                    <div key={item.id} className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/5 border border-white/5 shadow-sm">
                                                                                        <div className="flex items-center gap-4">
                                                                                            <span className="bg-body-dark px-2.5 py-1 rounded text-gray-300 font-bold text-xs">{item.quantity}x</span>
                                                                                            <span className="text-white font-medium">{item.product_name}</span>
                                                                                        </div>
                                                                                        <span className="text-body-accent font-bold tracking-wide">AED {Number(item.price * item.quantity).toFixed(2)}</span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'plans' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Active Plans</h2>
                                        {plans.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Star className="w-16 h-16 text-body-accent mx-auto mb-4 opacity-50" />
                                                <h2 className="text-2xl font-bold text-white mb-2">No Active Plans</h2>
                                                <p className="text-gray-400 mb-6 font-medium">You aren't subscribed to any coaching or meal plans yet.</p>
                                                <Button onClick={() => navigate('/coaching')} className="bg-body-accent text-body-dark font-bold hover:bg-white transition-colors">Explore Coaching</Button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {plans.map((plan, idx) => (
                                                    <div key={idx} className="bg-black/20 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-body-accent/50 transition-colors">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-body-accent/10 rounded-full blur-2xl group-hover:bg-body-accent/20 transition-colors" />
                                                        <Star className="w-8 h-8 text-body-accent mb-4" />
                                                        <h3 className="font-bold text-white text-lg mb-2 relative z-10 leading-snug">{plan.product_name}</h3>
                                                        <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-xs font-black uppercase tracking-wider rounded-md relative z-10">
                                                            Active Subscription
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'wishlist' && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Saved Items</h2>
                                        {wishlistItems.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Heart className="w-16 h-16 text-body-accent mx-auto mb-4 opacity-50" />
                                                <h2 className="text-2xl font-bold text-white mb-2">No Saved Items</h2>
                                                <p className="text-gray-400 mb-6 font-medium">Tap the heart icon on any product to save it here.</p>
                                                <Button onClick={() => navigate('/supplements')} className="bg-body-accent text-body-dark font-bold hover:bg-white transition-colors">Shop Now</Button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {wishlistItems.map(item => (
                                                    <div key={item.product_id} className="flex items-center gap-4 bg-black/20 border border-white/10 rounded-2xl p-4 hover:border-body-accent/30 transition-colors group">
                                                        <Link to={`/product/${item.product_id}`} className="shrink-0">
                                                            <img
                                                                src={item.product_image || '/images/FinalLogobrown.png'}
                                                                alt={item.product_name}
                                                                className="size-16 rounded-xl object-cover bg-body-dark"
                                                            />
                                                        </Link>
                                                        <div className="flex-1 min-w-0">
                                                            <Link to={`/product/${item.product_id}`}>
                                                                <p className="text-white font-semibold text-sm line-clamp-2 hover:text-body-accent transition-colors text-pretty">{item.product_name}</p>
                                                            </Link>
                                                            <p className="text-body-accent font-bold text-sm mt-1 tabular-nums">AED {item.product_price.toFixed(0)}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => toggleWishlist({ product_id: item.product_id, product_name: item.product_name, product_price: item.product_price, product_image: item.product_image })}
                                                            aria-label="Remove from wishlist"
                                                            className="shrink-0 p-2 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
