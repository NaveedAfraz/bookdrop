import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Loader2 } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const WorldMap: React.FC = () => {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleCountryClick = async (countryName: string) => {
        setSelectedCountry(countryName);
        setLoading(true);
        try {
            const response = await api.get(`/api/discovery/map/${countryName}`);
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
        <div className="container mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <div className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-3">Explore by origin</div>
                <h1 className="text-4xl md:text-5xl font-heading italic text-text mb-3">Global Literatures</h1>
                <p className="text-subtext max-w-xl mx-auto">Click a country to discover its celebrated stories.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden mb-12">
                <div className="px-5 py-3 border-b border-border flex justify-between items-center">
                    <span className="text-[10px] font-bold text-subtext uppercase tracking-widest">Interactive Atlas</span>
                    {selectedCountry && (
                        <span className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-lg">{selectedCountry.toUpperCase()}</span>
                    )}
                </div>
                <div className="aspect-[2/1] bg-surface/50 overflow-hidden">
                    <ComposableMap projectionConfig={{ scale: 147, center: [0, 20] }} width={800} height={400} style={{ width: '100%', height: '100%' }}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo: any) => {
                                const name = geo.properties.name;
                                const isSelected = selectedCountry === name;
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        onClick={() => handleCountryClick(name)}
                                        style={{
                                            default: { fill: isSelected ? "#00E5A0" : "#1A2744", outline: "none", transition: "all 250ms", stroke: "#111B2E", strokeWidth: 0.5 },
                                            hover: { fill: "#3B82F6", outline: "none", cursor: "pointer" },
                                            pressed: { fill: "#00E5A0", outline: "none" }
                                        }}
                                    />
                                );
                            })}
                        </Geographies>
                    </ComposableMap>
                </div>
            </div>

            {selectedCountry && (
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-heading italic text-text">Books from {selectedCountry}</h2>
                        <button onClick={() => setSelectedCountry(null)} className="flex items-center gap-1.5 text-subtext hover:text-error transition-colors text-xs font-bold">
                            <X size={14}/> Clear
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-secondary" size={28}/></div>
                    ) : books.length === 0 ? (
                        <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center">
                            <p className="text-subtext">No books from this region yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {books.map(book => (
                                <div key={book.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-secondary/20 transition-all flex flex-col">
                                    <div className="h-52 bg-surface p-6 flex items-center justify-center relative">
                                        <img src={book.cover_image} alt={book.title} className="h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300" />
                                        <button onClick={() => addToCart(book.id)} className="absolute bottom-3 right-3 bg-secondary text-primary p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                            <ShoppingCart size={14} />
                                        </button>
                                    </div>
                                    <div className="p-5 border-t border-border">
                                        <h3 className="font-heading italic text-lg text-text truncate mb-1">{book.title}</h3>
                                        <p className="text-xs text-subtext mb-3">{book.author}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-lg text-secondary">₹{book.price}</span>
                                            <Link to={`/books/${book.id}`} className="text-subtext hover:text-secondary text-xs font-bold transition-colors">Details →</Link>
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

export default WorldMap;
