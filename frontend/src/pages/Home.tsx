import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Sparkles, Compass, ArrowRight, Star, Clock, Globe } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const Home: React.FC = () => {
  const [pickedBooks, setPickedBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchPicked = async () => {
      try {
        const response = await api.get('/api/books');
        setPickedBooks(response.data.sort(() => 0.5 - Math.random()).slice(0, 4));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPicked();
  }, []);

  const addToCart = async (bookId: number) => {
    try {
      await api.post('/api/cart/add', {
        book_id: bookId, quantity: 1
      });
      toast.success('Added to bag!');
    } catch (e) {
      toast.error('Sign in to add to bag');
    }
  };

  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden py-28 md:py-40 px-6 mesh-hero grain">
        {/* Floating orbs */}
        <div className="absolute top-20 left-[15%] w-72 h-72 bg-secondary/8 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-accent/6 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/3 rounded-full blur-[200px]"></div>

        <div className="container mx-auto text-center max-w-4xl relative z-[2]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface/50 text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-8">
            <Star size={12}/> AI-Powered Discovery
          </div>

          <h1 className="text-5xl md:text-7xl font-heading italic leading-[1.1] mb-8 text-text">
            Swipe. Read. Trade.
            <br/>
            <span className="text-secondary text-glow">Every book has a journey.</span>
          </h1>

          <p className="text-lg md:text-xl text-subtext max-w-2xl mx-auto mb-12 leading-relaxed">
            Discover your next obsession through intelligent swipe curation, trace every copy's global journey, and trade within a vibrant community of readers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/discover" 
              className="bg-secondary text-primary px-8 py-4 rounded-xl font-bold text-base hover:shadow-xl hover:shadow-secondary/20 transition-all flex items-center justify-center gap-2 group"
            >
              <Compass size={18} /> Start Swiping 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
            <Link 
              to="/quiz" 
              className="border border-border bg-surface/50 text-text px-8 py-4 rounded-xl font-bold text-base hover:border-secondary/30 hover:bg-surface transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={18} className="text-secondary"/> Discovery Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ PICKED FOR YOU ═══ */}
      <section className="container mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-14">
          <div>
            <div className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-3">Curated for you</div>
            <h2 className="text-4xl md:text-5xl font-heading italic text-text">Today's Picks</h2>
          </div>
          <Link to="/books" className="text-secondary font-bold text-sm hover:underline flex items-center gap-1.5 group">
            View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pickedBooks.length === 0 ? (
            [1,2,3,4].map(i => (
              <div key={i} className="skeleton h-[420px] rounded-2xl"></div>
            ))
          ) : (
            pickedBooks.map((book) => (
              <div key={book.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-secondary/20 hover:glow-green transition-all duration-500 flex flex-col">
                <div className="h-64 bg-surface relative flex items-center justify-center p-8 overflow-hidden">
                  <img src={book.cover_image} alt={book.title} className="h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" />
                  <button 
                    onClick={() => addToCart(book.id)}
                    className="absolute bottom-4 right-4 bg-secondary text-primary p-2.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <ShoppingCart size={16} />
                  </button>
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-secondary/10 border border-secondary/20 rounded-md text-[10px] font-bold text-secondary uppercase tracking-widest">
                    Picked
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-heading italic text-lg text-text truncate mb-0.5">{book.title}</h3>
                  <p className="text-xs text-subtext mb-4">by {book.author}</p>
                  <div className="mt-auto flex justify-between items-center pt-4 border-t border-border/50">
                    <span className="font-bold text-lg text-secondary">₹{book.price}</span>
                    <Link to={`/books/${book.id}`} className="text-subtext hover:text-secondary text-xs font-bold transition-colors">
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ═══ FEATURES GRID ═══ */}
      <section className="py-24 border-y border-border/50 bg-surface/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-3">How it works</div>
            <h2 className="text-4xl font-heading italic text-text">A universe of stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShoppingCart size={24}/>, title: "Community Trade", desc: "Give your books a second life. Our marketplace makes trading seamless and rewarding.", num: "01", color: "text-secondary" },
              { icon: <Globe size={24}/>, title: "Trace the Journey", desc: "See where your book has been. Read notes from previous owners across the globe.", num: "02", color: "text-accent" },
              { icon: <Clock size={24}/>, title: "Read Together", desc: "Join live reading rooms. Discuss chapters in real-time as you journey through stories.", num: "03", color: "text-[#A78BFA]" }
            ].map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-8 hover:border-secondary/20 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 text-[80px] font-heading italic text-border/30 leading-none pr-4 pt-2 select-none">{f.num}</div>
                <div className={`w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mb-6 ${f.color} group-hover:glow-green transition-all`}>
                  {f.icon}
                </div>
                <h4 className="text-xl font-heading italic text-text mb-3">{f.title}</h4>
                <p className="text-subtext text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
