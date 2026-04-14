import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Loader2, Sparkles, Minus, Plus } from 'lucide-react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) fetchCart();
    }, [isOpen]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setCart({ items: [], total: 0 });
                return;
            }
            const response = await api.get('/api/cart');
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCart({ items: [], total: 0 });
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId: number) => {
        try {
            await api.delete(`/api/cart/remove/${itemId}`);
            fetchCart();
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    // Keep it in the DOM but hidden for transitions
    const cartItems = cart?.items || [];
    const total = cart?.total || 0;

    return (
        <div className={`fixed inset-0  h-[100vh]  z-[100] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose}
            ></div>
            
            {/* Drawer */}
            <aside className={`absolute top-0 right-0 h-full w-full max-w-md bg-card border-l border-border shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col grain transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.67,0)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header */}
                <div className="p-8 border-b border-border/50 flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 border border-secondary/20 rounded-xl flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(0,229,160,0.1)]">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading italic text-text leading-tight">Your Bag</h2>
                            <p className="text-[10px] font-bold text-subtext uppercase tracking-[0.2em] mt-1">{cartItems.length} Volumes</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-surface border border-transparent hover:border-border rounded-xl transition-all text-subtext hover:text-text group">
                        <X size={18} className="group-hover:rotate-90 transition-transform duration-300"/>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10">
                    {loading && !cart ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                             <div className="relative">
                                <Loader2 className="animate-spin text-secondary" size={32} />
                                <div className="absolute inset-0 blur-lg bg-secondary/20 animate-pulse"></div>
                             </div>
                             <p className="text-xs font-bold text-subtext uppercase tracking-widest">Accessing Vault...</p>
                        </div>
                    ) : (
                        cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div className="w-20 h-20 bg-surface border border-border rounded-3xl flex items-center justify-center mb-8 relative group">
                                    <div className="absolute inset-0 bg-secondary/5 rounded-3xl blur-xl group-hover:bg-secondary/10 transition-colors"></div>
                                    <ShoppingBag size={32} className="text-border group-hover:text-secondary transition-colors relative z-10" />
                                </div>
                                <h3 className="text-2xl font-heading italic text-text mb-2">Vault is Empty</h3>
                                <p className="text-subtext italic text-sm mb-10 max-w-[200px]">Begin your next literary ritual by adding a volume to your collection.</p>
                                <button onClick={onClose} className="bg-secondary text-primary px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:glow-green transition-all transform hover:scale-105">
                                    Browse Stories
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cartItems.map((item: any) => (
                                    <div key={item.id} className="flex gap-5 group p-4 rounded-2xl hover:bg-surface/30 border border-transparent hover:border-border transition-all relative overflow-hidden">
                                        <div className="w-20 h-28 bg-surface rounded-xl overflow-hidden shrink-0 border border-border shadow-lg group-hover:scale-105 transition-transform duration-500">
                                            <img src={item.cover_image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div className="relative">
                                                <h4 className="font-heading italic text-lg text-text truncate pr-6 group-hover:text-secondary transition-colors">{item.title}</h4>
                                                <p className="text-xs text-subtext italic truncate">by {item.author}</p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden h-8">
                                                    <button className="p-1.5 hover:bg-border/30 text-subtext transition-colors"><Minus size={12}/></button>
                                                    <span className="px-2 text-xs font-bold text-text">{item.quantity}</span>
                                                    <button className="p-1.5 hover:bg-border/30 text-subtext transition-colors"><Plus size={12}/></button>
                                                </div>
                                                <div className="text-lg font-bold text-text">
                                                     ${item.price}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="absolute top-4 right-4 text-subtext hover:text-error opacity-0 group-hover:opacity-100 transition-all p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-8 border-t border-border bg-surface/50 backdrop-blur-md relative z-10">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <p className="text-[10px] font-bold text-subtext uppercase tracking-[0.2em] mb-1">Total Sacrifice</p>
                                <div className="h-0.5 w-12 bg-secondary/30 rounded-full"></div>
                            </div>
                            <span className="text-3xl font-bold text-text text-glow-blue">₹{Number(total).toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={handleCheckout} 
                            className="w-full bg-secondary text-primary py-4 rounded-xl font-bold text-sm hover:glow-green transition-all flex items-center justify-center gap-3 group relative overflow-hidden shadow-2xl"
                        >
                             <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                             <span className="relative z-10 uppercase tracking-widest text-[11px] font-black">Initiate Checkout</span>
                             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform relative z-10" />
                        </button>
                        <p className="text-[9px] text-center text-subtext font-bold uppercase tracking-[0.2em] mt-6 flex items-center justify-center gap-2">
                            <Sparkles size={10} className="text-secondary"/> Secure Ritual Encryption Enabled
                        </p>
                    </div>
                )}
            </aside>
        </div>
    );
};

export default CartDrawer;