import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, BookOpen, Star, User, Loader2, Send, MapPin, History } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const BookDetail: React.FC = () => {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '', name: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [shBooks, setShBooks] = useState<any[]>([]);

  useEffect(() => { fetchBookData(); }, [id]);

  const fetchBookData = async () => {
    setLoading(true);
    try {
      const [bookRes, reviewsRes, shRes] = await Promise.all([
        api.get(`/api/books/${id}`),
        api.get(`/api/reviews/${id}`),
        api.get(`/api/secondHand/book/${id}`)
      ]);
      setBook(bookRes.data);
      setReviews(reviewsRes.data);
      setShBooks(shRes.data);
    } catch { toast.error('Failed to load.'); } finally { setLoading(false); }
  };

  const addToCart = async (shBook?: any) => {
    try {
      if (shBook) {
        await api.post('/api/cart/add', { bank_id: parseInt(id!), is_second_hand: true, sh_book_id: shBook.id, quantity: 1 });
      } else {
        await api.post('/api/cart/add', { book_id: parseInt(id!), quantity });
      }
      toast.success('Added to bag!');
    } catch { toast.error('Sign in first.'); }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post('/api/reviews', { book_id: parseInt(id!), review_text: reviewForm.text, rating: reviewForm.rating, name: reviewForm.name });
      toast.success('Review posted!');
      setReviewForm({ rating: 5, text: '', name: '' });
      fetchBookData();
    } catch (error: any) { toast.error(error.response?.data?.error || 'Failed.'); } finally { setSubmittingReview(false); }
  };

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={36}/></div>;
  if (!book) return <div className="text-center py-20 text-subtext">Book not found.</div>;

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      {/* Book Detail Card */}
      <div className="flex flex-col lg:flex-row gap-10 bg-card border border-border rounded-2xl p-6 lg:p-10 mb-16">
        <div className="lg:w-2/5 shrink-0">
          <div className="w-full aspect-[2/3] bg-surface border border-border rounded-2xl overflow-hidden relative group">
            <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur transition-all ${isWishlisted ? 'bg-error/20 text-error border border-error/30' : 'bg-surface/80 text-subtext border border-border hover:text-error'}`}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-lg">{book.category}</span>
            {book.published_year && <span className="text-[10px] font-bold text-subtext">Circa {book.published_year}</span>}
          </div>

          <h1 className="text-4xl font-heading italic text-text mb-2">{book.title}</h1>
          <p className="text-lg text-subtext mb-6">by <span className="text-text">{book.author}</span></p>
          <div className="text-3xl font-bold text-secondary mb-6">₹{parseFloat(book.price).toFixed(2)}</div>
          <p className="text-subtext leading-relaxed mb-8">{book.description}</p>

          <div className="pt-6 border-t border-border">
            <div className="flex items-center gap-6 mb-6">
              <div>
                <p className="text-[10px] text-subtext font-bold uppercase tracking-widest mb-2">Qty</p>
                <div className="flex items-center border border-border rounded-xl overflow-hidden bg-surface">
                  <button className="px-4 py-2 hover:bg-border/30 text-text font-bold transition-colors" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span className="px-5 py-2 font-bold text-text">{quantity}</span>
                  <button className="px-4 py-2 hover:bg-border/30 text-text font-bold transition-colors" onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}>+</button>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-subtext font-bold uppercase tracking-widest mb-2">Stock</p>
                {book.stock > 0 ? (
                  <span className="text-secondary font-bold text-sm flex items-center gap-1.5"><div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div> {book.stock} left</span>
                ) : (
                  <span className="text-error font-bold text-sm">Sold Out</span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={addToCart} disabled={book.stock === 0} className="flex-1 bg-secondary text-primary font-bold py-4 rounded-xl hover:shadow-xl hover:shadow-secondary/20 transition-all flex justify-center items-center gap-3 disabled:opacity-40 group relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <ShoppingBag size={18} className="relative z-10" /> <span className="relative z-10">Add to Bag</span>
              </button>
              <Link to={`/chapters/${id}/1`} className="bg-surface border border-border text-text py-4 px-6 rounded-xl font-bold hover:border-secondary/30 transition-all flex items-center gap-2">
                <BookOpen size={18} /> Sample
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Second Hand Section */}
      {shBooks.length > 0 && (
        <div className="mb-16">
          <header className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
            <h2 className="text-2xl font-heading italic text-text">Pre-loved Copies</h2>
            <span className="text-[10px] font-bold text-subtext uppercase tracking-widest bg-surface border border-border px-3 py-1 rounded-lg ml-auto">{shBooks.length} Available</span>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shBooks.map(sh => (
              <div key={sh.id} className="bg-card border border-border rounded-2xl p-6 relative group transition-all hover:border-secondary/20 hover:shadow-xl hover:shadow-secondary/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-2 py-0.5 rounded-md mb-2 inline-block">{sh.condition_desc}</span>
                    <h4 className="font-bold text-text flex items-center gap-2">
                       <User size={14} className="text-subtext"/> {sh.seller_name}
                    </h4>
                  </div>
                  <div className="text-xl font-bold text-text">₹{parseFloat(sh.price).toFixed(2)}</div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-subtext font-bold uppercase tracking-widest mb-6 pb-4 border-b border-border/50">
                   <MapPin size={12}/> {sh.seller_city || 'Global'}
                </div>

                <div className="flex gap-2">
                   <Link to={`/journey/${sh.id}`} className="flex-1 bg-surface border border-border text-text py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:border-secondary/30 transition-all">
                      <History size={14}/> Journey
                   </Link>
                   <button onClick={() => addToCart(sh)} className="flex-1 bg-secondary text-primary py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-secondary/20 transition-all">
                      <ShoppingBag size={14}/> Buy Copy
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-heading italic text-text mb-6">Reader Reviews</h2>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
                <p className="text-subtext italic">No reviews yet. Be the first!</p>
              </div>
            ) : (
              reviews.map(r => (
                <div key={r.id} className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-secondary"><User size={18}/></div>
                      <div>
                        <h4 className="font-bold text-text text-sm">{r.name}</h4>
                        <div className="flex items-center gap-0.5 text-secondary">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-subtext">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-subtext text-sm italic leading-relaxed">"{r.review_text}"</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="bg-card border border-border rounded-2xl p-7 sticky top-24">
            <h3 className="text-xl font-heading italic text-text mb-2">Leave a Review</h3>
            <p className="text-subtext text-xs mb-6">Purchased? Share your anonymous thoughts.</p>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-subtext uppercase tracking-widest mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewForm({...reviewForm, rating: s})} className={`p-1 transition-transform hover:scale-125 ${reviewForm.rating >= s ? 'text-secondary' : 'text-border'}`}>
                      <Star size={20} fill={reviewForm.rating >= s ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-subtext uppercase tracking-widest mb-2 block">Name</label>
                <input type="text" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors" placeholder="Anonymous"/>
              </div>
              <div>
                <label className="text-[10px] font-bold text-subtext uppercase tracking-widest mb-2 block">Review</label>
                <textarea required value={reviewForm.text} onChange={e => setReviewForm({...reviewForm, text: e.target.value})} className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-secondary/40 resize-none h-28 transition-colors" placeholder="What did you think?"></textarea>
              </div>
              <button type="submit" disabled={submittingReview} className="w-full bg-secondary text-primary font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-secondary/20 transition-all flex justify-center items-center gap-2 disabled:opacity-40">
                {submittingReview ? <Loader2 className="animate-spin" size={16}/> : <><Send size={14}/> Submit</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
