import React, { useState } from 'react';
import { ShoppingCart, Trash2, Heart, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Wishlist: React.FC = () => {
    // Mock Data - In a real app this would come from an API
    const [wishlistItems, setWishlistItems] = useState([
        { id: 1, title: 'The Silent Patient', author: 'Alex Michaelides', price: 12.99, category: 'Thriller', cover_image: 'https://images-na.ssl-images-amazon.com/images/I/81L8pS6gkzL.jpg' },
        { id: 2, title: 'Dune', author: 'Frank Herbert', price: 14.50, category: 'Sci-Fi', cover_image: 'https://images-na.ssl-images-amazon.com/images/I/81S6p86L+LL.jpg' },
    ]);

    const handleRemove = (id: number) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
        toast.success('Removed from sanctuary.');
    };

    const handleAddToCart = (id: number) => {
        // Mock add to cart & remove from wishlist
        setWishlistItems(prev => prev.filter(item => item.id !== id));
        toast.success('Moved to bag ritual.');
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-6xl grain min-h-[80vh]">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                     <div className="w-8 h-8 bg-surface border border-border rounded-lg flex items-center justify-center text-secondary"><Heart size={16} fill="currentColor"/></div>
                     <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Curated Sanctuary</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-heading italic text-text mb-4">Your Wishlist</h1>
                <p className="text-subtext italic">Volumes waiting for their moment to join your collection.</p>
            </header>

            {wishlistItems.length === 0 ? (
                <div className="py-24 bg-card border border-border rounded-[2.5rem] text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-20 h-20 bg-surface border border-border rounded-3xl flex items-center justify-center mx-auto mb-8 text-subtext group-hover:text-secondary group-hover:glow-green transition-all duration-500">
                         <Sparkles size={32}/>
                    </div>
                    <p className="text-text font-heading italic text-2xl mb-4 relative z-10">Your sanctuary is vacant.</p>
                    <p className="text-subtext mb-10 relative z-10 max-w-xs mx-auto">Discover new worlds and add them here to preserve their memory.</p>
                    <Link to="/discover" className="bg-secondary text-primary px-8 py-3.5 rounded-xl font-bold text-sm hover:glow-green inline-flex items-center gap-2 relative z-10">
                        Explore Stories <ArrowRight size={16}/>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlistItems.map(book => (
                        <div key={book.id} className="bg-card border border-border rounded-[2rem] overflow-hidden group hover:border-secondary/20 transition-all duration-500 flex flex-col relative shadow-xl">
                            <button 
                                onClick={() => handleRemove(book.id)}
                                className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md border border-border p-2.5 rounded-xl text-subtext hover:text-error z-10 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="aspect-[3/4] bg-surface flex items-center justify-center p-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                                {book.cover_image ? (
                                    <img src={book.cover_image} alt={book.title} className="h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="h-full w-28 bg-border/20 rounded shadow-inner flex items-center justify-center"><BookOpen size={32} className="text-subtext/20"/></div>
                                )}
                            </div>
                            
                            <div className="p-7 flex-1 flex flex-col border-t border-border">
                                <div className="mb-4">
                                     <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em] bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-lg">{book.category}</span>
                                </div>
                                <h3 className="font-heading italic text-xl text-text truncate mb-1 group-hover:text-glow transition-all">{book.title}</h3>
                                <p className="text-xs text-subtext italic mb-6">by {book.author}</p>
                                
                                <div className="mt-auto flex justify-between items-center pt-5 border-t border-border/50">
                                    <span className="font-bold text-2xl text-text">₹{Number(book.price).toFixed(2)}</span>
                                    <button 
                                        onClick={() => handleAddToCart(book.id)}
                                        className="bg-secondary text-primary p-3 rounded-xl shadow-lg hover:glow-green transition-all"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add More Placeholder */}
                    <Link to="/discover" className="border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center p-8 group hover:border-secondary/40 hover:bg-secondary/5 transition-all min-h-[400px]">
                         <div className="w-14 h-14 bg-surface border border-border rounded-2xl flex items-center justify-center text-subtext group-hover:text-secondary group-hover:scale-110 transition-all mb-4">
                              <Sparkles size={24}/>
                         </div>
                         <p className="text-subtext font-bold text-xs uppercase tracking-widest text-center">Seek More Volumes</p>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
