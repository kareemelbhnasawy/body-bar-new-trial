import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, ShoppingBag, Users, LogOut, TrendingUp,
    Search, ChevronDown, ChevronUp, RefreshCw, CheckCircle,
    Clock, XCircle, Package, DollarSign, Eye, X, ArrowUpRight,
    Filter, AlertCircle, Home,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Stats {
    totalRevenue: number;
    paidOrders: number;
    pendingOrders: number;
    totalOrders: number;
    totalCustomers: number;
    revenueToday: number;
    revenueWeek: number;
}

interface DayRevenue { day: string; revenue: number; label: string }

interface OrderItem { product_name: string; quantity: number; price: number }

interface Order {
    id: string;
    total_amount: number;
    status: string;
    payment_method: string;
    guest_email: string | null;
    guest_name: string | null;
    guest_phone: string | null;
    shipping_address: string | null;
    user_id: string | null;
    created_at: string;
    items?: OrderItem[];
}

interface Customer {
    identifier: string;
    name: string | null;
    type: 'registered' | 'guest';
    order_count: number;
    total_spent: number;
    last_order: string;
}

type Tab = 'overview' | 'orders' | 'customers';
type OrderStatus = 'all' | 'paid' | 'pending' | 'cancelled';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    paid:      { label: 'Paid',      color: 'text-green-400 bg-green-400/10 border-green-400/30',   icon: <CheckCircle size={12} /> },
    pending:   { label: 'Pending',   color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: <Clock size={12} /> },
    cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/30',          icon: <XCircle size={12} /> },
};

const PM_LABEL: Record<string, string> = {
    stripe: 'Online', cash_on_delivery: 'COD',
};

function fmt(amount: number) {
    return `AED ${amount.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, accent }: {
    label: string; value: string; sub?: string; icon: React.ReactNode; accent?: boolean;
}) {
    return (
        <div className={`bg-body-card border rounded-2xl p-5 flex flex-col gap-3 ${accent ? 'border-body-accent/40' : 'border-body-border'}`}>
            <div className="flex items-center justify-between">
                <span className="text-body-muted text-xs font-bold uppercase tracking-wider">{label}</span>
                <span className={`size-9 rounded-xl flex items-center justify-center ${accent ? 'bg-body-accent text-black' : 'bg-white/5 text-gray-400'}`}>
                    {icon}
                </span>
            </div>
            <div>
                <p className="text-white font-black text-2xl tracking-tight">{value}</p>
                {sub && <p className="text-body-muted text-xs mt-1">{sub}</p>}
            </div>
        </div>
    );
}

function MiniBarChart({ data, max }: { data: DayRevenue[]; max: number }) {
    return (
        <div className="flex items-end gap-1.5 h-24">
            {data.map((d, i) => {
                const pct = max > 0 ? (d.revenue / max) * 100 : 0;
                return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-body-secondary border border-body-border rounded-lg px-2 py-1 text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            {fmt(d.revenue)}
                        </div>
                        <div className="w-full rounded-t-md bg-body-accent/20 flex items-end" style={{ height: '80px' }}>
                            <motion.div
                                className="w-full rounded-t-md bg-body-accent"
                                initial={{ height: 0 }}
                                animate={{ height: `${pct}%` }}
                                transition={{ duration: 0.6, delay: i * 0.05 }}
                            />
                        </div>
                        <span className="text-[9px] text-body-muted">{d.label}</span>
                    </div>
                );
            })}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold ${cfg.color}`}>
            {cfg.icon} {cfg.label}
        </span>
    );
}

