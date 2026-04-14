import React, { useState, useEffect } from 'react';
import { Heart, X, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const SwipePage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeState, setSwipeState] = useState<'IDLE' | 'SWIPING_LEFT' | 'SWIPING_RIGHT'>('IDLE');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get('/api/books');
        setBooks(res.data.sort(() => 0.5 - Math.random()));
      } catch {
        setBooks([
          { id: 101, title: 'The Silent Patient', author: 'Alex Michaelides', rating: 4.5, price: 12.99 },
          { id: 102, title: 'Dune', author: 'Frank Herbert', rating: 4.8, price: 14.50 },
        ]);
      }
    };
    fetchBooks();
  }, []);

  const handleSwipe = async (direction: 'LEFT' | 'RIGHT') => {
    if (swipeState !== 'IDLE') return;
    setSwipeState(direction === 'LEFT' ? 'SWIPING_LEFT' : 'SWIPING_RIGHT');

    if (direction === 'RIGHT') {
      try {
        await api.post('/api/cart/add', {
          book_id: books[currentIndex]?.id, quantity: 1
        });
        toast.success('Added to wishlist!');
      } catch { /* silent */ }
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeState('IDLE');
    }, 500);
  };

  const currentBook = books[currentIndex];

  if (!currentBook) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center mb-6">
          <BookOpen size={32} className="text-secondary" />
        </div>
        <h2 className="text-3xl font-heading italic text-text mb-3">You're all caught up!</h2>
        <p className="text-subtext mb-8 max-w-md">We're preparing more recommendations based on your taste profile.</p>
        <Link to="/books" className="bg-secondary text-primary py-3 px-8 rounded-xl font-bold hover:shadow-lg hover:shadow-secondary/20 transition-all">
          Browse Library
        </Link>
      </div>
    );
  }

  let cardClass = "w-full max-w-xs sm:max-w-sm bg-card border border-border rounded-2xl flex flex-col overflow-hidden relative transition-transform duration-300 mx-auto";
  if (swipeState === 'SWIPING_LEFT') cardClass += " animate-swipe-left";
  if (swipeState === 'SWIPING_RIGHT') cardClass += " animate-swipe-right";

  return (
    <div className="flex flex-col items-center overflow-hidden px-4" style={{ height: 'calc(100vh - 72px)' }}>
      {/* Header — compact */}
      <div className="text-center py-4 shrink-0">
        <p className="text-subtext text-sm">Right = wishlist · Left = skip</p>
      </div>

      {/* Card area — takes remaining space minus button area */}
      <div className="relative w-full max-w-xs flex-1 min-h-0 mb-4">
        {books[currentIndex + 1] && (
          <div className="w-full bg-surface border border-border rounded-2xl absolute top-3 scale-[0.93] opacity-20 h-full z-0"></div>
        )}

        <div className={cardClass + " z-10 h-full"}>
          <div className="flex-1 bg-surface flex items-center justify-center p-4 overflow-hidden min-h-0">
            {currentBook.cover_image ? (
              <img src={currentBook.cover_image} alt={currentBook.title} className="max-h-full max-w-full object-contain drop-shadow-2xl" />
            ) : (
              <div className="w-3/4 h-3/4 bg-border/30 rounded-lg shadow-inner"></div>
            )}
          </div>
          <div className="px-4 py-3 bg-card border-t border-border shrink-0">
            <div className="flex justify-between items-center">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-heading italic text-text truncate">{currentBook.title}</h2>
                <p className="text-subtext text-xs">{currentBook.author}</p>
              </div>
              <div className="bg-surface border border-border px-2 py-0.5 flex items-center gap-1 rounded-lg shrink-0 ml-3">
                <span className="text-secondary font-bold text-sm">★</span>
                <span className="text-xs font-bold text-text">{currentBook.rating || '4.5'}</span>
              </div>
            </div>
            <p className="font-bold text-secondary mt-1">₹{currentBook.price}</p>
          </div>

          {swipeState === 'SWIPING_RIGHT' && (
            <div className="absolute inset-0 bg-secondary/15 border-2 border-secondary rounded-2xl flex items-center justify-center z-20">
              <span className="text-3xl font-bold text-secondary border-2 border-secondary rounded-full px-6 py-2 rotate-12">WISH</span>
            </div>
          )}
          {swipeState === 'SWIPING_LEFT' && (
            <div className="absolute inset-0 bg-error/15 border-2 border-error rounded-2xl flex items-center justify-center z-20">
              <span className="text-3xl font-bold text-error border-2 border-error rounded-full px-6 py-2 -rotate-12">PASS</span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons — pinned at bottom, never hidden */}
      <div className="flex items-center gap-5 py-4 shrink-0">
        <button
          onClick={() => handleSwipe('LEFT')}
          disabled={swipeState !== 'IDLE'}
          className="w-14 h-14 rounded-2xl bg-card border border-border text-error flex items-center justify-center hover:bg-error/10 hover:border-error/30 hover:scale-110 transition-all disabled:opacity-40"
        >
          <X size={24} />
        </button>
        <Link to={`/books/${currentBook.id}`} className="w-11 h-11 rounded-xl bg-surface border border-border text-subtext flex items-center justify-center hover:text-accent transition-all">
          <BookOpen size={18} />
        </Link>
        <button
          onClick={() => handleSwipe('RIGHT')}
          disabled={swipeState !== 'IDLE'}
          className="w-14 h-14 rounded-2xl bg-card border border-border text-secondary flex items-center justify-center hover:bg-secondary/10 hover:border-secondary/30 hover:scale-110 transition-all disabled:opacity-40"
        >
          <Heart size={24} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default SwipePage;

