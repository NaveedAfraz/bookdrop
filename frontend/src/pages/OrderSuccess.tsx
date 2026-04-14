import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Feather, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const OrderSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const shIds = searchParams.get('sh_ids')?.split(',') || [];
    
    const [note, setNote] = useState('');
    const [noteSaved, setNoteSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSaveNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (shIds.length === 0) return;
        
        setLoading(true);
        try {
            // Save note for the first SH book found in order for now
            await api.post('/api/journey/note', {
                sh_book_id: shIds[0],
                note: note
            });
            setNoteSaved(true);
            toast.success('Your note has been etched into history.');
        } catch (error) {
            console.error('Error saving note:', error);
            toast.error('Failed to preserve your words.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center container mx-auto px-6 py-12 mesh-hero grain">
            <div className="bg-card border border-border p-10 md:p-16 rounded-3xl shadow-2xl text-center max-w-2xl w-full relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-secondary/5 rounded-full blur-[100px]"></div>
                
                <div className="w-24 h-24 bg-secondary/10 border border-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8 glow-green transition-transform hover:scale-105 duration-500">
                    <CheckCircle className="text-secondary" size={48} />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-heading italic text-text mb-4">Ritual Complete</h1>
                <p className="text-subtext mb-12 text-lg italic leading-relaxed">"Every ending is the start of a new story." Your volumes are being prepared for their next chapter.</p>
                
                {shIds.length > 0 && !noteSaved && (
                    <div className="bg-surface border border-border p-8 rounded-2xl mb-12 text-left relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-secondary group-hover:scale-110 transition-transform duration-700">
                             <Feather size={60} />
                        </div>
                        
                        <div className="flex items-center gap-3 mb-4">
                             <div className="w-8 h-8 bg-secondary/10 border border-secondary/20 rounded-lg flex items-center justify-center text-secondary"><Feather size={16} /></div>
                             <h3 className="font-heading italic text-text text-xl">Etch a Journey Log</h3>
                        </div>
                        
                        <p className="text-sm text-subtext mb-6 leading-relaxed italic border-l-2 border-border pl-4">You've acquired a pre-owned vessel. Where will you take it? What do you hope to find within? Your words will travel with this volume forever.</p>
                        
                        <form onSubmit={handleSaveNote} className="space-y-4">
                            <textarea
                                required
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full bg-card border border-border rounded-xl p-5 text-sm text-text focus:outline-none focus:border-secondary/40 h-28 resize-none transition-colors"
                                placeholder="I found this volume on a misty morning..."
                            ></textarea>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-secondary text-primary px-8 py-3 rounded-xl font-bold text-sm hover:glow-green transition-all w-full flex items-center justify-center gap-2 disabled:opacity-40"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16}/> : <>Preserve Log <ArrowRight size={14}/></>}
                            </button>
                        </form>
                    </div>
                )}

                {noteSaved && (
                    <div className="bg-secondary/5 border border-secondary/20 p-6 rounded-2xl text-secondary font-bold text-sm mb-12 flex items-center justify-center gap-3 shadow-inner">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
                        Journal entry preserved in the book's eternal archive.
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                    <Link to="/orders" className="bg-text text-primary px-8 py-4 rounded-xl font-bold text-sm hover:scale-105 transition-all flex items-center justify-center gap-2">
                        <BookOpen size={16}/> My Library
                    </Link>
                    <Link to="/" className="bg-surface border border-border text-text px-8 py-4 rounded-xl font-bold text-sm hover:border-secondary/30 transition-all">
                        Return to Void
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
