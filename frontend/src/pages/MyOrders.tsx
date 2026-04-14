import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, PlayCircle, Loader2, X } from 'lucide-react';
import api from '../lib/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MyOrders: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refundModal, setRefundModal] = useState<{ isOpen: boolean, orderId: number, bookId: number, bookTitle: string } | null>(null);
    const [refundReason, setRefundReason] = useState('');
    const [submittingRefund, setSubmittingRefund] = useState(false);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/orders/user');
            setOrders(res.data);
        } catch { toast.error('Failed to load orders.'); } finally { setLoading(false); }
    };

    const handleRefundRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!refundModal) return;
        setSubmittingRefund(true);
        try {
            await api.post('/api/refunds/request', { order_id: refundModal.orderId, book_id: refundModal.bookId, reason: refundReason });
            toast.success('Refund request submitted!');
            setRefundModal(null);
            setRefundReason('');
        } catch (error: any) { toast.error(error.response?.data?.error || 'Failed.'); } finally { setSubmittingRefund(false); }
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={32}/></div>;

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
            <header className="mb-10">
                <div className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-2">Your Collection</div>
                <h1 className="text-4xl font-heading italic text-text">Order History</h1>
            </header>

            <div className="flex flex-col gap-6">
                {orders.length === 0 ? (
                    <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center">
                        <Package size={44} className="mx-auto mb-4 text-border" />
                        <p className="text-subtext text-lg mb-3">Nothing here yet.</p>
                        <Link to="/books" className="text-secondary font-bold text-sm hover:underline">Start your collection →</Link>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.id} className="bg-card border border-border rounded-2xl p-7">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
                                <div className="flex items-center gap-4">
                                    <div className="bg-surface border border-border p-3 rounded-xl text-secondary"><Package size={22}/></div>
                                    <div>
                                        <h3 className="font-bold text-lg text-text">Order #{order.id}</h3>
                                        <p className="text-xs text-subtext">{new Date(order.created_at).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${order.order_status === 'SUCCESS' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                        {order.order_status}
                                    </span>
                                    <span className="text-xl font-bold text-text">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between py-2 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                                            <div>
                                                <span className="font-bold text-text text-sm">{item.title}</span>
                                                <span className="text-xs text-subtext ml-2">×{item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link to={`/course/${item.book_id}`} className="px-3 py-1.5 bg-secondary/10 border border-secondary/20 text-secondary rounded-lg text-[10px] font-bold flex items-center gap-1">
                                                <PlayCircle size={12}/> Course
                                            </Link>
                                            <button onClick={() => setRefundModal({ isOpen: true, orderId: order.id, bookId: item.book_id, bookTitle: item.title })} className="px-3 py-1.5 bg-surface border border-border text-subtext rounded-lg text-[10px] font-bold flex items-center gap-1 hover:border-error/30 hover:text-error transition-all">
                                                <RefreshCw size={12}/> Return
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Refund Modal */}
            {refundModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                    <div className="bg-card border border-border w-full max-w-md rounded-2xl p-8 relative">
                        <button onClick={() => setRefundModal(null)} className="absolute top-4 right-4 p-2 text-subtext hover:text-error"><X size={16}/></button>
                        <div className="w-12 h-12 bg-error/10 border border-error/20 text-error rounded-xl flex items-center justify-center mb-5"><RefreshCw size={22}/></div>
                        <h2 className="text-xl font-heading italic text-text mb-2">Request Return</h2>
                        <p className="text-subtext text-xs mb-6">Returning <span className="text-text font-bold">"{refundModal.bookTitle}"</span></p>
                        <form onSubmit={handleRefundRequest} className="space-y-4">
                            <textarea required className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-secondary/40 h-28 resize-none" placeholder="Reason for return..." value={refundReason} onChange={e => setRefundReason(e.target.value)}></textarea>
                            <button type="submit" disabled={submittingRefund} className="w-full bg-error text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-error/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40">
                                {submittingRefund ? <Loader2 className="animate-spin" size={16}/> : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
