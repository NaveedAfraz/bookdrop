import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, Loader2, Lock } from 'lucide-react';
import api from '../lib/api';

const ChapterReader: React.FC = () => {
    const { bookId, chapterNum } = useParams();
    const [chapter, setChapter] = useState<any>(null);
    const [book, setBook] = useState<any>(null);
    const [totalChapters, setTotalChapters] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchChapter();
    }, [bookId, chapterNum]);

    const fetchChapter = async () => {
        setLoading(true);
        setError('');
        try {
            const [bookRes, chapterRes] = await Promise.all([
                api.get(`/api/books/${bookId}`),
                api.get(`/api/chapters/${bookId}`)
            ]);
            setBook(bookRes.data);
            const chapters = chapterRes.data;
            setTotalChapters(chapters.length);
            const current = chapters.find((c: any) => c.chapter_number === parseInt(chapterNum || '1'));
            if (current) {
                if (!current.is_free) {
                    setError('locked');
                } else {
                    setChapter(current);
                }
            } else {
                setError('Chapter not found.');
            }
        } catch {
            setError('Failed to load chapter.');
        } finally {
            setLoading(false);
        }
    };

    const num = parseInt(chapterNum || '1');

    if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={32}/></div>;

    return (
        <div className="container mx-auto px-6 py-12 max-w-3xl">
            <Link to={`/books/${bookId}`} className="inline-flex items-center gap-2 text-subtext hover:text-secondary transition-colors text-[10px] font-bold uppercase tracking-widest mb-8 group">
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Back to Book
            </Link>

            {book && (
                <header className="mb-10">
                    <h1 className="text-3xl font-heading italic text-text mb-1">{book.title}</h1>
                    <p className="text-subtext italic text-sm">by {book.author}</p>
                </header>
            )}

            {error === 'locked' ? (
                <div className="bg-card border border-border rounded-2xl p-16 text-center">
                    <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-6 text-subtext">
                        <Lock size={28}/>
                    </div>
                    <h2 className="text-2xl font-heading italic text-text mb-3">Chapter Locked</h2>
                    <p className="text-subtext mb-8 max-w-sm mx-auto">Purchase this book to unlock all chapters and access the full reading experience.</p>
                    <Link to={`/books/${bookId}`} className="bg-secondary text-primary px-8 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2">
                        <BookOpen size={16}/> View Book
                    </Link>
                </div>
            ) : error ? (
                <div className="bg-card border border-border rounded-2xl p-16 text-center text-subtext">{error}</div>
            ) : chapter ? (
                <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-5 py-2 bg-secondary/10 text-secondary text-xs font-bold rounded-bl-2xl border-b border-l border-secondary/20">
                        Chapter {chapter.chapter_number}
                    </div>
                    <div className="prose prose-invert max-w-none mt-6">
                        <p className="text-text leading-[1.9] text-base whitespace-pre-line">{chapter.content}</p>
                    </div>
                </div>
            ) : null}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-border">
                {num > 1 ? (
                    <Link to={`/chapters/${bookId}/${num - 1}`} className="flex items-center gap-2 text-subtext hover:text-secondary transition-colors font-bold text-sm">
                        <ChevronLeft size={16}/> Previous
                    </Link>
                ) : <div/>}
                <span className="text-xs text-subtext font-bold">{num} / {totalChapters || '?'}</span>
                {num < totalChapters ? (
                    <Link to={`/chapters/${bookId}/${num + 1}`} className="flex items-center gap-2 text-subtext hover:text-secondary transition-colors font-bold text-sm">
                        Next <ChevronRight size={16}/>
                    </Link>
                ) : <div/>}
            </div>
        </div>
    );
};

export default ChapterReader;
