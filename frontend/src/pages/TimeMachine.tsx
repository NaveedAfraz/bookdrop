import React, { useState } from 'react';
import { ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const eras = [
    { label: "Ancient", start: 0, end: 500, desc: "Mythology, epics, and the birth of thought." },
    { label: "Medieval", start: 500, end: 1500, desc: "Knights, illuminations, and sacred texts." },
    { label: "Renaissance", start: 1500, end: 1800, desc: "Enlightenment, discovery, and revolution." },
    { label: "Industrial", start: 1800, end: 1950, desc: "Steam, iron, and the modern novel." },
    { label: "Modern", start: 1950, end: 2026, desc: "Postwar, digital, and global voices." }
];

const TimeMachine: React.FC = () => {
    const [selectedEra, setSelectedEra] = useState<any>(null);
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleEraClick = async (era: any) => {
        setSelectedEra(era);
        setLoading(true);
        try {
            const response = await api.get(`/api/discovery/timeline/${era.start}/${era.end}`);
            setBooks(response.data);
        } catch { setBooks([]); } finally { setLoading(false); }
    };

    const addToCart = async (bookId: number) => {
        try {
            await api.post('/api/cart/add', { book_id: bookId, quantity: 1 });
            toast.success('Added to bag!');
        } catch { toast.error('Sign in first'); }
    };

    return (
        <div className="container mx-auto px-6 py-16">
            <div className="text-center mb-16">
                <div className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-3">Literary Archaeology</div>
                <h1 className="text-5xl md:text-6xl font-heading italic text-text mb-4">Time Machine</h1>
                <p className="text-subtext italic max-w-lg mx-auto">"A book is a version of the world."</p>
            </div>

            {/* Era Selector - Horizontal Timeline */}
            <div className="relative mb-20">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2 hidden md:block"></div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
                    {eras.map(era => (
                        <button
                            key={era.label}
                            onClick={() => handleEraClick(era)}
                            className={`p-6 rounded-2xl border flex flex-col items-center text-center transition-all group ${
                                selectedEra?.label === era.label
                                    ? 'bg-secondary/10 border-secondary/40 glow-green'
                                    : 'bg-card border-border hover:border-secondary/20 hover:-translate-y-1'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg font-heading italic ${
                                selectedEra?.label === era.label ? 'bg-secondary text-primary' : 'bg-surface text-subtext border border-border'
                            }`}>
                                {era.label[0]}
                            </div>
                            <h3 className="font-heading italic text-lg text-text mb-1">{era.label}</h3>
                            <p className="text-[10px] text-subtext leading-relaxed">{era.desc}</p>
                            <div className="mt-3 text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight size={16}/>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {selectedEra && (
                <div>
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border">
                        <h2 className="text-3xl font-heading italic text-text">{selectedEra.label} Collection</h2>
                        <span className="text-xs font-bold bg-surface border border-border text-subtext px-3 py-1.5 rounded-lg">{selectedEra.start} — {selectedEra.end}</span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-secondary" size={28}/></div>
                    ) : books.length === 0 ? (
                        <div className="p-16 text-center text-subtext italic bg-card border border-dashed border-border rounded-2xl">No volumes preserved from this era.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {books.map(book => (
                                <div key={book.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-secondary/20 transition-all flex flex-col">
                                    <div className="aspect-[2/3] bg-surface flex items-center justify-center overflow-hidden relative">
                                        <img src={book.cover_image} alt={book.title} className="h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                                    </div>
                                    <div className="p-5 border-t border-border">
                                        <h3 className="font-heading italic text-lg text-text truncate mb-0.5">{book.title}</h3>
                                        <p className="text-xs text-subtext italic mb-3">Circa {book.published_year}</p>
                                        <div className="flex justify-between items-center pt-3 border-t border-border/50">
                                            <span className="text-xl font-bold text-secondary">₹{book.price}</span>
                                            <button onClick={() => addToCart(book.id)} className="bg-secondary text-primary p-2.5 rounded-lg hover:shadow-lg hover:shadow-secondary/20 transition-all">
                                                <ShoppingCart size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimeMachine;
