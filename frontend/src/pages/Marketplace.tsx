import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Tag, User, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const Marketplace: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMarketplaceBooks(); }, []);

  const fetchMarketplaceBooks = async () => {
    try {
      const response = await api.get('/api/secondHand');
      setBooks(response.data);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const addToCart = async (book: any) => {
    try {
      await api.post('/api/cart/add', { book_id: book.book_id, is_second_hand: true, sh_book_id: book.id, quantity: 1 });
      toast.success('Added to bag!');
    } catch { toast.error('Failed to add.'); }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={32}/></div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <div className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-2">Pre-loved</div>
          <h1 className="text-4xl font-heading italic text-text">Second-Hand Marketplace</h1>
          <p className="text-subtext text-sm mt-2">Books with a past. Every copy tells a story.</p>
        </div>
        <Link to="/sell" className="bg-secondary text-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-secondary/20 transition-all">
          Sell a Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-20 text-center">
          <p className="text-subtext mb-6">The marketplace is empty. Be the first to list!</p>
          <Link to="/sell" className="bg-secondary text-primary px-6 py-2.5 rounded-xl font-bold text-sm">List a Book</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map(book => (
            <div key={book.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-secondary/20 transition-all flex flex-col relative">
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-surface/80 backdrop-blur border border-border rounded-lg text-[10px] font-bold text-text z-10 uppercase tracking-wider">
                {book.condition_desc}
              </div>
              <Link to={`/journey/${book.id}`} className="absolute top-3 right-3 px-2.5 py-1 bg-secondary/10 border border-secondary/20 rounded-lg text-[10px] font-bold text-secondary z-10 hover:bg-secondary/20 transition-colors flex items-center gap-1">
                <Tag size={10}/> Journey
              </Link>

              <div className="h-52 bg-surface flex items-center justify-center p-6">
                {book.cover_image ? (
                  <img src={book.cover_image} alt={book.title} className="h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="h-full w-28 bg-border/30 rounded shadow-inner"></div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col border-t border-border">
                <h3 className="font-heading italic text-lg text-text truncate mb-1">{book.title}</h3>
                <p className="text-xs text-subtext mb-3">{book.author}</p>

                <div className="bg-surface rounded-lg p-3 flex items-center gap-4 mb-4 border border-border/50 text-xs">
                  <div className="flex items-center gap-1.5 text-text"><User size={11}/> {book.seller_name}</div>
                  <div className="flex items-center gap-1.5 text-subtext"><MapPin size={11}/> {book.seller_city || 'Global'}</div>
                </div>

                <div className="mt-auto flex justify-between items-center pt-3 border-t border-border/50">
                  <span className="font-bold text-lg text-secondary">₹{parseFloat(book.price).toFixed(2)}</span>
                  <div className="flex gap-2">
                    <Link to={`/books/${book.book_id}`} className="px-3 py-2 bg-surface border border-border text-subtext rounded-lg font-bold text-xs hover:text-text hover:border-secondary/30 transition-all">
                      Details
                    </Link>
                    <button onClick={() => addToCart(book)} className="bg-secondary text-primary px-3.5 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 hover:shadow-lg hover:shadow-secondary/20 transition-all">
                      <ShoppingCart size={13} /> Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
