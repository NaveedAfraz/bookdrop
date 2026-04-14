import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, User, CreditCard, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState<any>(null);
    const [address, setAddress] = useState({
        full_name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: ''
    });

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await api.get('/api/cart');
            setCart(res.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const handleConfirmOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // First create an address or use a default one
            const addrRes = await api.post('/api/addresses', {
                full_name: address.full_name,
                phone: address.phone,
                street: address.street,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                is_default: false
            });
            const addressId = addrRes.data.addressId;

            // Place order
            const orderRes = await api.post('/api/orders/place', {
                address_id: addressId
            });

            const shIds = orderRes.data.secondHandBookIds || [];
            const queryParam = shIds.length > 0 ? `?sh_ids=${shIds.join(',')}` : '';
            toast.success('Sanctum ritual complete. Order placed.');
            navigate(`/order-success${queryParam}`);
        } catch (error: any) {
            console.error('Error placing order:', error);
            toast.error(error.response?.data?.error || 'Ritual failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!cart) return <div className="min-h-[60vh] flex items-center justify-center bg-bg"><Loader2 className="animate-spin text-secondary" size={32}/></div>;

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
            <Link to="/cart" className="inline-flex items-center gap-2 text-subtext hover:text-secondary transition-colors text-[10px] font-bold uppercase tracking-widest mb-10 group">
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Bag
            </Link>

            <h1 className="text-4xl md:text-5xl font-heading italic text-text mb-12">Finalize Ritual</h1>
            
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-1">
                    <form onSubmit={handleConfirmOrder} className="space-y-10">
                        <section>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-secondary shadow-lg"><MapPin size={18}/></div>
                                <h2 className="text-2xl font-heading italic text-text">Sanctuary Address</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1">Full Identity</label>
                                    <div className="relative">
                                        <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext/50"/>
                                        <input required type="text" className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-3.5 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors" placeholder="Full Name" value={address.full_name} onChange={e => setAddress({...address, full_name: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1">Communication Line</label>
                                    <div className="relative">
                                        <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext/50"/>
                                        <input required type="text" className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-3.5 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1">Street Location</label>
                                    <input required type="text" className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors" placeholder="123 Ritual Ave, Apt 42" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1">Citadel</label>
                                    <input required type="text" className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors" placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1">Province / State</label>
                                    <input required type="text" className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors" placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1">Postal Sigil</label>
                                    <input required type="text" className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
                                </div>
                            </div>
                        </section>

                        <section className="pt-10 border-t border-border">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-accent shadow-lg"><CreditCard size={18}/></div>
                                <h2 className="text-2xl font-heading italic text-text">Payment Gateway</h2>
                            </div>
                            <div className="bg-surface border border-border p-6 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-secondary/30 transition-all">
                                <div className="flex items-center gap-4">
                                     <div className="w-4 h-4 rounded-full border-2 border-secondary flex items-center justify-center">
                                          <div className="w-2 h-2 bg-secondary rounded-full"></div>
                                     </div>
                                     <div>
                                         <p className="font-bold text-sm text-text">Sanctum Credits / Card</p>
                                         <p className="text-[10px] text-subtext uppercase tracking-widest">Encrypted Transmission</p>
                                     </div>
                                </div>
                                <ShieldCheck className="text-secondary" size={20}/>
                            </div>
                        </section>
                    </form>
                </div>

                <div className="lg:w-96 shrink-0">
                    <div className="bg-card border border-border p-8 rounded-3xl shadow-2xl sticky top-24 grain">
                        <h2 className="text-2xl font-heading italic text-text mb-8">Order Summary</h2>
                        <div className="space-y-4 mb-8 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                            {cart.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-start text-xs">
                                     <div className="flex-1 pr-4">
                                         <p className="text-text font-bold truncate">{item.title}</p>
                                         <p className="text-subtext italic">×{item.quantity}</p>
                                     </div>
                                     <span className="text-secondary font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-4 border-t border-border pt-8 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-subtext">Base Amount</span>
                                <span className="text-text font-bold">₹{Number(cart.total).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-subtext">Protection Fee</span>
                                <span className="text-secondary font-bold uppercase tracking-widest text-[9px]">Waived</span>
                            </div>
                            <div className="divider-glow h-px w-full my-4"></div>
                            <div className="flex justify-between items-center text-2xl">
                                <span className="font-heading italic text-text">Total</span>
                                <span className="font-bold text-text text-glow-blue">₹{Number(cart.total).toFixed(2)}</span>
                            </div>
                        </div>

                        <button onClick={handleConfirmOrder} disabled={loading} className="w-full bg-secondary text-primary py-4 rounded-xl font-bold text-sm hover:glow-green transition-all shadow-xl disabled:opacity-40 flex items-center justify-center gap-2 group">
                            {loading ? <Loader2 className="animate-spin" size={18}/> : <>Confirm Order <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
