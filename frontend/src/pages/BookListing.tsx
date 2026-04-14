import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const BookListing: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/api/books');
        setBooks(res.data);
      } catch {
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const addToCart = async (bookId: number) => {
    try {
      await api.post('/api/cart/add', { book_id: bookId, quantity: 1 });
      toast.success('Added to bag!');
    } catch {
      toast.error('Sign in first');
    }
  };

  const categories = ['All', ...Array.from(new Set(books.map(b => b.category))).filter(Boolean)];

  const filtered = books.filter(b => {
    const matchesSearch = b.title?.toLowerCase().includes(search.toLowerCase()) ||
                          b.author?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <div className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-2">Collection</div>
          <h1 className="text-4xl font-heading italic text-text">All Books</h1>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* Category Pill Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar max-w-full md:max-w-md">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all whitespace-nowrap border uppercase tracking-widest ${
                  selectedCategory === cat 
                  ? 'bg-secondary text-primary border-secondary' 
                  : 'bg-surface text-subtext/60 border-border hover:border-secondary/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtext" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text placeholder:text-subtext/50 focus:outline-none focus:border-secondary/40 transition-colors"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="skeleton h-[380px] rounded-2xl"></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-card border border-border rounded-2xl">
          <p className="text-subtext text-lg">No books match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(book => (
            <div key={book.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-secondary/20 transition-all duration-500 flex flex-col">
              <div className="h-56 bg-surface flex items-center justify-center p-6 relative overflow-hidden">
                {book.cover_image ? (
                  <img src={book.cover_image} alt={book.title} className="h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="h-full w-28 bg-border/30 rounded shadow-inner"></div>
                )}
                <button
                  onClick={() => addToCart(book.id)}
                  className="absolute bottom-3 right-3 bg-secondary text-primary p-2 rounded-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"
                >
                  <ShoppingBag size={14} />
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col border-t border-border">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{book.category}</span>
                <h3 className="font-heading italic text-lg text-text truncate">{book.title}</h3>
                <p className="text-xs text-subtext mb-4">{book.author}</p>
                <div className="mt-auto flex justify-between items-center pt-3 border-t border-border/50">
                    <span className="font-bold text-lg text-secondary">₹{parseFloat(book.price).toFixed(0)}</span>
                    <Link to={`/books/${book.id}`} className="text-subtext hover:text-secondary text-xs font-bold transition-colors">Details →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookListing;
