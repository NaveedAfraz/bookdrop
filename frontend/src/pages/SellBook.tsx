import React, { useState, useEffect } from 'react';
import { Upload, Search, Book, Loader2, Compass, AlertCircle, ChevronLeft } from 'lucide-react';
import api from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SellBook: React.FC = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        book_id: '',
        condition_desc: 'Good',
        price: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await api.get('/api/books');
            setBooks(response.data);
            if (response.data.length > 0) {
                setFormData(prev => ({ ...prev, book_id: response.data[0].id }));
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Sign in to list volumes.');
                return;
            }
            await api.post('/api/secondHand/sell', formData);
            toast.success('Volume listed in the marketplace.');
            navigate('/marketplace');
        } catch (error) {
            toast.error('Ritual failed. Ensure ownership.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-2xl grain">
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-subtext hover:text-secondary transition-colors text-[10px] font-bold uppercase tracking-widest mb-10 group">
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Marketplace
            </Link>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-heading italic text-text mb-4">Relinquish Volume</h1>
                <p className="text-subtext italic">Pass your copy to its next steward. Let its history unfold.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-[60px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                
                <div className="space-y-8 relative z-10">
                    <section>
                        <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1 mb-3 block">Identify Volume</label>
                        <div className="relative group/input">
                            <Book size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext/50 group-focus-within/input:text-secondary transition-colors"/>
                            <select 
                                required
                                className="w-full bg-surface border border-border rounded-xl pl-11 pr-10 py-4 text-sm text-text appearance-none focus:outline-none focus:border-secondary/40 transition-colors cursor-pointer" 
                                value={formData.book_id} 
                                onChange={(e) => setFormData({...formData, book_id: e.target.value})}
                            >
                                <option value="" disabled>Choose a master record...</option>
                                {books.map(book => (
                                    <option key={book.id} value={book.id}>{book.title} (by {book.author})</option>
                                ))}
                            </select>
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext/40 pointer-events-none" size={16} />
                        </div>
                    </section>

                    <section>
                        <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1 mb-3 block">Vessel Condition</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Good', 'Fair', 'Worn'].map((cond) => (
                                <button 
                                    key={cond}
                                    type="button"
                                    onClick={() => setFormData({...formData, condition_desc: cond})}
                                    className={`py-3.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${formData.condition_desc === cond ? 'border-secondary/40 bg-secondary/10 text-secondary glow-green' : 'border-border bg-surface text-subtext hover:border-secondary/20 hover:text-text'}`}
                                >
                                    {cond}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-start gap-2 mt-4 px-2 py-3 bg-surface/50 border border-border rounded-lg">
                             <AlertCircle size={14} className="text-secondary shrink-0 mt-0.5" />
                             <p className="text-[10px] text-subtext leading-relaxed font-bold uppercase tracking-tight">Condition impacts the ritual price and journey log transparency.</p>
                        </div>
                    </section>

                    <section>
                        <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1 mb-3 block">Listing Price (₹)</label>
                        <div className="relative group/input">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext/50 group-focus-within/input:text-secondary transition-colors font-bold text-sm">₹</span>
                            <input 
                                type="number" 
                                required 
                                step="0.01" 
                                min="0"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-4 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors placeholder:text-subtext/30" 
                                placeholder="0.00" 
                            />
                        </div>
                        <p className="text-[9px] text-subtext mt-2 ml-1 text-right italic">A fair price ensures a faster transition to the next steward.</p>
                    </section>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-secondary text-primary py-4.5 flex items-center justify-center gap-3 rounded-xl font-bold text-sm hover:glow-green transition-all shadow-xl disabled:opacity-40"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18}/> : (
                            <>
                                <Upload size={18} />
                                List on Marketplace
                            </>
                        )}
                    </button>
                    
                    <div className="text-center pt-2">
                         <Link to="/marketplace" className="text-xs font-bold text-subtext hover:text-secondary transition-colors uppercase tracking-widest flex items-center justify-center gap-1.5 group">
                              <Compass size={14} className="group-hover:rotate-12 transition-transform"/> Explore Sanctuary
                         </Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SellBook;