function OrderRow({ order, onStatusChange }: { order: Order; onStatusChange: (id: string, status: string) => void }) {
    const [expanded, setExpanded] = useState(false);
    const [updating, setUpdating] = useState(false);
    const addr = order.shipping_address ? JSON.parse(order.shipping_address) : null;

    const handleStatus = async (newStatus: string) => {
        setUpdating(true);
        await onStatusChange(order.id, newStatus);
        setUpdating(false);
    };

    return (
        <>
            <tr className="border-b border-body-border hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                    <span className="font-mono text-xs text-body-accent">{order.id.slice(0, 8).toUpperCase()}</span>
                </td>
                <td className="px-4 py-3">
                    <div className="text-sm text-white font-medium">{order.guest_name ?? 'Registered User'}</div>
                    <div className="text-xs text-body-muted">{order.guest_email ?? '—'}</div>
                </td>
                <td className="px-4 py-3 text-white font-bold text-sm">{fmt(order.total_amount)}</td>
                <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-4 py-3">
                    <span className="text-xs text-body-muted">{PM_LABEL[order.payment_method] ?? order.payment_method}</span>
                </td>
                <td className="px-4 py-3 text-xs text-body-muted">{fmtDate(order.created_at)}</td>
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        {order.status === 'pending' && (
                            <button
                                onClick={() => handleStatus('paid')}
                                disabled={updating}
                                className="text-[11px] bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Mark Paid
                            </button>
                        )}
                        {order.status !== 'cancelled' && (
                            <button
                                onClick={() => handleStatus('cancelled')}
                                disabled={updating}
                                className="text-[11px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={() => setExpanded(e => !e)}
                            className="text-body-muted hover:text-white transition-colors cursor-pointer"
                        >
                            {expanded ? <ChevronUp size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </td>
            </tr>
            <AnimatePresence>
                {expanded && (
                    <tr>
                        <td colSpan={7} className="bg-body-secondary/50">
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="px-6 py-4 overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-body-muted uppercase tracking-wider mb-3">Items</p>
                                        <div className="space-y-2">
                                            {(order.items ?? []).map((item, i) => (
                                                <div key={i} className="flex justify-between text-sm">
                                                    <span className="text-gray-300">{item.product_name} <span className="text-body-muted">×{item.quantity}</span></span>
                                                    <span className="text-white font-bold">{fmt(item.price * item.quantity)}</span>
                                                </div>
                                            ))}
                                            {(!order.items || order.items.length === 0) && (
                                                <p className="text-body-muted text-sm">No items recorded</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-body-muted uppercase tracking-wider mb-3">Delivery Details</p>
                                        {addr ? (
                                            <div className="text-sm space-y-1">
                                                {addr.address && <p className="text-gray-300">{addr.address}</p>}
                                                {addr.city && <p className="text-gray-300">{addr.city}{addr.zip ? `, ${addr.zip}` : ''}</p>}
                                            </div>
                                        ) : <p className="text-body-muted text-sm">No address recorded</p>}
                                        {order.guest_phone && <p className="text-gray-300 text-sm mt-2">📞 {order.guest_phone}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>
        </>
    );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────

export default function Admin() {
    const [password, setPassword] = useState('');
    const [authUser, setAuthUser] = useState<any>(null);
    const [isAdmin,       setIsAdmin]       = useState(false);
    const [isAdminLoading, setIsAdminLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [loginError,  setLoginError]  = useState('');
    const [loggingIn,   setLoggingIn]   = useState(false);

    const [tab,     setTab]     = useState<Tab>('overview');
    const [loading, setLoading] = useState(false);

    const [stats,      setStats]      = useState<Stats | null>(null);
    const [chartData,  setChartData]  = useState<DayRevenue[]>([]);
    const [orders,     setOrders]     = useState<Order[]>([]);
    const [customers,  setCustomers]  = useState<Customer[]>([]);
    const [topProducts, setTopProducts] = useState<{ name: string; revenue: number; qty: number }[]>([]);

    const [orderSearch,  setOrderSearch]  = useState('');
    const [orderStatus,  setOrderStatus]  = useState<OrderStatus>('all');
    const [customerSearch, setCustomerSearch] = useState('');

    // ── Auth ──────────────────────────────────────────────────────────────────

    useEffect(() => {
        supabase?.auth.getUser().then(({ data }) => {
            setAuthUser(data.user ?? null);
            setAuthLoading(false);
        });
        const { data: sub } = supabase?.auth.onAuthStateChange((_e, session) => {
            setAuthUser(session?.user ?? null);
        }) ?? { data: null };
        return () => sub?.subscription.unsubscribe();
    }, []);

    const ADMIN_EMAIL = 'admin@bodybar.ae';

    useEffect(() => {
        setIsAdmin(!!authUser && authUser.email === ADMIN_EMAIL);
        setIsAdminLoading(false);
    }, [authUser]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return;
        setLoggingIn(true);
        setLoginError('');
        const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
        if (error) setLoginError('Incorrect password.');
        setLoggingIn(false);
    };

    const handleLogout = () => supabase?.auth.signOut();

    // ── Data fetching ─────────────────────────────────────────────────────────

    const fetchStats = useCallback(async () => {
        if (!supabase) return;

        const [{ data: ordersData }, { data: itemsData }] = await Promise.all([
            supabase.from('orders').select('id, total_amount, status, payment_method, guest_email, guest_name, guest_phone, shipping_address, user_id, created_at'),
            supabase.from('order_items').select('order_id, product_name, quantity, price'),
        ]);

        if (!ordersData) return;

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekStart  = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const paid = ordersData.filter(o => o.status === 'paid');
        const statsObj: Stats = {
            totalRevenue:   paid.reduce((s, o) => s + Number(o.total_amount), 0),
            paidOrders:     ordersData.filter(o => o.status === 'paid').length,
            pendingOrders:  ordersData.filter(o => o.status === 'pending').length,
            totalOrders:    ordersData.length,
            totalCustomers: new Set(ordersData.map(o => o.guest_email ?? o.user_id ?? '')).size,
            revenueToday:   paid.filter(o => o.created_at >= todayStart).reduce((s, o) => s + Number(o.total_amount), 0),
            revenueWeek:    paid.filter(o => o.created_at >= weekStart).reduce((s, o) => s + Number(o.total_amount), 0),
        };
        setStats(statsObj);

        // Chart: last 7 days
        const days: DayRevenue[] = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(now.getTime() - (6 - i) * 86400000);
            const label = d.toLocaleDateString('en-AE', { weekday: 'short' });
            const dayStr = d.toISOString().slice(0, 10);
            const revenue = paid
                .filter(o => o.created_at.slice(0, 10) === dayStr)
                .reduce((s, o) => s + Number(o.total_amount), 0);
            return { day: dayStr, revenue, label };
        });
        setChartData(days);

        // Attach items to orders
        const itemsByOrder: Record<string, OrderItem[]> = {};
        (itemsData ?? []).forEach(item => {
            if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
            itemsByOrder[item.order_id].push(item);
        });
        const ordersWithItems = ordersData.map(o => ({ ...o, items: itemsByOrder[o.id] ?? [] }));
        setOrders(ordersWithItems);

        // Top products
        const productMap: Record<string, { qty: number; revenue: number }> = {};
        (itemsData ?? []).forEach(item => {
            if (!productMap[item.product_name]) productMap[item.product_name] = { qty: 0, revenue: 0 };
            productMap[item.product_name].qty += item.quantity;
            productMap[item.product_name].revenue += item.quantity * Number(item.price);
        });
        setTopProducts(
            Object.entries(productMap)
                .map(([name, v]) => ({ name, ...v }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
        );

        // Customers
        const custMap: Record<string, Customer> = {};
        ordersData.forEach(o => {
            const key = o.guest_email ?? o.user_id ?? 'unknown';
            if (!custMap[key]) {
                custMap[key] = {
                    identifier: key,
                    name: o.guest_name ?? null,
                    type: o.guest_email ? 'guest' : 'registered',
                    order_count: 0,
                    total_spent: 0,
                    last_order: o.created_at,
                };
            }
            custMap[key].order_count++;
            custMap[key].total_spent += Number(o.total_amount);
            if (o.created_at > custMap[key].last_order) custMap[key].last_order = o.created_at;
        });
        setCustomers(Object.values(custMap).sort((a, b) => b.total_spent - a.total_spent));
    }, []);

    useEffect(() => {
        if (!isAdmin) return;
        setLoading(true);
        fetchStats().finally(() => setLoading(false));
    }, [isAdmin, fetchStats]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        if (!supabase) return;
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setStats(prev => {
            if (!prev) return prev;
            const order = orders.find(o => o.id === orderId);
            if (!order) return prev;
            const wasP = order.status === 'paid', nowP = newStatus === 'paid';
            return {
                ...prev,
                paidOrders:    prev.paidOrders    + (nowP ? 1 : wasP ? -1 : 0),
                pendingOrders: prev.pendingOrders + (newStatus === 'pending' ? 1 : order.status === 'pending' ? -1 : 0),
                totalRevenue:  prev.totalRevenue  + (nowP ? Number(order.total_amount) : wasP ? -Number(order.total_amount) : 0),
            };
        });
    };

    // ── Filtered lists ────────────────────────────────────────────────────────

    const filteredOrders = orders.filter(o => {
        const q = orderSearch.toLowerCase();
        const matchQ = !q || o.id.toLowerCase().includes(q) ||
            (o.guest_name ?? '').toLowerCase().includes(q) ||
            (o.guest_email ?? '').toLowerCase().includes(q);
        const matchS = orderStatus === 'all' || o.status === orderStatus;
        return matchQ && matchS;
    });

    const filteredCustomers = customers.filter(c => {
        const q = customerSearch.toLowerCase();
        return !q || c.identifier.toLowerCase().includes(q) || (c.name ?? '').toLowerCase().includes(q);
    });

    const chartMax = Math.max(...chartData.map(d => d.revenue), 1);

    // ── Login screen ──────────────────────────────────────────────────────────

    if (authLoading || isAdminLoading) {
        return (
            <div className="bg-body-dark min-h-dvh flex items-center justify-center">
                <RefreshCw className="text-body-accent animate-spin" size={32} />
            </div>
        );
    }

    if (!authUser || !isAdmin) {
        return (
            <div className="bg-body-dark min-h-dvh flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex size-14 rounded-2xl bg-body-accent items-center justify-center mb-4">
                            <LayoutDashboard size={26} className="text-black" />
                        </div>
                        <h1 className="font-display text-3xl font-black uppercase text-white tracking-tight">Admin</h1>
                        <p className="text-body-muted text-sm mt-1">Body Bar Dashboard</p>
                    </div>
                    <form onSubmit={handleLogin} className="bg-body-card border border-body-border rounded-2xl p-6 space-y-4">
                        {authUser && !isAdmin && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                                <AlertCircle size={16} /> Not authorized as admin.
                                <button type="button" onClick={handleLogout} className="ml-auto underline cursor-pointer">Sign out</button>
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-body-muted uppercase tracking-wider mb-1.5">Password</label>
                            <input
                                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                className="w-full bg-body-secondary border border-body-border text-white placeholder-body-muted text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-body-accent"
                                placeholder="••••••••"
                            />
                        </div>
                        {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
                        <button
                            type="submit" disabled={loggingIn}
                            className="w-full bg-body-accent hover:bg-orange-500 text-black font-black text-sm py-3 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                        >
                            {loggingIn ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>
                    <Link to="/" className="mt-4 flex items-center justify-center gap-1.5 text-body-muted hover:text-white text-sm transition-colors">
                        <Home size={14} /> Back to website
                    </Link>
                </motion.div>
            </div>
        );
    }

    // ── Dashboard ─────────────────────────────────────────────────────────────

    return (
        <div className="bg-body-dark min-h-dvh flex">

            {/* Sidebar */}
            <aside className="hidden md:flex w-56 shrink-0 flex-col bg-body-card border-r border-body-border">
                <div className="p-5 border-b border-body-border">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-body-accent flex items-center justify-center">
                            <LayoutDashboard size={16} className="text-black" />
                        </div>
                        <div>
                            <p className="text-white font-black text-sm uppercase tracking-tight">Body Bar</p>
                            <p className="text-body-muted text-[10px]">Admin</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                    {([
                        { id: 'overview',   label: 'Overview',   icon: <TrendingUp size={16} /> },
                        { id: 'orders',     label: 'Orders',     icon: <ShoppingBag size={16} />, badge: stats?.pendingOrders },
                        { id: 'customers',  label: 'Customers',  icon: <Users size={16} /> },
                    ] as { id: Tab; label: string; icon: React.ReactNode; badge?: number }[]).map(item => (
                        <button
                            key={item.id}
                            onClick={() => setTab(item.id)}
                            className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                                tab === item.id
                                    ? 'bg-body-accent text-black'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <span className="flex items-center gap-2.5">{item.icon} {item.label}</span>
                            {item.badge != null && item.badge > 0 && (
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${tab === item.id ? 'bg-black/20 text-black' : 'bg-yellow-400/20 text-yellow-400'}`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
                <div className="p-3 border-t border-body-border">
                    <div className="px-3 py-2 mb-1">
                        <p className="text-white text-xs font-bold truncate">{authUser.email}</p>
                        <p className="text-body-muted text-[10px]">Administrator</p>
                    </div>
                    <Link
                        to="/"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <Home size={16} /> Back to website
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
                    >
                        <LogOut size={16} /> Sign out
                    </button>
                </div>
            </aside>

            {/* Mobile header */}
            <div className="md:hidden fixed top-0 inset-x-0 z-50 bg-body-card border-b border-body-border px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-body-accent flex items-center justify-center">
                        <LayoutDashboard size={13} className="text-black" />
                    </div>
                    <span className="text-white font-black text-sm uppercase">Admin</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-body-muted hover:text-white transition-colors">
                        <Home size={18} />
                    </Link>
                    <button onClick={handleLogout} className="text-body-muted hover:text-red-400 transition-colors cursor-pointer">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            {/* Mobile bottom nav */}
            <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-body-card border-t border-body-border flex">
                {([
                    { id: 'overview', label: 'Overview', icon: <TrendingUp size={18} /> },
                    { id: 'orders',   label: 'Orders',   icon: <ShoppingBag size={18} /> },
                    { id: 'customers',label: 'Customers',icon: <Users size={18} /> },
                ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(item => (
                    <button
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-bold transition-colors cursor-pointer ${
                            tab === item.id ? 'text-body-accent' : 'text-body-muted'
                        }`}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-auto pt-14 md:pt-0 pb-20 md:pb-0">
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8">

                    {/* Header row */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="font-display text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
                                {tab === 'overview' ? 'Overview' : tab === 'orders' ? 'Orders' : 'Customers'}
                            </h1>
                            <p className="text-body-muted text-sm mt-0.5">
                                {tab === 'overview' ? 'Revenue & performance at a glance' :
                                 tab === 'orders'   ? `${filteredOrders.length} orders` :
                                 `${filteredCustomers.length} customers`}
                            </p>
                        </div>
                        <button
                            onClick={() => { setLoading(true); fetchStats().finally(() => setLoading(false)); }}
                            className="flex items-center gap-2 text-sm text-body-muted hover:text-white bg-body-card border border-body-border px-3 py-2 rounded-xl transition-colors cursor-pointer"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>

                    {/* ── OVERVIEW ── */}
                    {tab === 'overview' && (
                        <div className="space-y-6">
                            {/* KPI cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard accent label="Total Revenue" value={fmt(stats?.totalRevenue ?? 0)} sub={`${fmt(stats?.revenueWeek ?? 0)} this week`} icon={<DollarSign size={18} />} />
                                <StatCard label="Total Orders" value={String(stats?.totalOrders ?? 0)} sub={`${stats?.pendingOrders ?? 0} pending`} icon={<ShoppingBag size={18} />} />
                                <StatCard label="Paid Orders" value={String(stats?.paidOrders ?? 0)} sub={`${fmt(stats?.revenueToday ?? 0)} today`} icon={<CheckCircle size={18} />} />
                                <StatCard label="Customers" value={String(stats?.totalCustomers ?? 0)} sub="unique buyers" icon={<Users size={18} />} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Revenue chart */}
                                <div className="lg:col-span-2 bg-body-card border border-body-border rounded-2xl p-5">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="text-white font-bold text-sm">Revenue — Last 7 Days</h3>
                                            <p className="text-body-muted text-xs mt-0.5">{fmt(stats?.revenueWeek ?? 0)} total</p>
                                        </div>
                                        <ArrowUpRight size={16} className="text-body-accent" />
                                    </div>
                                    <MiniBarChart data={chartData} max={chartMax} />
                                </div>

                                {/* Top products */}
                                <div className="bg-body-card border border-body-border rounded-2xl p-5">
                                    <h3 className="text-white font-bold text-sm mb-4">Top Products</h3>
                                    {topProducts.length === 0
                                        ? <p className="text-body-muted text-sm">No data yet</p>
                                        : (
                                        <div className="space-y-3">
                                            {topProducts.map((p, i) => {
                                                const pct = (p.revenue / topProducts[0].revenue) * 100;
                                                return (
                                                    <div key={i}>
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-gray-300 truncate max-w-[60%]">{p.name}</span>
                                                            <span className="text-white font-bold">{fmt(p.revenue)}</span>
                                                        </div>
                                                        <div className="h-1.5 bg-white/5 rounded-full">
                                                            <div className="h-full bg-body-accent rounded-full" style={{ width: `${pct}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order status breakdown */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Paid',      count: stats?.paidOrders ?? 0,    color: 'bg-green-400' },
                                    { label: 'Pending',   count: stats?.pendingOrders ?? 0, color: 'bg-yellow-400' },
                                    { label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length, color: 'bg-red-400' },
                                ].map(s => (
                                    <div key={s.label} className="bg-body-card border border-body-border rounded-2xl p-4 text-center">
                                        <div className={`size-2.5 rounded-full ${s.color} mx-auto mb-2`} />
                                        <p className="text-white font-black text-xl">{s.count}</p>
                                        <p className="text-body-muted text-xs">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Recent orders */}
                            <div className="bg-body-card border border-body-border rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-white font-bold text-sm">Recent Orders</h3>
                                    <button onClick={() => setTab('orders')} className="text-body-accent text-xs font-bold hover:underline cursor-pointer">View all</button>
                                </div>
                                <div className="space-y-2">
                                    {orders.slice(0, 5).map(o => (
                                        <div key={o.id} className="flex items-center justify-between py-2 border-b border-body-border last:border-0">
                                            <div>
                                                <p className="text-white text-sm font-medium">{o.guest_name ?? 'Registered User'}</p>
                                                <p className="text-body-muted text-xs font-mono">{o.id.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-bold text-sm">{fmt(o.total_amount)}</p>
                                                <StatusBadge status={o.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── ORDERS ── */}
                    {tab === 'orders' && (
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-body-muted" />
                                    <input
                                        value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                                        placeholder="Search by name, email, order ID…"
                                        className="w-full bg-body-card border border-body-border text-white placeholder-body-muted text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-body-accent"
                                    />
                                    {orderSearch && (
                                        <button onClick={() => setOrderSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-body-muted hover:text-white cursor-pointer">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {(['all', 'paid', 'pending', 'cancelled'] as OrderStatus[]).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setOrderStatus(s)}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer capitalize border ${
                                                orderStatus === s
                                                    ? 'bg-body-accent border-body-accent text-black'
                                                    : 'bg-body-card border-body-border text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            {s === 'all' ? `All (${orders.length})` : s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-body-card border border-body-border rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[700px]">
                                        <thead>
                                            <tr className="border-b border-body-border">
                                                {['Order ID', 'Customer', 'Amount', 'Status', 'Payment', 'Date', 'Actions'].map(h => (
                                                    <th key={h} className="px-4 py-3 text-xs font-bold text-body-muted uppercase tracking-wider">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.length === 0 ? (
                                                <tr><td colSpan={7} className="px-4 py-8 text-center text-body-muted text-sm">No orders found</td></tr>
                                            ) : filteredOrders.map(o => (
                                                <OrderRow key={o.id} order={o} onStatusChange={handleStatusChange} />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── CUSTOMERS ── */}
                    {tab === 'customers' && (
                        <div className="space-y-4">
                            <div className="relative max-w-sm">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-body-muted" />
                                <input
                                    value={customerSearch} onChange={e => setCustomerSearch(e.target.value)}
                                    placeholder="Search customers…"
                                    className="w-full bg-body-card border border-body-border text-white placeholder-body-muted text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-body-accent"
                                />
                            </div>
                            <div className="bg-body-card border border-body-border rounded-2xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[500px]">
                                        <thead>
                                            <tr className="border-b border-body-border">
                                                {['Customer', 'Type', 'Orders', 'Total Spent', 'Last Order'].map(h => (
                                                    <th key={h} className="px-4 py-3 text-xs font-bold text-body-muted uppercase tracking-wider">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCustomers.length === 0 ? (
                                                <tr><td colSpan={5} className="px-4 py-8 text-center text-body-muted text-sm">No customers found</td></tr>
                                            ) : filteredCustomers.map((c, i) => (
                                                <tr key={i} className="border-b border-body-border hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-4 py-3">
                                                        <p className="text-white text-sm font-medium">{c.name ?? '—'}</p>
                                                        <p className="text-body-muted text-xs">{c.identifier}</p>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                                            c.type === 'guest'
                                                                ? 'text-blue-400 bg-blue-400/10 border-blue-400/30'
                                                                : 'text-purple-400 bg-purple-400/10 border-purple-400/30'
                                                        }`}>
                                                            {c.type === 'guest' ? 'Guest' : 'Registered'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-white font-bold text-sm">{c.order_count}</td>
                                                    <td className="px-4 py-3 text-white font-bold text-sm">{fmt(c.total_spent)}</td>
                                                    <td className="px-4 py-3 text-body-muted text-xs">{fmtDate(c.last_order)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
