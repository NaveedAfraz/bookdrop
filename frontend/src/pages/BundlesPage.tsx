import React, { useState, useEffect } from 'react';
import { ShoppingCart, Percent, Layers, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const BundlesPage: React.FC = () => {
    const [bundles, setBundles] = useState<any[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [bundlesRes, cartRes] = await Promise.all([
                api.get('/api/bundles'),
                token ? api.get('/api/cart') : Promise.resolve({ data: { items: [] } })
            ]);
            setBundles(bundlesRes.data);
            setCartCount(cartRes.data.items.length);
        } catch (error) {
            console.error('Error fetching bundles data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addEntireBundle = async (bundle: any) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return toast.error('Sign in to add bundles');

            for (const book of bundle.books) {
                await api.post('/api/cart/add', {
                    book_id: book.id,
                    quantity: 1
                });
            }
            toast.success(`Bundle "${bundle.title}" added to bag!`);
            fetchData();
        } catch (error) {
            toast.error('Failed to add bundle');
        }
    };

    let nextTier = 3;
    let nextDiscount = 5;

    if (cartCount >= 10) { nextTier = 10; nextDiscount = 15; }
    else if (cartCount >= 5) { nextTier = 10; nextDiscount = 15; }
    else if (cartCount >= 3) { nextTier = 5; nextDiscount = 10; }

    let booksNeeded = nextTier - cartCount;
    let progressPercent = (cartCount / 10) * 100;

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={32}/></div>;

    return (
        <div className="container mx-auto px-6 py-12 max-w-6xl">
            <header className="mb-12">
                <div className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-2">Exclusive Deals</div>
                <h1 className="text-4xl md:text-5xl font-heading italic text-text">Book Bundles</h1>
                <p className="text-subtext mt-2">Curated sets and volume discounts for the avid reader.</p>
            </header>

            {/* Custom Bundle Promo */}
            <div className="mesh-card border border-border/50 p-8 md:p-12 rounded-3xl mb-16 relative overflow-hidden grain shadow-xl">
                <div className="absolute -top-12 -right-12 text-secondary/5 rotate-12 pointer-events-none">
                     <Layers size={300} />
                </div>
                
                <div className="flex-1 relative z-10 w-full">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold px-3 py-1 rounded-lg tracking-widest uppercase">Volume Discount</span>
                    </div>
                    <h2 className="text-3xl font-heading italic text-text mb-2">Build Your Own Library</h2>
                    <p className="text-subtext mb-8 max-w-xl">Automatic tiered discounts apply when you add multiple volumes to your collection. Every story counts.</p>
                    
                    <div className="max-w-md">
                        <div className="mb-2 flex justify-between items-end text-[10px] font-bold uppercase tracking-widest">
                             <span className="text-subtext">{cartCount} books present</span>
                             {booksNeeded > 0 ? (
                                  <span className="text-secondary">Add {booksNeeded} more for {nextDiscount}% off</span>
                             ) : (
                                  <span className="text-secondary text-glow">15% Discount Unlocked</span>
                             )}
                        </div>
                        <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border">
                             <div className="bg-secondary h-full transition-all duration-1000 glow-green" style={{ width: `${Math.min(progressPercent, 100)}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between text-[9px] font-bold text-subtext/50 mt-3 uppercase tracking-tighter">
                             <span className={cartCount >= 3 ? "text-secondary" : ""}>3 Volumes (5%)</span>
                             <span className={cartCount >= 5 ? "text-secondary" : ""}>5 Volumes (10%)</span>
                             <span className={cartCount >= 10 ? "text-secondary" : ""}>10 Volumes (15%)</span>
                        </div>
                    </div>

                    <Link to="/books" className="mt-10 inline-flex items-center gap-2 bg-text text-primary px-8 py-3.5 rounded-xl font-bold text-sm hover:scale-105 transition-all group">
                        Browse Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Premade Bundles */}
            <h2 className="text-2xl font-heading italic text-text mb-8">Curated Stacks</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {bundles.map(bundle => (
                    <div key={bundle.id} className="bg-card rounded-3xl border border-border overflow-hidden group hover:border-secondary/20 transition-all flex flex-col sm:flex-row relative">
                        <div className="absolute top-4 left-4 bg-secondary/10 backdrop-blur-md border border-secondary/20 text-secondary text-[10px] font-bold px-3 py-1 rounded-lg z-10 flex items-center gap-1 uppercase">
                             <Percent size={10}/> {parseFloat(bundle.discount_percent).toFixed(0)}% OFF
                        </div>
                        
                        <div className="sm:w-2/5 bg-surface/50 p-8 flex flex-col items-center justify-center relative min-h-[220px]">
                            <div className="relative w-full flex flex-col items-center">
                                {bundle.books && bundle.books.length > 0 ? (
                                    <div className="flex -space-x-12">
                                        {bundle.books.slice(0, 3).map((b: any, i: number) => (
                                            <div key={i} className="w-24 h-36 border border-border rounded-lg overflow-hidden shadow-2xl transform hover:-translate-y-4 transition-transform duration-500" style={{ zIndex: 3-i }}>
                                                <img src={b.cover_image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                  <Layers className="text-border" size={48} />
                                )}
                            </div>
                        </div>
                        
                        <div className="p-8 sm:w-3/5 flex flex-col">
                             <h3 className="text-2xl font-heading italic text-text mb-2 truncate">{bundle.title}</h3>
                             <p className="text-subtext mb-8 flex-1 text-sm leading-relaxed italic">"{bundle.description}"</p>
                             
                             <div className="mb-6 flex items-end gap-3">
                                  <span className="text-3xl font-bold text-text">${parseFloat(bundle.discounted_price).toFixed(2)}</span>
                                  <span className="text-subtext/50 line-through text-lg pb-1">${parseFloat(bundle.original_price).toFixed(2)}</span>
                             </div>

                             <button onClick={() => addEntireBundle(bundle)} className="w-full bg-secondary text-primary py-3.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 hover:glow-green transition-all">
                                 <ShoppingCart size={16} /> Add Stack
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BundlesPage;
