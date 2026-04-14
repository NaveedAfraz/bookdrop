import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Tag, ShoppingBag, ArrowRight, Loader2, Minus, Plus } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const Cart: React.FC = () => {
    // const navigate = useNavigate();
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await api.get('/api/cart');
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId: number) => {
        try {
            await api.delete(`/api/cart/remove/${itemId}`);
            toast.success('Removed from bag');
            fetchCart();
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    const updateQuantity = async (_id: number, _delta: number) => {
        // Implementation for quantity update if backend supports it, 
        // for now just a UI placeholder or silent fail
        toast.error('Quantity adjustments coming soon');
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={32}/></div>;

    const cartItems = cart?.items || [];
    const total = cart?.total || 0;

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
            <header className="mb-12">
                <div className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-2">Checkout Flow</div>
                <h1 className="text-4xl font-heading italic text-text">Your Bag</h1>
            </header>
            
            {cartItems.length > 0 ? (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <div className="bg-card border border-border rounded-3xl overflow-hidden divide-y divide-border">
                            {cartItems.map((item: any) => (
                                <div key={item.id} className="p-8 flex flex-col sm:flex-row items-center gap-8 group hover:bg-surface/30 transition-colors">
                                    <div className="w-24 h-36 bg-surface border border-border rounded-xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                        <img src={item.cover_image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                            <h3 className="font-heading italic text-2xl text-text truncate">{item.title}</h3>
                                            {item.is_second_hand && (
                                                <span className="bg-secondary/10 border border-secondary/20 text-secondary text-[9px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 w-fit uppercase tracking-widest mx-auto sm:mx-0">
                                                    <Tag size={10}/> Pre-owned
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-subtext mb-4 italic">by {item.author}</p>
                                        
                                        <div className="flex items-center justify-center sm:justify-start gap-6">
                                            <div className="font-bold text-xl text-secondary">${item.price}</div>
                                            <div className="flex items-center border border-border rounded-xl bg-surface overflow-hidden">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-border/30 text-subtext disabled:opacity-20" disabled={item.is_second_hand}><Minus size={14}/></button>
                                                <span className="px-3 font-bold text-text text-sm">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-border/30 text-subtext disabled:opacity-20" disabled={item.is_second_hand}><Plus size={14}/></button>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="p-3 text-subtext hover:text-error hover:bg-error/10 border border-transparent hover:border-error/20 rounded-2xl transition-all opacity-0 group-hover:opacity-100">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="bg-card border border-border p-8 rounded-3xl sticky top-24 shadow-xl">
                            <h2 className="text-xl font-heading italic text-text mb-8">Summary</h2>
                            <div className="space-y-4 text-sm mb-8">
                                <div className="flex justify-between text-subtext">
                                    <span>Subtotal</span>
                                    <span className="text-text font-bold">₹{Number(total).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-subtext">
                                    <span>Shipping</span>
                                    <span className="text-secondary font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
                                </div>
                                <div className="divider-glow h-px w-full my-4"></div>
                                <div className="flex justify-between items-center text-xl">
                                    <span className="font-heading italic text-text">Total</span>
                                    <span className="font-bold text-text text-glow-blue">₹{Number(total).toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <Link to="/checkout" className="w-full bg-secondary text-primary py-4 rounded-xl font-bold text-sm hover:glow-green transition-all flex items-center justify-center gap-2 group">
                                Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            
                            <p className="mt-6 text-center text-[10px] text-subtext font-bold uppercase tracking-widest">Secure encrypted payment</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-24 bg-card border border-border rounded-3xl text-center grain relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
                         <ShoppingBag size={200} />
                    </div>
                    <p className="text-text font-heading italic text-2xl mb-4 relative z-10">Your collection is empty.</p>
                    <p className="text-subtext mb-10 relative z-10">Begin your next literary journey today.</p>
                    <Link to="/books" className="bg-secondary text-primary px-8 py-3.5 rounded-xl font-bold text-sm hover:glow-green inline-flex items-center gap-2 relative z-10">
                        Explore Stories <ArrowRight size={16}/>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Cart;
